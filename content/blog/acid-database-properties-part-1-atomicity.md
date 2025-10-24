---
title: "ACID Database Properties with Postgresql: Part 1 - Atomicity"
date: 2025-10-24T10:00:00+03:00
description: "Understanding database atomicity - the 'A' in ACID. Learn how atomicity ensures that database operations are either fully completed or not executed at all."
tags: ["Database", "ACID", "Atomicity", "Transactions", "Postgresql"]
series: ["ACID Database Properties"]
series_order: 1
author: "Bonvic Bundi"
---

# Understanding Database Atomicity

Welcome to my comprehensive series on ACID database properties! In this first part, we'll dive deep into **Atomicity** - the fundamental principle that ensures database operations are all-or-nothing.

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

## Code Examples in Go

### Go with PostgreSQL

```go
package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func transferMoney(db *sql.DB, fromAccount, toAccount string, amount int) error {
	// Begin transaction
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	// Defer rollback - will be a no-op if commit succeeds
	defer tx.Rollback()

	// Deduct from source
	_, err = tx.Exec(
		"UPDATE accounts SET balance = balance - $1 WHERE id = $2",
		amount, fromAccount,
	)
	if err != nil {
		return fmt.Errorf("failed to deduct from account: %w", err)
	}

	// Add to destination
	_, err = tx.Exec(
		"UPDATE accounts SET balance = balance + $1 WHERE id = $2",
		amount, toAccount,
	)
	if err != nil {
		return fmt.Errorf("failed to add to account: %w", err)
	}

	// Commit - makes it atomic
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit: %w", err)
	}

	log.Printf("Transfer of $%d completed\n", amount)
	return nil
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

### 3. Not Using Transactions

```go
// BAD: Each statement executes independently without transaction
db.Exec("UPDATE accounts SET balance = balance - 100 WHERE id = 'A123'")
// If the next line fails, the first update is already permanent!
db.Exec("UPDATE accounts SET balance = balance + 100 WHERE id = 'B456'")
```

## Testing Atomicity

Here's how you can test if your database properly implements atomicity:

```go
package main

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

func testAtomicity() error {
	// Connection string for PostgreSQL
	connStr := "host=localhost port=5432 user=postgres password=postgres dbname=testdb sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	defer db.Close()

	// Create test accounts table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS accounts (
			id TEXT PRIMARY KEY,
			balance INTEGER NOT NULL
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create table: %w", err)
	}

	// Insert or update test accounts
	_, err = db.Exec(`
		INSERT INTO accounts (id, balance) VALUES ('A123', 1000)
		ON CONFLICT (id) DO UPDATE SET balance = 1000
	`)
	if err != nil {
		return fmt.Errorf("failed to insert account A123: %w", err)
	}

	_, err = db.Exec(`
		INSERT INTO accounts (id, balance) VALUES ('B456', 500)
		ON CONFLICT (id) DO UPDATE SET balance = 500
	`)
	if err != nil {
		return fmt.Errorf("failed to insert account B456: %w", err)
	}

	// Function that simulates a failing transfer
	failingTransfer := func() error {
		tx, err := db.Begin()
		if err != nil {
			return err
		}
		defer tx.Rollback() // This should restore atomicity

		_, err = tx.Exec("UPDATE accounts SET balance = balance - 100 WHERE id = $1", "A123")
		if err != nil {
			return err
		}

		time.Sleep(1 * time.Second) // Simulate processing time

		// Simulate failure
		return errors.New("simulated system failure")

		// This line is unreachable (would add to destination account)
		// tx.Exec("UPDATE accounts SET balance = balance + 100 WHERE id = $1", "B456")
		// tx.Commit()
	}

	// Test the failing transfer
	_ = failingTransfer()

	// Check if atomicity was preserved
	var balance int
	err = db.QueryRow("SELECT balance FROM accounts WHERE id = $1", "A123").Scan(&balance)
	if err != nil {
		return fmt.Errorf("failed to query balance: %w", err)
	}

	if balance != 1000 {
		return fmt.Errorf("atomicity violated! Money was lost. Expected 1000, got %d", balance)
	}

	log.Println("✅ Atomicity test passed!")
	return nil
}

func main() {
	if err := testAtomicity(); err != nil {
		log.Fatalf("Test failed: %v", err)
	}
}
```

## Key Takeaways

1. **Atomicity ensures all-or-nothing execution** of database transactions
2. **Use proper transaction management** with BEGIN, COMMIT, and ROLLBACK
3. **Always handle errors** and rollback when something goes wrong
4. **Always use transactions** for multi-statement operations
5. **Test your atomicity** implementation thoroughly

## What's Next?

In the next part of our ACID series, we'll explore **Consistency** - how databases ensure that transactions move from one valid state to another valid state, maintaining all defined rules and constraints.

Stay tuned for Part 2: Consistency, where we'll dive into referential integrity, check constraints, and business rule enforcement!

---

**Series Navigation**: This is Part 1 of our ACID Database Properties series. [Continue to Part 2: Consistency →](#)

*Have questions about atomicity? Found this helpful? Let me know on [Twitter @b0nvic](https://twitter.com/b0nvic)!*
