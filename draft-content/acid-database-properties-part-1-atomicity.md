---
title: "ACID Database Properties: Part 1 - Atomicity"
date: 2024-01-15T10:00:00+03:00
description: "Understanding database atomicity - the 'A' in ACID. Learn how atomicity ensures that database operations are either fully completed or not executed at all."
tags: ["Database", "ACID", "Atomicity", "Transactions"]
series: ["ACID Database Properties"]
series_order: 1
author: "Bonvic Bundi"
---

# Understanding Database Atomicity

Welcome to our comprehensive series on ACID database properties! In this first part, we'll dive deep into **Atomicity** - the fundamental principle that ensures database operations are all-or-nothing.

## What is Atomicity?

Atomicity is one of the four key properties that guarantee database transactions are processed reliably. The term "atomicity" comes from the Greek word "atomos," meaning indivisible. In database context, atomicity means that a transaction is treated as a single, indivisible unit of work.

### The All-or-Nothing Principle

When we say a transaction is atomic, we mean:

- **Either all operations within the transaction are executed successfully**
- **Or none of them are executed at all**

There's no middle ground - you can't have a partially completed transaction.

## Real-World Example: Bank Transfer

Let's consider a classic example - transferring money between bank accounts:

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

## Code Examples in Different Languages

### Python with SQLite

```python
import sqlite3

def transfer_money(conn, from_account, to_account, amount):
    try:
        # Start transaction (auto-begin)
        cursor = conn.cursor()
        
        # Deduct from source account
        cursor.execute(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            (amount, from_account)
        )
        
        # Add to destination account
        cursor.execute(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?", 
            (amount, to_account)
        )
        
        # Commit transaction - makes it atomic
        conn.commit()
        print(f"Transfer of ${amount} completed successfully")
        
    except Exception as e:
        # Rollback on any error - preserves atomicity
        conn.rollback()
        print(f"Transfer failed: {e}")
```

### Node.js with PostgreSQL

```javascript
const { Client } = require('pg');

async function transferMoney(client, fromAccount, toAccount, amount) {
    try {
        // Begin transaction
        await client.query('BEGIN');
        
        // Deduct from source
        await client.query(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
            [amount, fromAccount]
        );
        
        // Add to destination
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [amount, toAccount]
        );
        
        // Commit - makes it atomic
        await client.query('COMMIT');
        console.log(`Transfer of $${amount} completed`);
        
    } catch (error) {
        // Rollback preserves atomicity
        await client.query('ROLLBACK');
        console.error('Transfer failed:', error.message);
    }
}
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

### 2. Committing Too Early

```sql
-- BAD: Premature commit
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A123';
COMMIT; -- Money is already gone!

-- If this fails, we've lost atomicity
UPDATE accounts SET balance = balance + 100 WHERE id = 'B456';
```

### 3. Autocommit Mode

```python
# BAD: Each statement commits automatically
cursor.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 'A123'")
# If the next line fails, the first update is already permanent!
cursor.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 'B456'")
```

## Testing Atomicity

Here's how you can test if your database properly implements atomicity:

```python
import sqlite3
import threading
import time

def test_atomicity():
    conn = sqlite3.connect('test.db')
    
    # Create test accounts
    conn.execute("CREATE TABLE IF NOT EXISTS accounts (id TEXT, balance INTEGER)")
    conn.execute("INSERT OR REPLACE INTO accounts VALUES ('A123', 1000)")
    conn.execute("INSERT OR REPLACE INTO accounts VALUES ('B456', 500)")
    conn.commit()
    
    def failing_transfer():
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 'A123'")
            time.sleep(1)  # Simulate processing time
            
            # Simulate failure
            raise Exception("Simulated system failure!")
            
            cursor.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 'B456'")
            conn.commit()
        except:
            conn.rollback()  # This should restore atomicity
    
    # Test the failing transfer
    failing_transfer()
    
    # Check if atomicity was preserved
    result = conn.execute("SELECT balance FROM accounts WHERE id = 'A123'").fetchone()
    assert result[0] == 1000, "Atomicity violated! Money was lost."
    print("✅ Atomicity test passed!")

test_atomicity()
```

## Key Takeaways

1. **Atomicity ensures all-or-nothing execution** of database transactions
2. **Use proper transaction management** with BEGIN, COMMIT, and ROLLBACK
3. **Always handle errors** and rollback when something goes wrong
4. **Avoid autocommit mode** for multi-statement transactions
5. **Test your atomicity** implementation thoroughly

## What's Next?

In the next part of our ACID series, we'll explore **Consistency** - how databases ensure that transactions move from one valid state to another valid state, maintaining all defined rules and constraints.

Stay tuned for Part 2: Consistency, where we'll dive into referential integrity, check constraints, and business rule enforcement!

---

**Series Navigation**: This is Part 1 of our ACID Database Properties series. [Continue to Part 2: Consistency →](#)

*Have questions about atomicity? Found this helpful? Let me know on [Twitter @b0nvic](https://twitter.com/b0nvic)!*
