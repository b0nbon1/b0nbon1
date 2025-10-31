---
title: Understanding the Node.js Event Loop
featured: True
date: "2025-10-29T22:00:00+0300"
description: hello ~ Bonvic Bundi
tags: 
    - Javascript
    - Event loop
    - Asynchronous
    - Nodejs
author: Bonvic Bundi
---

Ever wondered how **Node.js** handles thousands of users at once — serving requests, reading files, querying databases — without breaking a sweat? Let me explain it using a simple analogy.

---

## The Restaurant Kitchen Analogy

Imagine Node.js as a **busy restaurant kitchen** with **one talented chef**.

**The Problem**: One chef. Hundreds of orders. How?

**The Solution**: The chef never waits around doing nothing.

Here's what happens:

1. **Quick tasks** (like plating a salad) → Chef does it immediately
2. **Slow tasks** (like baking a pizza) → Chef hands it to the oven and moves on
3. **When the oven beeps** → Chef comes back, plates the pizza, and serves it

The chef **never stands idle** waiting for the oven. That's the Event Loop in action!

---

## How the Event Loop Works

The **Event Loop** is like the chef's brain, constantly asking:
- "What needs to be done right now?"
- "Did any background task finish?"
- "What should I do next?"

Let me break it down into simple steps:

### Step 1: Handle Quick Tasks First

When you write code like this:

```javascript
console.log('Start');
console.log('Middle');
console.log('End');
```

The chef (Node.js) does them one by one, immediately. Simple!

### Step 2: Delegate Slow Tasks

But what about slow tasks like reading a file?

```javascript
const fs = require('fs');

console.log('Start reading file');

fs.readFile('data.txt', (err, data) => {
  console.log('File loaded!');
});

console.log('Doing other work');
```

**Output:**
```
Start reading file
Doing other work
File loaded!
```

See what happened? The chef didn't wait for the file to load. They delegated it to a helper and continued working.

### Step 3: Come Back When Ready

When the file is ready, the helper taps the chef on the shoulder. The chef then handles it when they're free.

---

## Understanding Timers

Sometimes you want to delay a task:

```javascript
console.log('Making coffee');

setTimeout(() => {
  console.log('Coffee is ready!');
}, 2000); // Wait 2 seconds

console.log('Reading newspaper');
```

**Output:**
```
Making coffee
Reading newspaper
Coffee is ready!
```

The chef sets a timer and continues working. When the timer goes off, they handle it.

## The Secret: Background Helpers

**"Wait, I thought Node.js is single-threaded?"**

Your JavaScript code runs on one thread, but Node.js has **helper threads** working behind the scenes for:
- Reading/writing files
- Database queries
- Network requests
- etc.

**Example:**

```javascript
const fs = require('fs');

// This happens on a background thread
fs.readFile('big-file.txt', (err, data) => {
  console.log('File loaded!');
});

// Your code continues immediately
console.log('File loading in background...');
```

**Output:**
```
File loading in background...
File loaded!
```

The main chef keeps working while helpers handle the slow stuff!



## The Event Loop: Six Phases

The Event Loop continuously cycles through six phases. Think of it as the chef's workflow:

```
    ┌─────────────────────────┐
    │      1. TIMERS          │  ← setTimeout/setInterval callbacks
    │   (setTimeout ready?)   │
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────┐
    │   2. PENDING CALLBACKS  │  ← System operations (TCP errors, etc.)
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────┐
    │   3. IDLE, PREPARE      │  ← Internal Node.js operations
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────┐      ┌─────────────────┐
    │      4. POLL            │◄─────┤  New I/O Events │
    │  (The Workhorse Phase)  │      │  File reads,    │
    └──────────┬──────────────┘      │  DB queries     │
               │                      └─────────────────┘
    ┌──────────▼──────────────┐
    │      5. CHECK           │  ← setImmediate callbacks
    └──────────┬──────────────┘
               │
    ┌──────────▼──────────────┐
    │   6. CLOSE CALLBACKS    │  ← socket.on('close')
    └──────────┬──────────────┘
               │
               └─────► Repeat
               
    After EACH phase: Microtasks run!
       - process.nextTick() queue (highest priority)
       - Promise callbacks
```

### The Poll Phase: Where the Magic Happens

The **Poll phase** is where Node.js spends most of its time. It:
- Waits for new I/O events (database responses, file reads, network requests)
- Executes their callbacks
- Decides when to move to the next phase

**Real-world example**:
```javascript
const fs = require('fs');

// This file read happens in the Poll phase
fs.readFile('./data.json', (err, data) => {
  console.log('File loaded!'); // Callback executes in Poll phase
});
```

---

## Event Queues: Understanding Priority

Not all tasks are equal. Node.js has a **priority system**:

