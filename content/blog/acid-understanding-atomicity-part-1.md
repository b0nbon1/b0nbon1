---
title: "ACID Database Properties with PostgreSQL: Part 2 - Atomicity"
date: 2025-11-04T10:00:00+03:00
description: "Understanding PostgreSQL Transactions before we explore ACID properties"
tags: ["Database", "ACID", "Atomicity", "Transactions", "PostgreSQL"]
series: ["ACID Database Properties"]
series_order: 2
author: "Bonvic Bundi"
---

Now that we understand what transactions are, let’s look at one of their most important properties: Atomicity. Atomicity simply means that all queries inside a transaction must succeed for any of them to take effect. They are treated as one indivisible unit or as the name suggests, an atom, which cannot be split apart. If even one query fails, everything had succeeded before it will be rolled back, leaving the database exactly as it was before the transaction started.

### The All-or-Nothing Principle

When we say a transaction is atomic, we mean:

- **Either all operations within the transaction are executed successfully**
- **Or none of them are executed at all**

There's no middle ground - you can't have a partially completed transaction.

## Real-World Example: Bank Transfer

Let's consider a classic example of transferring money between bank accounts:

```sql
BEGIN TRANSACTION;

-- Step 1: Deduct $100 from Account A
UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A123';

-- Step 2: Add $100 to Account B  
UPDATE accounts SET balance = balance + 100 WHERE account_id = 'B456';

COMMIT;
```

### Without Atomicity (Disaster Scenario)

Imagine if the database allowed partial execution:

1. ✅ Step 1 succeeds: $100 is deducted from Account A
2. ❌ Step 2 fails: Due to a system crash, Account B doesn't receive the money
3. 💸 Result: $100 vanishes into thin air!

### With Atomicity (Safe Scenario)

With atomic transactions:

1. ✅ Step 1 succeeds: $100 is deducted from Account A
2. ❌ Step 2 fails: System detects the failure
3. 🔄 Result: The entire transaction is rolled back - Account A gets its $100 back

## How Databases Implement Atomicity

### Transaction Logs

Most databases use **transaction logs** (also called write-ahead logs) to implement atomicity:

```
[Log Entry 1] Transaction 1001 BEGIN
[Log Entry 2] Transaction 1001: UPDATE accounts SET balance = 900 WHERE id = 'A123'
[Log Entry 3] Transaction 1001: UPDATE accounts SET balance = 600 WHERE id = 'B456'
[Log Entry 4] Transaction 1001 COMMIT
```

### Rollback Mechanism

If something goes wrong during the transaction:

```sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A123';
-- System crash occurs here!

-- Database automatically rolls back the transaction on restart
-- Account A's balance is restored to its original value
```

## Common Atomicity Violations to Avoid

### 1. Manual Transaction Management Without Proper Error Handling

```sql
-- BAD: No error handling
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A123';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B456';
COMMIT; -- What if the second UPDATE failed?
```

```sql
-- GOOD: Proper error handling with savepoints
BEGIN TRANSACTION;

-- Set up a savepoint for rollback
SAVEPOINT before_transfer;

-- Attempt the transfer
UPDATE accounts SET balance = balance - 100 WHERE id = 'A123';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B456';

-- Check if both accounts were affected
DO $$
DECLARE
    rows_affected INTEGER;
BEGIN
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    IF rows_affected = 0 THEN
        RAISE EXCEPTION 'Transfer failed: Account not found';
    END IF;
END $$;

-- If we get here, everything succeeded
COMMIT;

-- If any error occurs, PostgreSQL automatically rolls back
```

### 2. Committing Too Early

```sql
-- BAD: Premature commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A123';
COMMIT; -- Money is already gone!

-- If this fails, we've lost atomicity
UPDATE accounts SET balance = balance + 100 WHERE id = 'B456';
```

### 3. Not Using Transactions

```sql
-- BAD: Each statement executes independently without transaction
UPDATE accounts SET balance = balance - 100 WHERE id = 'A123'
-- If the next line fails, the first update is already permanent!
UPDATE accounts SET balance = balance + 100 WHERE id = 'B456'
```

## BONUS: How PostgreSQL Enforces Atomicity

PostgreSQL ensures atomicity through a mechanism called `Write-Ahead Logging` (WAL). Here’s what happens behind the scenes:
1. Every change inside a transaction is first written to a `WAL` file. A special transaction log on disk.
2. These logs record what will happen, not the actual data change yet.
3. When all queries succeed and you call `COMMIT`, PostgreSQL marks the transaction as complete in the WAL.
4. Only then are the actual changes written to the main data files.

If the database crashes before the `COMMIT`, PostgreSQL checks the WAL during restart and notices that the transaction was incomplete. It then `ROLLBACK` those changes and cleans up partial updates, keeping your data consistent. This crash-recovery process ensures that no partial transactions ever survive, exactly what atomicity promises.

## Wrapping up

In short, atomicity guarantees that your data changes happen as a single, all-or-nothing action. Whether it’s a normal failure or a sudden crash, Databases ensures that your database always ends up in a clean and consistent state.

If you have any questions drop them in the comment section below

Thanks for reading, cheers 🥂

