---
title: "ACID Database Properties with PostgreSQL: Part 2 - Isolation"
date: 2025-12-16T10:00:00+03:00
description: "Deep dive into database isolation - the 'I' in ACID. Learn about isolation levels, concurrent transactions, and how to prevent data race conditions."
tags: ["Database", "ACID", "Isolation", "Concurrency", "Transactions", "Postgresql"]
series: ["ACID Database Properties"]
series_order: 3
author: "Bonvic Bundi"
---

# Understanding Database Isolation

Welcome to Part 2 of our ACID database properties series! After our [introduction to transactions](/blog/acid-understanding-transactions-postgresql-part-0) and exploring [Atomicity](/blog/acid-understanding-atomicity-part-1), we now tackle one of the most complex and practical aspects: **Isolation**.

When multiple transactions run concurrently against your database, things can get messy. Isolation → the "I" in ACID → determines how and when changes made by one transaction become visible to others. In this post, we'll explore isolation through the lens of PostgreSQL, examining the problems that arise without proper isolation and how different isolation levels address them.

## What is Isolation?

Isolation ensures that concurrent execution of transactions leaves the database in the same state that would be obtained if the transactions were executed sequentially. In simpler terms: **transactions should not step on each other's toes**.

### The Core Question: Can My Transaction See Other Transactions' Changes?

Imagine you're running a query that calculates total sales while another process is actively inserting new orders. Should your calculation include those new orders? What if some of them get rolled back?

This is what isolation controls. Without it, you might read data that was never committed, see different results when running the same query twice, or encounter rows that mysteriously appear mid-transaction.

### PostgreSQL's MVCC: Multi-Version Concurrency Control

PostgreSQL uses **Multi-Version Concurrency Control (MVCC)** to handle concurrent transactions. Rather than locking rows when reading, PostgreSQL maintains multiple versions of each row. Each transaction sees a snapshot of the database, giving it a consistent view without blocking other transactions.

This approach provides excellent read performance—readers don't block writers, and writers don't block readers. Only writers block other writers on the same row.

> For a deeper dive into how MVCC works under the hood, check out our [introduction to transactions](/blog/acid-understanding-transactions-postgresql-part-0) where we cover MVCC in detail.

## Read Phenomena: What Can Go Wrong

The SQL standard defines three problematic scenarios that can occur when transactions aren't properly isolated.

### 1. Dirty Read

A dirty read happens when one transaction reads uncommitted changes from another transaction. If that other transaction rolls back, you've read data that never actually existed.

```sql
-- Transaction A
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
-- No COMMIT yet, transaction still open

-- Transaction B (if dirty reads were allowed)
SELECT balance FROM accounts WHERE id = 1;
-- Would see the uncommitted -500 change
-- If Transaction A rolls back, Transaction B read phantom data
```

**PostgreSQL prevents dirty reads at all isolation levels**—you'll never see uncommitted data from other transactions.

### 2. Non-Repeatable Read

This occurs when you read the same row twice within a transaction and get different values because another transaction modified and committed the row between your reads.

```sql
-- Transaction A
BEGIN;
SELECT price FROM products WHERE id = 42;
-- Returns: 99.99

-- Transaction B (runs and commits)
UPDATE products SET price = 149.99 WHERE id = 42;
COMMIT;

-- Back in Transaction A
SELECT price FROM products WHERE id = 42;
-- Returns: 149.99 (different from first read!)
COMMIT;
```

### 3. Phantom Read

Phantoms are rows that appear or disappear between queries in the same transaction. While non-repeatable reads involve existing rows changing, phantom reads involve the set of rows itself changing.

```sql
-- Transaction A
BEGIN;
SELECT COUNT(*) FROM orders WHERE status = 'pending';
-- Returns: 10

-- Transaction B (runs and commits)
INSERT INTO orders (status) VALUES ('pending');
COMMIT;

-- Back in Transaction A
SELECT COUNT(*) FROM orders WHERE status = 'pending';
-- Returns: 11 (a phantom row appeared!)
COMMIT;
```

