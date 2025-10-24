---
title: "ACID Database Properties: Part 3 - Isolation"
date: 2024-01-29T10:00:00+03:00
description: "Deep dive into database isolation - the 'I' in ACID. Learn about isolation levels, concurrent transactions, and how to prevent data race conditions."
tags: ["Database", "ACID", "Isolation", "Concurrency", "Transactions"]
series: ["ACID Database Properties"]
series_order: 3
author: "Bonvic Bundi"
---

# Understanding Database Isolation

Welcome to Part 3 of our ACID database properties series! After covering [Atomicity](../acid-database-properties-part-1-atomicity/) and [Consistency](../acid-database-properties-part-2-consistency/), we now tackle one of the most complex aspects: **Isolation**.

Isolation determines how transaction integrity is visible to other users and systems. It's about managing concurrent access to ensure transactions don't interfere with each other.

## What is Isolation?

Isolation ensures that concurrent execution of transactions leaves the database in the same state that would be obtained if the transactions were executed sequentially. In simpler terms: **transactions should not step on each other's toes**.

## The Problems Isolation Solves

Without proper isolation, concurrent transactions can cause several issues:

### 1. Dirty Read

One transaction reads data written by another **uncommitted** transaction.

```sql
-- Transaction A
BEGIN TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE id = 'A123';
-- Transaction A has not committed yet!

-- Transaction B (simultaneously)
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 'A123'; 
-- Returns 1000 (dirty read!)

-- Transaction A rolls back
ROLLBACK;

-- Transaction B thinks the balance is 1000, but it's actually the original value!
```

### 2. Non-Repeatable Read

A transaction reads the same row twice and gets different values.

```sql
-- Transaction A
BEGIN TRANSACTION;
SELECT balance FROM accounts WHERE id = 'A123'; -- Returns $500

-- Transaction B (meanwhile)
BEGIN TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE id = 'A123';
COMMIT;

-- Transaction A reads again
SELECT balance FROM accounts WHERE id = 'A123'; -- Returns $1000 (different!)
COMMIT;
```

### 3. Phantom Read

A transaction re-executes a query and finds additional rows that satisfy the condition.

```sql
-- Transaction A
BEGIN TRANSACTION;
SELECT COUNT(*) FROM orders WHERE amount > 1000; -- Returns 5

-- Transaction B (meanwhile)
BEGIN TRANSACTION;
INSERT INTO orders (id, amount) VALUES (999, 1500);
COMMIT;

-- Transaction A re-runs the same query
SELECT COUNT(*) FROM orders WHERE amount > 1000; -- Returns 6 (phantom!)
COMMIT;
```

## Isolation Levels

SQL standard defines four isolation levels that provide different trade-offs between consistency and performance:

### 1. Read Uncommitted (Lowest Isolation)

- **Allows**: Dirty reads, non-repeatable reads, phantom reads
- **Performance**: Highest (no locks)
- **Use case**: Data warehousing, reporting where exact consistency isn't critical

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN TRANSACTION;
-- Can read uncommitted data from other transactions
SELECT * FROM accounts;
COMMIT;
```

### 2. Read Committed (Default in most databases)

- **Prevents**: Dirty reads
- **Allows**: Non-repeatable reads, phantom reads
- **Performance**: Good
- **Use case**: Most applications

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
-- Will only read committed data
SELECT * FROM accounts;
COMMIT;
```

### 3. Repeatable Read

- **Prevents**: Dirty reads, non-repeatable reads
- **Allows**: Phantom reads
- **Performance**: Moderate
- **Use case**: Applications requiring consistent point-in-time views

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
-- Same row will return same value throughout transaction
SELECT balance FROM accounts WHERE id = 'A123'; -- $500
-- Other transactions can't modify this row
SELECT balance FROM accounts WHERE id = 'A123'; -- Still $500
COMMIT;
```

### 4. Serializable (Highest Isolation)

- **Prevents**: All read phenomena
- **Performance**: Lowest (significant locking)
- **Use case**: Critical financial operations

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
-- Complete isolation - as if transactions run one after another
SELECT * FROM accounts WHERE balance > 1000;
COMMIT;
```

## Real-World Example: Banking System

Let's implement a banking system with different isolation levels:

### Python Implementation