```
┌─────────────────────────────────────┐
│   HIGHEST PRIORITY                  │
│   ↓                                 │
│   1. process.nextTick()             │  ← Runs IMMEDIATELY after current operation
│   2. Promise callbacks              │  ← Microtasks (then/catch/finally)
│   3. setTimeout/setInterval         │  ← Macrotasks in Timer phase
│   4. setImmediate                   │  ← Runs after Poll phase
│   5. I/O callbacks                  │  ← File system, network
│   6. Close callbacks                │  ← Cleanup operations
│   ↓                                 │
│   LOWEST PRIORITY                   │
└─────────────────────────────────────┘
```

**Example showing priority**:
```javascript
setTimeout(() => console.log('1: setTimeout'), 0);
setImmediate(() => console.log('2: setImmediate'));
Promise.resolve().then(() => console.log('3: Promise'));
process.nextTick(() => console.log('4: nextTick'));

// Output:
// 4: nextTick      (Highest priority)
// 3: Promise       (Microtask)
// 1: setTimeout    (Timer phase - order may vary with setImmediate)
// 2: setImmediate  (Check phase - order may vary with setTimeout)
```

---

## Thread Pool vs Worker Threads

**Wait, isn't Node.js single-threaded?**

Yes and no. Your **JavaScript code** runs on one thread, but Node.js uses **multiple threads** behind the scenes:

### The libuv Thread Pool (Automatic)

Node.js has a pool of **4 worker threads** (configurable up to 1024) that handle:
- File system operations (`fs.readFile`, `fs.writeFile`)
- DNS lookups (`dns.lookup()`)
- Cryptography (`crypto.pbkdf2`, `crypto.randomBytes`)
- Compression (`zlib`)
- Etc

**Example**:
```javascript
const fs = require('fs');

// This happens on a background thread
fs.readFile('huge-file.txt', (err, data) => {
  // But THIS callback runs on the main thread
  console.log('File loaded:', data.length);
});

// Main thread continues immediately
console.log('Reading file in background...');
```

**Configure thread pool size**:
```javascript
// Set before any I/O operations
process.env.UV_THREADPOOL_SIZE = 8;
```

### Worker Threads (Manual Control)

For **CPU-intensive tasks** (image processing, data analysis), use Worker Threads:

```javascript
const { Worker } = require('worker_threads');

// Offload heavy computation to separate thread
const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  
  // Heavy computation
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;
  
  parentPort.postMessage(sum);
`, { eval: true });

worker.on('message', (result) => {
  console.log('Computation complete:', result);
});

console.log('Main thread continues...');
```

**Key Differences**:

| Feature | Thread Pool | Worker Threads |
|---------|-------------|----------------|
| **Use Case** | I/O operations | CPU-intensive tasks |
| **Control** | Automatic | Manual |
| **When** | Always running | Create on-demand |
| **Example** | Reading files | Video encoding |

---

## Best Practices

### 1. Never Block the Event Loop

```javascript
// ❌ BAD: Blocks the main thread
const data = fs.readFileSync('big-file.txt'); // Everything stops here

// ✅ GOOD: Non-blocking
fs.readFile('big-file.txt', (err, data) => {
  // Main thread continues while file loads
});
```

### 2. Use nextTick Wisely

```javascript
// ❌ BAD: Infinite loop starves Event Loop
function dangerous() {
  process.nextTick(dangerous);
}

// ✅ GOOD: Use setImmediate for recursion
function safe() {
  setImmediate(safe); // Allows other tasks to run
}
```

### 3. Choose the Right Tool

- **process.nextTick()** → Error handling, immediate callbacks
- **Promise** → Async workflows, API calls
- **setImmediate()** → Defer work after I/O
- **setTimeout()** → Actual delays
- **Worker Threads** → Heavy CPU work

### 4. Real-World Example: API Server

```javascript
const express = require('express');
const fs = require('fs').promises;

app.get('/users', async (req, res) => {
  // Good: Non-blocking database query
  const users = await db.query('SELECT * FROM users');
  
  // Good: Non-blocking file read
  const config = await fs.readFile('config.json', 'utf8');
  
  // Main thread handles other requests while waiting
  res.json({ users, config: JSON.parse(config) });
});

// Server can handle thousands of concurrent requests
app.listen(3000);
```

---

## Key Takeaways

1. **Node.js uses ONE thread** for JavaScript execution, but **multiple threads** for I/O
2. **Event Loop** cycles through 6 phases, orchestrating async operations
3. **Microtasks** (nextTick, Promises) have higher priority than **macrotasks** (setTimeout, I/O)
4. **Thread Pool** automatically handles I/O; **Worker Threads** for manual parallelism
5. **Never block** the Event Loop with synchronous operations in production

### The Mental Model

> Node.js is like a **smart chef** (single-threaded) managing a **team of assistants** (thread pool) in a busy kitchen (Event Loop), ensuring customers (requests) are served efficiently without anyone waiting too long.

---

Thanks for reading, cheers 🥂 Don't forget to leave a comment below!