## Isolation Levels in PostgreSQL

PostgreSQL supports three of the four SQL-standard isolation levels (it treats Read Uncommitted as Read Committed).

### 1. Read Committed (Default)

Each statement sees only data committed before that statement began. Different statements within the same transaction can see different committed data.

```sql
-- Set for current transaction
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Or set as session default
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

This level prevents dirty reads but allows non-repeatable reads and phantoms. It's PostgreSQL's default because it offers good performance with reasonable consistency for most applications.

**Use case**: Most OLTP operations, general application transactions

### 2. Repeatable Read

The transaction sees a snapshot of the database as it was when the transaction started. All queries see the same data, regardless of what other transactions commit.

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1;
-- Returns: 1000

-- Even if another transaction commits a change to this row,
-- subsequent reads in this transaction still return 1000

SELECT balance FROM accounts WHERE id = 1;
-- Still returns: 1000
COMMIT;
```

In PostgreSQL, Repeatable Read also prevents phantom reads (unlike the SQL standard minimum requirement). However, if you try to modify a row that another transaction has changed since your snapshot, you'll get a serialization error.

```sql
-- Transaction A
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM accounts WHERE id = 1;

-- Transaction B (commits while A is still open)
UPDATE accounts SET balance = 500 WHERE id = 1;
COMMIT;

-- Back in Transaction A
UPDATE accounts SET balance = balance + 100 WHERE id = 1;
-- ERROR: could not serialize access due to concurrent update
```

**Use case**: Reports requiring consistent snapshots, multi-step calculations

### 3. Serializable (Highest Isolation)

The strictest level. Transactions execute as if they ran one after another, with no overlap. PostgreSQL uses **Serializable Snapshot Isolation (SSI)** to detect conflicts without heavy locking.

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Your queries run here with full isolation guarantees

COMMIT;
```

Serializable prevents all anomalies but may throw serialization errors when it detects conflicting concurrent transactions.

**Use case**: Critical financial operations, inventory systems with strict consistency requirements

### Isolation Levels vs Read Phenomena

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-----------------|------------|---------------------|-------------|
| Read Uncommitted* | Not possible | Possible | Possible |
| Read Committed | Not possible | Possible | Possible |
| Repeatable Read | Not possible | Not possible | Not possible** |
| Serializable | Not possible | Not possible | Not possible |

*PostgreSQL treats Read Uncommitted as Read Committed  
**PostgreSQL's Repeatable Read prevents phantoms, exceeding the SQL standard requirement

## Choosing the Right Isolation Level

Match your isolation level to your application's needs:

```sql
-- For most OLTP operations, Read Committed is fine
BEGIN;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;
COMMIT;

-- For reports requiring consistent snapshots
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT department, SUM(salary) FROM employees GROUP BY department;
SELECT COUNT(*) FROM employees;
-- Both queries see the same snapshot
COMMIT;

-- For operations requiring perfect consistency
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Critical banking operation
SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### Check Your Current Isolation Level

```sql
SHOW transaction_isolation;
-- Returns: read committed (default)
```

## Handling Serialization Failures

When using Repeatable Read or Serializable, your application must retry failed transactions. Here's the pattern in PostgreSQL:

```sql
-- Transaction 1
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Transaction 2 (concurrent)
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
-- ERROR: could not serialize access due to concurrent update
-- You must ROLLBACK and retry
ROLLBACK;
```

### Implementing Retry Logic

Your application code should handle serialization failures gracefully. The error code to catch is `40001` (serialization_failure) or `40P01` (deadlock_detected):

```sql
-- Pseudo-code pattern for retry logic
DO $$
DECLARE
    max_attempts INT := 3;
    attempt INT := 0;
BEGIN
    LOOP
        attempt := attempt + 1;
        
        BEGIN
            -- Your transaction code here
            -- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
            -- ... your queries ...
            EXIT; -- Success, exit loop
            
        EXCEPTION
            WHEN serialization_failure OR deadlock_detected THEN
                IF attempt >= max_attempts THEN
                    RAISE;
                END IF;
                -- Wait a bit before retry (exponential backoff)
                PERFORM pg_sleep(power(2, attempt) * random());
        END;
    END LOOP;
END $$;
```