```python
import sqlite3
import threading
import time
from enum import Enum

class IsolationLevel(Enum):
    READ_UNCOMMITTED = "READ UNCOMMITTED"
    READ_COMMITTED = "READ COMMITTED"  
    REPEATABLE_READ = "REPEATABLE READ"
    SERIALIZABLE = "SERIALIZABLE"

class BankingSystem:
    def __init__(self, db_path):
        self.db_path = db_path
        self.setup_database()
    
    def setup_database(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                balance DECIMAL(10,2),
                version INTEGER DEFAULT 0
            )
        ''')
        conn.execute("INSERT OR REPLACE INTO accounts VALUES ('A123', 1000.00, 0)")
        conn.execute("INSERT OR REPLACE INTO accounts VALUES ('B456', 500.00, 0)")
        conn.commit()
        conn.close()
    
    def get_connection(self, isolation_level=IsolationLevel.READ_COMMITTED):
        conn = sqlite3.connect(self.db_path)
        # SQLite doesn't support all isolation levels, but we'll simulate
        if isolation_level == IsolationLevel.SERIALIZABLE:
            conn.execute("PRAGMA read_uncommitted = 0")
        return conn
    
    def transfer_with_isolation(self, from_account, to_account, amount, 
                              isolation_level=IsolationLevel.READ_COMMITTED):
        conn = self.get_connection(isolation_level)
        
        try:
            # Simulate different isolation behaviors
            if isolation_level == IsolationLevel.SERIALIZABLE:
                # Lock the entire accounts table
                conn.execute("BEGIN EXCLUSIVE TRANSACTION")
            else:
                conn.execute("BEGIN TRANSACTION")
            
            print(f"[{threading.current_thread().name}] Starting transfer: "
                  f"{from_account} -> {to_account}, Amount: ${amount}")
            
            # Read current balances
            cursor = conn.cursor()
            cursor.execute("SELECT balance FROM accounts WHERE id = ?", (from_account,))
            from_balance = cursor.fetchone()[0]
            
            cursor.execute("SELECT balance FROM accounts WHERE id = ?", (to_account,))
            to_balance = cursor.fetchone()[0]
            
            print(f"[{threading.current_thread().name}] Initial balances: "
                  f"{from_account}=${from_balance}, {to_account}=${to_balance}")
            
            # Simulate processing time
            time.sleep(1)
            
            # Check if sufficient funds
            if from_balance < amount:
                raise ValueError("Insufficient funds")
            
            # Update balances
            cursor.execute(
                "UPDATE accounts SET balance = balance - ? WHERE id = ?",
                (amount, from_account)
            )
            
            cursor.execute(
                "UPDATE accounts SET balance = balance + ? WHERE id = ?", 
                (amount, to_account)
            )
            
            # Read final balances
            cursor.execute("SELECT balance FROM accounts WHERE id = ?", (from_account,))
            final_from = cursor.fetchone()[0]
            
            cursor.execute("SELECT balance FROM accounts WHERE id = ?", (to_account,))
            final_to = cursor.fetchone()[0]
            
            conn.commit()
            
            print(f"[{threading.current_thread().name}] Transfer completed: "
                  f"{from_account}=${final_from}, {to_account}=${final_to}")
                  
        except Exception as e:
            conn.rollback()
            print(f"[{threading.current_thread().name}] Transfer failed: {e}")
        finally:
            conn.close()
    
    def demonstrate_isolation_levels(self):
        """Demonstrate different isolation levels with concurrent transactions"""
        
        print("=== Demonstrating READ COMMITTED ===")
        # Two concurrent transfers with READ COMMITTED
        t1 = threading.Thread(
            target=self.transfer_with_isolation,
            args=('A123', 'B456', 100, IsolationLevel.READ_COMMITTED),
            name="T1-READ_COMMITTED"
        )
        
        t2 = threading.Thread(
            target=self.transfer_with_isolation,
            args=('B456', 'A123', 50, IsolationLevel.READ_COMMITTED),
            name="T2-READ_COMMITTED"
        )
        
        t1.start()
        t2.start()
        t1.join()
        t2.join()
        
        time.sleep(2)
        
        print("\n=== Demonstrating SERIALIZABLE ===")
        # Reset balances
        self.setup_database()
        
        # Two concurrent transfers with SERIALIZABLE
        t3 = threading.Thread(
            target=self.transfer_with_isolation,
            args=('A123', 'B456', 100, IsolationLevel.SERIALIZABLE),
            name="T3-SERIALIZABLE"
        )
        
        t4 = threading.Thread(
            target=self.transfer_with_isolation,
            args=('B456', 'A123', 50, IsolationLevel.SERIALIZABLE),
            name="T4-SERIALIZABLE"
        )
        
        t3.start()
        t4.start()
        t3.join()
        t4.join()

# Usage
banking = BankingSystem('banking.db')
banking.demonstrate_isolation_levels()
```

### Node.js with PostgreSQL

