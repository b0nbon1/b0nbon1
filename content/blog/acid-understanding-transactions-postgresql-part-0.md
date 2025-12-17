---
title: "ACID Database Properties with PostgreSQL: Part 0 - Transactions"
date: 2025-11-03T10:00:00+03:00
description: "Understanding Transactions with PostgreSQL before we explore ACID properties"
tags: ["Database", "ACID", "Atomicity", "Transactions", "PostgreSQL"]
series: ["ACID Database Properties"]
series_order: 1
author: "Bonvic Bundi"
---

> Welcome to my comprehensive series on ACID database properties! In this first part, we'll dive deep into **Transactions** before we get into the properties.

Every day, we deal with transactions, even outside of databases. When you send money, order food online, or post something on social media, a transaction takes place. It’s a simple idea: either everything works, or nothing changes(all-or-nothing). You wouldn’t want your account to be charged if your payment fails halfway, right? That’s exactly why databases use transactions — to make sure operations happen completely and reliably.

## What Exactly Is a Database Transaction?
In the database world, a transaction is a group of actions treated as a single, complete task. All the steps inside must succeed for the whole thing to count, otherwise, PostgreSQL rolls everything back as if it never happened. Let’s say we’re moving money between two accounts:
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```
If both updates succeed, PostgreSQL commits (saves) the transaction. If one fails, PostgreSQL rolls back to the start. No partial updates, no corruption, just safety. This “all-or-nothing” behavior is part of what’s known as the ACID properties of transactions:
- Atomicity – everything succeeds or nothing does.
- Consistency – data stays valid and follows rules.
- Isolation – transactions don’t mess with each other.
- Durability – once committed, it’s saved permanently.

So far, that’s the big picture: transactions keep our data accurate and reliable.
We'll discuss much in depth about ACID properties in the rest of the series.

## How PostgreSQL Handles Transactions Internally

Now, let’s peek under the hood to see what happens when PostgreSQL runs a transaction. When you begin a transaction, PostgreSQL assigns it a Transaction ID (XID) — think of it like a unique ticket number. This ID helps the database know which transaction is active and what data it can see.
As you make changes:
1. PostgreSQL first writes your operations to the WAL (Write-Ahead Log) — a safety log that helps the system recover if it crashes.
2. It temporarily keeps your changes in memory.
3. When you `COMMIT`, PostgreSQL records that everything is safe in the WAL, then makes your changes visible to others.

This is how PostgreSQL guarantees consistency — even if the server shuts down mid-operation, it can replay the WAL and restore everything exactly as it was.

## MVCC: The Secret to PostgreSQL’s Speed and Safety

Now here’s where PostgreSQL gets clever. Imagine dozens of people using the same database at the same time — reading, updating, deleting.
How does PostgreSQL handle that without people stepping on each other’s toes? It uses a concept called **MVCC (Multi-Version Concurrency Control)**. Instead of locking rows so only one person can use them, PostgreSQL takes a different approach — it keeps multiple versions of each row. When you update a record:
- PostgreSQL doesn’t overwrite the old data.
- It creates a new version of that row with a new Transaction ID.
- The old version remains available to anyone whose transaction started before your change.

This means:
- Readers always see a stable snapshot of the data as it was when they started their transaction.
- Writers can keep making changes without blocking readers.

It’s like Google Docs, you can read an older version while someone else edits the current one. Everyone works smoothly, and PostgreSQL keeps track of which version each user should see based on their Transaction ID.

## Transaction IDs and Why They Need Maintenance

Remember that Transaction ID (XID) we mentioned earlier? It’s a 32-bit number, meaning PostgreSQL can count up to around 4 billion transactions before starting over.That’s fine in most cases, but here’s the problem: `When the counter resets, PostgreSQL could confuse old data for new data if it’s not managed properly`.

To prevent this, PostgreSQL runs a background process called `VACUUM`. `VACUUM` cleans up old, unused row versions that are no longer needed by any transaction.
It also “freezes” very old rows, marking them as permanent so they’re unaffected when transaction IDs wrap around. 
You can think of it like spring cleaning:
- `MVCC` creates extra copies of rows over time.
- `VACUUM` comes in to remove outdated ones.

Freezing ensures ancient data stays safe forever. This balance between MVCC (creating versions) and VACUUM (cleaning them up) keeps PostgreSQL efficient and stable.

## Wrapping It All Together
So, here’s the full picture:
1. **Transactions** group multiple changes into one reliable action.
2. **PostgreSQL** gives each transaction a unique ID and records its work in the WAL for durability.
3. **MVCC** allows many users to read and write at once without blocking by keeping multiple row versions.
4. **VACUUM** cleans up old data and freezes permanent rows to avoid transaction ID wraparound issues.

All of this happens automatically, behind the scenes, to ensure that every time you query PostgreSQL — you get accurate, consistent, and safe data, no matter how busy the system is.

If you have any questions drop them in the comment section below

Thanks for reading, cheers 🥂