## Explicit Locking in PostgreSQL

Sometimes you need guarantees beyond what isolation levels provide. PostgreSQL offers several locking mechanisms:

### Row-Level Locking with FOR UPDATE

```sql
-- Lock rows you intend to update
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Other transactions trying to modify this row will wait
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### FOR UPDATE NOWAIT

Fail immediately if the row is already locked:

```sql
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;
-- ERROR: could not obtain lock on row in relation "accounts"
-- Instead of waiting, fail immediately
```

### FOR UPDATE SKIP LOCKED

Skip over locked rows, useful for job queues:

```sql
-- Process the next available job without waiting
BEGIN;
SELECT * FROM jobs 
WHERE status = 'pending' 
FOR UPDATE SKIP LOCKED 
LIMIT 1;

-- Update the job status
UPDATE jobs SET status = 'processing' WHERE id = <selected_id>;
COMMIT;
```

### Locking Strength Variants

PostgreSQL provides different locking strengths:

```sql
-- FOR UPDATE: Strongest, blocks all operations
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;

-- FOR NO KEY UPDATE: Allows foreign key checks
SELECT * FROM accounts WHERE id = 1 FOR NO KEY UPDATE;

-- FOR SHARE: Allows other reads, blocks writes
SELECT * FROM accounts WHERE id = 1 FOR SHARE;

-- FOR KEY SHARE: Weakest, only blocks DELETE and key updates
SELECT * FROM accounts WHERE id = 1 FOR KEY SHARE;
```

## Advisory Locks for Application-Level Coordination

For complex scenarios, advisory locks let you coordinate at the application level:

```sql
-- Acquire a lock (blocks until available)
SELECT pg_advisory_lock(12345);

-- Do your work...
-- This lock is held at the session level

-- Release when done
SELECT pg_advisory_unlock(12345);
```

### Transaction-Scoped Advisory Locks

These automatically release on commit or rollback:

```sql
BEGIN;
-- Acquire transaction-level lock
SELECT pg_advisory_xact_lock(12345);

-- Your transaction work here
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;

COMMIT; -- Lock automatically released
```

### Try Lock (Non-Blocking)

Attempt to acquire a lock without waiting:

```sql
-- Returns true if lock acquired, false if already held
SELECT pg_try_advisory_lock(12345);