```javascript
const { Pool } = require('pg');

class TransactionManager {
    constructor(pool) {
        this.pool = pool;
    }
    
    async withIsolation(isolationLevel, callback) {
        const client = await this.pool.connect();
        
        try {
            // Set isolation level
            await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
            await client.query('BEGIN');
            
            const result = await callback(client);
            
            await client.query('COMMIT');
            return result;
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    async demonstratePhantomRead() {
        console.log('=== Demonstrating Phantom Read ===');
        
        // Transaction 1: Count orders
        const t1 = this.withIsolation('READ COMMITTED', async (client) => {
            console.log('T1: First count');
            const result1 = await client.query(
                'SELECT COUNT(*) as count FROM orders WHERE amount > $1', [1000]
            );
            console.log(`T1: Found ${result1.rows[0].count} orders > $1000`);
            
            // Wait for T2 to insert
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('T1: Second count');
            const result2 = await client.query(
                'SELECT COUNT(*) as count FROM orders WHERE amount > $1', [1000]
            );
            console.log(`T1: Found ${result2.rows[0].count} orders > $1000`);
            
            return result2.rows[0].count;
        });
        
        // Transaction 2: Insert order
        const t2 = new Promise(resolve => {
            setTimeout(async () => {
                await this.withIsolation('READ COMMITTED', async (client) => {
                    console.log('T2: Inserting new order');
                    await client.query(
                        'INSERT INTO orders (amount, customer_id) VALUES ($1, $2)',
                        [1500, 'CUST001']
                    );
                    console.log('T2: Order inserted');
                });
                resolve();
            }, 1000);
        });
        
        await Promise.all([t1, t2]);
    }
    
    async demonstrateSerializableIsolation() {
        console.log('\n=== Demonstrating Serializable Isolation ===');
        
        const t1 = this.withIsolation('SERIALIZABLE', async (client) => {
            console.log('T1: First count (SERIALIZABLE)');
            const result1 = await client.query(
                'SELECT COUNT(*) as count FROM orders WHERE amount > $1', [1000]
            );
            console.log(`T1: Found ${result1.rows[0].count} orders > $1000`);
            
            // Wait for T2 to attempt insert
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('T1: Second count (SERIALIZABLE)');
            const result2 = await client.query(
                'SELECT COUNT(*) as count FROM orders WHERE amount > $1', [1000]
            );
            console.log(`T1: Found ${result2.rows[0].count} orders > $1000`);
            
            return result2.rows[0].count;
        });
        
        const t2 = new Promise(resolve => {
            setTimeout(async () => {
                try {
                    await this.withIsolation('SERIALIZABLE', async (client) => {
                        console.log('T2: Attempting to insert (SERIALIZABLE)');
                        await client.query(
                            'INSERT INTO orders (amount, customer_id) VALUES ($1, $2)',
                            [1600, 'CUST002']
                        );
                        console.log('T2: Order inserted successfully');
                    });
                } catch (error) {
                    console.log('T2: Insert failed due to serialization conflict');
                }
                resolve();
            }, 1000);
        });
        
        await Promise.all([t1, t2]);
    }
}
```

## Optimistic vs Pessimistic Locking

### Pessimistic Locking

Lock resources immediately to prevent conflicts:

```sql
-- Pessimistic approach: Lock the row
BEGIN TRANSACTION;

SELECT balance FROM accounts WHERE id = 'A123' FOR UPDATE;
-- Row is now locked, other transactions must wait

UPDATE accounts SET balance = balance - 100 WHERE id = 'A123';

COMMIT; -- Releases the lock
```

### Optimistic Locking

Assume conflicts are rare, check for conflicts before committing:

```python
def optimistic_update(account_id, amount):
    """Update using optimistic locking with version numbers"""
    
    while True:
        try:
            # Read current state including version
            cursor.execute(
                "SELECT balance, version FROM accounts WHERE id = ?",
                (account_id,)
            )
            balance, version = cursor.fetchone()
            
            new_balance = balance - amount
            if new_balance < 0:
                raise ValueError("Insufficient funds")
            
            # Update only if version hasn't changed
            cursor.execute(
                "UPDATE accounts SET balance = ?, version = version + 1 "
                "WHERE id = ? AND version = ?",
                (new_balance, account_id, version)
            )
            
            if cursor.rowcount == 0:
                # Version changed, retry
                print("Optimistic lock failed, retrying...")
                continue
            
            conn.commit()
            print("Update successful")
            break
            
        except Exception as e:
            conn.rollback()
            raise
```

## Best Practices for Isolation

### 1. Choose the Right Isolation Level

```python
class TransactionService:
    def get_isolation_level(self, operation_type):
        """Choose isolation level based on operation criticality"""
        
        if operation_type == 'financial_transfer':
            return 'SERIALIZABLE'  # Highest consistency needed
        elif operation_type == 'inventory_update':
            return 'REPEATABLE READ'  # Prevent double-booking
        elif operation_type == 'user_profile_read':
            return 'READ COMMITTED'  # Balance performance and consistency
        elif operation_type == 'analytics_report':
            return 'READ UNCOMMITTED'  # Performance over consistency
        
        return 'READ COMMITTED'  # Safe default
```

### 2. Keep Transactions Short

```python
# BAD: Long-running transaction
def bad_order_processing():
    conn.execute("BEGIN TRANSACTION")
    
    # This transaction runs for too long!
    process_inventory()      # 5 seconds
    send_email_notification()  # 10 seconds  
    update_analytics()       # 8 seconds
    
    conn.execute("COMMIT")   # Locks held for 23 seconds!

# GOOD: Split into smaller transactions
def good_order_processing():
    # Transaction 1: Critical inventory update
    with transaction():
        process_inventory()  # 5 seconds, locks released quickly
    
    # Non-transactional: Background tasks
    send_email_notification()  # No locks held
    
    # Transaction 2: Analytics update  
    with transaction():
        update_analytics()     # Separate transaction
```

### 3. Handle Deadlocks Gracefully

```python
import time
import random

def handle_deadlock_retry(func, max_retries=3):
    """Retry function with exponential backoff on deadlock"""
    
    for attempt in range(max_retries):
        try:
            return func()
        except DeadlockError:
            if attempt == max_retries - 1:
                raise
            
            # Exponential backoff with jitter
            delay = (2 ** attempt) + random.uniform(0, 1)
            print(f"Deadlock detected, retrying in {delay:.2f}s...")
            time.sleep(delay)
```

## Testing Isolation

```python
def test_isolation_levels():
    """Test different isolation level behaviors"""
    
    def test_dirty_read():
        """Verify READ COMMITTED prevents dirty reads"""
        # Setup: Two transactions, one uncommitted
        
        # Transaction 1: Update but don't commit
        conn1 = get_connection()
        conn1.execute("BEGIN TRANSACTION")
        conn1.execute("UPDATE accounts SET balance = 999 WHERE id = 'A123'")
        # Don't commit yet!
        
        # Transaction 2: Try to read the uncommitted value
        conn2 = get_connection()
        conn2.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED")
        conn2.execute("BEGIN TRANSACTION")
        
        result = conn2.execute("SELECT balance FROM accounts WHERE id = 'A123'")
        balance = result.fetchone()[0]
        
        # Should read the original committed value, not 999
        assert balance != 999, "Dirty read occurred!"
        
        conn1.execute("ROLLBACK")
        conn2.execute("COMMIT")
        
        print("✅ Dirty read prevention test passed")
    
    def test_phantom_read():
        """Test phantom read behavior"""
        conn = get_connection()
        conn.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ")
        conn.execute("BEGIN TRANSACTION")
        
        # First count
        result1 = conn.execute("SELECT COUNT(*) FROM orders WHERE amount > 1000")
        count1 = result1.fetchone()[0]
        
        # Another transaction inserts a row (simulate with a separate connection)
        other_conn = get_connection()
        other_conn.execute("INSERT INTO orders (amount) VALUES (1500)")
        other_conn.commit()
        
        # Second count in same transaction
        result2 = conn.execute("SELECT COUNT(*) FROM orders WHERE amount > 1000")
        count2 = result2.fetchone()[0]
        
        # With REPEATABLE READ, phantom reads may still occur
        # With SERIALIZABLE, count2 should equal count1
        
        conn.execute("COMMIT")
        
        print(f"First count: {count1}, Second count: {count2}")
        
    test_dirty_read()
    test_phantom_read()
```

## Key Takeaways

1. **Isolation prevents concurrent transaction interference**
2. **Higher isolation = better consistency but lower performance**
3. **Choose isolation level based on your use case**
4. **Keep transactions short to minimize lock contention**
5. **Handle deadlocks with retry logic**
6. **Test isolation behavior under concurrent load**
7. **Consider optimistic locking for high-contention scenarios**

## What's Next?

In the final part of our ACID series, we'll explore **Durability** - how databases ensure that committed transactions survive system failures, power outages, and crashes. We'll cover write-ahead logging, checkpoints, and disaster recovery strategies.

Stay tuned for Part 4: Durability, where we'll learn how databases guarantee that your data persists!

---

*Questions about isolation levels? Experiencing concurrency issues? Let's discuss on [Twitter @b0nvic](https://twitter.com/b0nvic)!*