-- Do work if lock was acquired
-- Remember to unlock!
SELECT pg_advisory_unlock(12345);
```

## Real-World Example: Bank Transfer with Proper Isolation

Here's a complete example showing how to implement a bank transfer with proper isolation and error handling:

```sql
-- Setup: Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    holder_name TEXT NOT NULL,
    balance NUMERIC(12, 2) NOT NULL CHECK (balance >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO accounts (id, holder_name, balance) 
VALUES (1, 'Alice', 1000.00), (2, 'Bob', 500.00);

-- Transfer function with SERIALIZABLE isolation
BEGIN ISOLATION LEVEL SERIALIZABLE;

-- Lock and read the source account
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- Returns: 1000.00

-- Verify sufficient funds
DO $$
DECLARE
    source_balance NUMERIC;
    transfer_amount NUMERIC := 300.00;
BEGIN
    SELECT balance INTO source_balance FROM accounts WHERE id = 1;
    
    IF source_balance < transfer_amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;
END $$;

-- Perform the transfer
UPDATE accounts SET balance = balance - 300.00, updated_at = CURRENT_TIMESTAMP WHERE id = 1;
UPDATE accounts SET balance = balance + 300.00, updated_at = CURRENT_TIMESTAMP WHERE id = 2;

-- Verify the transfer
SELECT id, holder_name, balance FROM accounts WHERE id IN (1, 2);

COMMIT;
```

## Practical Guidelines for PostgreSQL

### Start with Read Committed

It's the default for good reason—it prevents dirty reads while maintaining excellent concurrency:

```sql
-- Most operations work well with Read Committed
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 42;
INSERT INTO orders (product_id, quantity) VALUES (42, 1);
COMMIT;
```

### Use Repeatable Read for Consistent Snapshots

When you need consistent reads across multiple queries:

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;

-- Generate a report with consistent data
SELECT department, SUM(salary) as total_salary 
FROM employees 
GROUP BY department;

SELECT COUNT(*) as employee_count FROM employees;

-- Both queries see the same snapshot
COMMIT;
```

### Reserve Serializable for Critical Operations

Where correctness is paramount and you can handle retries:

```sql
-- Financial transaction requiring perfect consistency
BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- Verify business rules
-- Perform updates
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT; -- May fail with serialization error, requiring retry
```

### Keep Transactions Short

```sql
-- BAD: Long-running transaction holding locks
BEGIN;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;
-- Don't do expensive operations here!
-- PERFORM send_email_notification(); -- NO!
-- PERFORM generate_report(); -- NO!
COMMIT;

-- GOOD: Keep transaction focused
BEGIN;
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;
COMMIT;
-- Do expensive operations outside transaction
-- send_email_notification();
-- generate_report();
```

## Monitoring and Debugging Isolation Issues

### Check for Blocking Queries

```sql
-- See what's blocking your queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### View Active Transactions

```sql
-- See all active transactions
SELECT 
    pid,
    usename,
    state,
    query_start,
    state_change,
    query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

### Check for Long-Running Transactions

```sql
-- Find transactions running for more than 1 minute
SELECT 
    pid,
    now() - query_start AS duration,
    usename,
    query
FROM pg_stat_activity
WHERE state != 'idle'
    AND now() - query_start > interval '1 minute'
ORDER BY duration DESC;
```

## Best Practices for Isolation

1. **Start with Read Committed** for most operations—excellent performance with reasonable consistency
2. **Use Repeatable Read** when you need consistent snapshots across multiple queries
3. **Reserve Serializable** for operations where correctness is paramount
4. **Keep transactions short** to minimize lock contention and blocking
5. **Implement retry logic** for serialization failures at Repeatable Read and Serializable levels
6. **Use explicit locking** (FOR UPDATE) when you need fine-grained control
7. **Monitor blocking queries** and long-running transactions in production
8. **Test under concurrent load** to verify isolation behavior

## Key Takeaways

- **Isolation controls how concurrent transactions interact** and what data they can see
- **PostgreSQL's MVCC** provides excellent read performance—readers don't block writers
- **Read Committed is the default** and right choice for most applications
- **Higher isolation levels** trade concurrency for consistency
- **Serialization failures are normal** at higher isolation levels—implement retry logic
- **Explicit locking** (FOR UPDATE variants) gives fine-grained control when needed
- **Advisory locks** enable application-level coordination for complex scenarios

## Wrapping Up

Isolation determines how your transactions interact with concurrent database activity. PostgreSQL's MVCC implementation provides strong defaults—you'll never see dirty reads, and Repeatable Read prevents phantoms beyond what the SQL standard requires.

The key is understanding the trade-offs: **Read Committed** offers the best performance with protection against dirty reads; **Repeatable Read** adds consistent snapshots at the cost of potential serialization errors; **Serializable** guarantees perfect isolation but requires robust retry logic.

Pick the isolation level that matches your consistency requirements, handle serialization failures gracefully, and use explicit locking when you need fine-grained control. With these tools, you can build applications that handle concurrency correctly without sacrificing performance.

Remember: higher isolation isn't always better. Each level trades concurrency for consistency. Choose based on what your application actually needs.

## What's Next?

In the next part of our ACID series, we'll explore **Consistency**—how databases ensure that transactions move the database from one valid state to another, maintaining all defined rules, constraints, and triggers.

Stay tuned for [Part 3: Consistency](/blog/acid-database-properties-part-3-consistency), where we'll learn how PostgreSQL enforces data integrity through constraints, triggers, and validation rules!

---

*Questions about isolation levels? Experiencing concurrency issues in your PostgreSQL database? Let's discuss in the comments below!*
