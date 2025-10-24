---
title: "ACID Database Properties: Part 4 - Durability"
date: 2024-02-05T10:00:00+03:00
description: "The final chapter on ACID properties - understanding database durability. Learn how databases ensure committed transactions survive crashes and system failures."
tags: ["Database", "ACID", "Durability", "Persistence", "Recovery"]
series: ["ACID Database Properties"]
series_order: 4
author: "Bonvic Bundi"
---

# Understanding Database Durability

Welcome to the final part of our ACID database properties series! We've covered [Atomicity](../acid-database-properties-part-1-atomicity/), [Consistency](../acid-database-properties-part-2-consistency/), and [Isolation](../acid-database-properties-part-3-isolation/). Now we'll explore **Durability** - the property that ensures your committed data survives any system failure.

## What is Durability?

Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure. This means that completed transactions are permanently recorded in the database and will survive:

- **Power outages**
- **System crashes**
- **Hardware failures**
- **Operating system failures**

Think of durability as your database's **insurance policy** - it ensures that your data is truly saved when you say it's saved.

## The Challenge: Volatile vs Persistent Storage

The fundamental challenge durability addresses is the difference between volatile and persistent storage:

### Volatile Storage (RAM)
- ⚡ **Fast**: Nanosecond access times
- 💨 **Temporary**: Data lost when power is cut
- 💰 **Expensive**: Higher cost per gigabyte

### Persistent Storage (Disk/SSD)
- 🐌 **Slower**: Millisecond access times
- 🏛️ **Permanent**: Data survives power loss
- 💵 **Cheaper**: Lower cost per gigabyte

Databases must balance performance (using RAM) with durability (writing to disk).

## How Databases Implement Durability

### 1. Write-Ahead Logging (WAL)

The most common durability mechanism is Write-Ahead Logging:

```
1. Before modifying data, write changes to a log file
2. Ensure log is written to disk (fsync)
3. Only then modify the actual data pages
4. Periodically checkpoint: flush data pages to disk
```

```sql
-- Transaction begins
BEGIN TRANSACTION;

-- WAL Entry 1: [LSN:1001] BEGIN TRANSACTION 1001
UPDATE accounts SET balance = 900 WHERE id = 'A123';
-- WAL Entry 2: [LSN:1002] UPDATE accounts SET balance = 900 WHERE id = 'A123'

UPDATE accounts SET balance = 600 WHERE id = 'B456';
-- WAL Entry 3: [LSN:1003] UPDATE accounts SET balance = 600 WHERE id = 'B456'

-- WAL Entry 4: [LSN:1004] COMMIT TRANSACTION 1001
COMMIT;

-- Only after WAL is safely on disk, data pages are updated
```

### 2. Force Log at Commit

When a transaction commits, the database must ensure all log records are written to persistent storage before returning success:

```python
def commit_transaction(transaction_id):
    """Ensure durability through forced log writes"""
    
    # 1. Write commit record to log buffer
    write_log_record(f"COMMIT {transaction_id}")
    
    # 2. Force log buffer to disk - CRITICAL for durability!
    force_log_to_disk()  # This is expensive but necessary
    
    # 3. Only now can we tell the application "success"
    return "TRANSACTION_COMMITTED"
    
    # 4. Data pages can be written to disk later (lazy writing)
```

### 3. Checkpointing

Periodically, databases write all dirty pages from memory to disk:

```python
class DatabaseCheckpoint:
    def __init__(self, database):
        self.db = database
        self.last_checkpoint_lsn = 0
    
    def perform_checkpoint(self):
        """Write all dirty pages to disk and update checkpoint record"""
        
        # 1. Flush all dirty data pages to disk
        dirty_pages = self.db.buffer_pool.get_dirty_pages()
        
        for page in dirty_pages:
            # Write page to disk
            self.db.storage.write_page(page.page_id, page.data)
            
        # 2. Write checkpoint record to log
        checkpoint_record = {
            'type': 'CHECKPOINT',
            'lsn': self.db.log.get_current_lsn(),
            'active_transactions': self.db.get_active_transactions(),
            'dirty_pages': [page.page_id for page in dirty_pages]
        }
        
        self.db.log.write_record(checkpoint_record)
        self.db.log.force_to_disk()
        
        # 3. Update checkpoint LSN
        self.last_checkpoint_lsn = checkpoint_record['lsn']
        
        print(f"Checkpoint completed at LSN {self.last_checkpoint_lsn}")
```

## Real-World Example: Building a Durable Key-Value Store

Let's build a simple but durable key-value store to understand durability implementation:

```python
import os
import json
import fcntl
import hashlib
from threading import Lock
from typing import Dict, Optional

class DurableKVStore:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.log_file = os.path.join(data_dir, 'transactions.log')
        self.data_file = os.path.join(data_dir, 'data.json')
        self.lock = Lock()
        
        # Create directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        # In-memory cache for performance
        self.cache: Dict[str, str] = {}
        
        # Recovery: Load from log and data files
        self.recover()
    
    def recover(self):
        """Recover state from log files after a crash"""
        print("Starting recovery process...")
        
        # Load latest checkpoint (data file)
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as f:
                self.cache = json.load(f)
            print(f"Loaded {len(self.cache)} entries from checkpoint")
        
        # Replay transactions from log
        if os.path.exists(self.log_file):
            with open(self.log_file, 'r') as f:
                for line in f:
                    try:
                        entry = json.loads(line.strip())
                        self._replay_log_entry(entry)
                    except json.JSONDecodeError:
                        print(f"Skipping corrupted log entry: {line}")
        
        print("Recovery completed")
    
    def _replay_log_entry(self, entry: dict):
        """Replay a single log entry during recovery"""
        if entry['type'] == 'PUT':
            self.cache[entry['key']] = entry['value']
        elif entry['type'] == 'DELETE':
            self.cache.pop(entry['key'], None)
        # COMMIT entries don't need action during replay
    
    def _write_log_entry(self, entry: dict):
        """Write entry to log with durability guarantees"""
        log_line = json.dumps(entry) + '\n'
        
        with open(self.log_file, 'a') as f:
            f.write(log_line)
            # CRITICAL: Force to disk for durability
            f.flush()
            os.fsync(f.fileno())
    
    def put(self, key: str, value: str) -> bool:
        """Put a key-value pair with durability guarantee"""
        with self.lock:
            try:
                # 1. Write to log BEFORE modifying cache
                log_entry = {
                    'type': 'PUT',
                    'key': key,
                    'value': value,
                    'timestamp': time.time()
                }
                self._write_log_entry(log_entry)
                
                # 2. Write commit record to log
                commit_entry = {
                    'type': 'COMMIT',
                    'timestamp': time.time()
                }
                self._write_log_entry(commit_entry)
                
                # 3. Only now update in-memory cache
                self.cache[key] = value
                
                return True
                
            except Exception as e:
                print(f"PUT operation failed: {e}")
                return False
    
    def get(self, key: str) -> Optional[str]:
        """Get value for key (read from cache)"""
        with self.lock:
            return self.cache.get(key)
    
    def delete(self, key: str) -> bool:
        """Delete a key with durability guarantee"""
        with self.lock:
            if key not in self.cache:
                return False
            
            try:
                # 1. Write to log
                log_entry = {
                    'type': 'DELETE',
                    'key': key,
                    'timestamp': time.time()
                }
                self._write_log_entry(log_entry)
                
                # 2. Write commit record
                commit_entry = {
                    'type': 'COMMIT',
                    'timestamp': time.time()
                }
                self._write_log_entry(commit_entry)
                
                # 3. Remove from cache
                del self.cache[key]
                
                return True
                
            except Exception as e:
                print(f"DELETE operation failed: {e}")
                return False
    
    def checkpoint(self):
        """Create a checkpoint by writing all data to disk"""
        with self.lock:
            try:
                # Write current state to data file
                temp_file = self.data_file + '.tmp'
                with open(temp_file, 'w') as f:
                    json.dump(self.cache, f)
                    f.flush()
                    os.fsync(f.fileno())
                
                # Atomic rename (on most filesystems)
                os.rename(temp_file, self.data_file)
                
                # Truncate log file since we have a checkpoint
                open(self.log_file, 'w').close()
                
                print(f"Checkpoint created with {len(self.cache)} entries")
                
            except Exception as e:
                print(f"Checkpoint failed: {e}")

# Usage example
import time

def test_durability():
    """Test that data survives simulated crashes"""
    
    # Create store
    store = DurableKVStore('/tmp/kvstore_test')
    
    # Add some data
    store.put('user:1', 'Alice')
    store.put('user:2', 'Bob')
    store.put('balance:alice', '1000')
    
    print("Data written:")
    print(f"user:1 = {store.get('user:1')}")
    print(f"user:2 = {store.get('user:2')}")
    print(f"balance:alice = {store.get('balance:alice')}")
    
    # Simulate crash by creating new instance
    print("\n--- Simulating system crash ---")
    
    store2 = DurableKVStore('/tmp/kvstore_test')
    
    print("Data after recovery:")
    print(f"user:1 = {store2.get('user:1')}")
    print(f"user:2 = {store2.get('user:2')}")
    print(f"balance:alice = {store2.get('balance:alice')}")
    
    # All data should be preserved!
    assert store2.get('user:1') == 'Alice'
    assert store2.get('user:2') == 'Bob'
    assert store2.get('balance:alice') == '1000'
    
    print("✅ Durability test passed!")

test_durability()
```

## Advanced Durability Techniques

### 1. Group Commit

Instead of forcing the log to disk for each transaction, batch multiple commits:

```python
class GroupCommitManager:
    def __init__(self, max_batch_size=10, max_wait_time=0.01):
        self.pending_commits = []
        self.max_batch_size = max_batch_size
        self.max_wait_time = max_wait_time
        self.commit_thread = None
    
    def commit_transaction(self, transaction_id):
        """Add transaction to group commit batch"""
        future = Future()
        
        with self.lock:
            self.pending_commits.append((transaction_id, future))
            
            # Trigger batch commit if batch is full
            if len(self.pending_commits) >= self.max_batch_size:
                self._flush_batch()
        
        return future  # Application waits on this
    
    def _flush_batch(self):
        """Write all pending commits to disk in one operation"""
        if not self.pending_commits:
            return
        
        batch = self.pending_commits
        self.pending_commits = []
        
        try:
            # Write all commit records to log
            for tx_id, future in batch:
                write_log_record(f"COMMIT {tx_id}")
            
            # Single disk sync for entire batch
            force_log_to_disk()
            
            # Notify all waiting transactions
            for tx_id, future in batch:
                future.set_result("COMMITTED")
                
        except Exception as e:
            # Notify all of failure
            for tx_id, future in batch:
                future.set_exception(e)
```

### 2. Asynchronous Durability

For less critical data, allow asynchronous commits:

```python
class AsyncDurabilityManager:
    def __init__(self):
        self.sync_queue = queue.Queue()
        self.sync_thread = threading.Thread(target=self._sync_worker)
        self.sync_thread.daemon = True
        self.sync_thread.start()
    
    def async_commit(self, transaction_id):
        """Commit transaction asynchronously"""
        # Write to log buffer (in memory)
        write_log_record_to_buffer(f"COMMIT {transaction_id}")
        
        # Add to sync queue for background processing
        self.sync_queue.put(transaction_id)
        
        # Return immediately - don't wait for disk
        return "COMMITTED_ASYNC"
    
    def _sync_worker(self):
        """Background thread that periodically syncs to disk"""
        while True:
            try:
                # Wait for items or timeout
                transactions = []
                
                # Collect batch of transactions
                timeout = time.time() + 0.1  # 100ms max wait
                while time.time() < timeout and len(transactions) < 100:
                    try:
                        tx_id = self.sync_queue.get(timeout=0.01)
                        transactions.append(tx_id)
                    except queue.Empty:
                        break
                
                if transactions:
                    # Sync entire batch to disk
                    force_log_to_disk()
                    print(f"Synced {len(transactions)} transactions")
                    
            except Exception as e:
                print(f"Sync worker error: {e}")
```

### 3. Multi-Level Storage

Use different storage tiers for different durability requirements:

```python
class TieredStorage:
    def __init__(self):
        self.memory_cache = {}      # Fastest, volatile
        self.ssd_cache = {}         # Fast, durable
        self.hdd_storage = {}       # Slow, very durable
        self.cloud_backup = {}      # Slowest, disaster recovery
    
    def write_with_durability_level(self, key, value, level):
        """Write data with specified durability level"""
        
        if level >= 1:  # Memory
            self.memory_cache[key] = value
        
        if level >= 2:  # Local SSD
            self._write_to_ssd(key, value)
        
        if level >= 3:  # Local HDD
            self._write_to_hdd(key, value)
        
        if level >= 4:  # Cloud backup
            self._async_backup_to_cloud(key, value)
    
    def _write_to_ssd(self, key, value):
        """Write to SSD with fsync"""
        with open(f'/ssd/storage/{key}', 'w') as f:
            f.write(value)
            f.flush()
            os.fsync(f.fileno())
    
    def _write_to_hdd(self, key, value):
        """Write to HDD with redundancy"""
        for replica in range(3):  # Triple redundancy
            with open(f'/hdd/replica{replica}/{key}', 'w') as f:
                f.write(value)
                f.flush()
                os.fsync(f.fileno())
```

## Testing Durability

### 1. Crash Testing

```bash
#!/bin/bash
# Script to test durability under crashes

# Start database
./start_database.sh &
DB_PID=$!

# Insert test data
for i in {1..1000}; do
    echo "INSERT INTO test VALUES ($i, 'data$i');" | mysql testdb
done

# Simulate crash at random time
sleep $((RANDOM % 10))
kill -9 $DB_PID  # Hard kill - simulates power loss

# Restart database
./start_database.sh &
NEW_DB_PID=$!

# Verify data integrity
RECOVERED_COUNT=$(echo "SELECT COUNT(*) FROM test;" | mysql testdb)
echo "Recovered $RECOVERED_COUNT records"

# Check for corruption
echo "CHECKING FOR CORRUPTION..."
mysqlcheck testdb
```

### 2. Power Loss Simulation

```python
import os
import signal
import subprocess
import time

def simulate_power_loss_test():
    """Simulate power loss during database operations"""
    
    # Start database process
    db_process = subprocess.Popen(['./database_server'])
    
    # Start load generator
    load_process = subprocess.Popen(['./generate_load.py'])
    
    try:
        # Let it run for random time
        time.sleep(random.uniform(5, 30))
        
        # Simulate power loss - kill all processes
        os.kill(db_process.pid, signal.SIGKILL)
        os.kill(load_process.pid, signal.SIGKILL)
        
        print("Simulated power loss")
        
        # Wait a bit (simulating boot time)
        time.sleep(2)
        
        # Restart database
        new_db_process = subprocess.Popen(['./database_server'])
        
        # Verify data integrity
        verify_integrity()
        
    finally:
        # Cleanup
        if db_process.poll() is None:
            db_process.kill()
        if load_process.poll() is None:
            load_process.kill()
```

### 3. Durability Benchmarking

```python
def benchmark_durability_overhead():
    """Measure the performance cost of durability"""
    
    def insert_with_sync():
        """Insert with full durability (fsync every write)"""
        start = time.time()
        
        for i in range(1000):
            with open('data_sync.txt', 'a') as f:
                f.write(f"record_{i}\n")
                f.flush()
                os.fsync(f.fileno())  # Force to disk
        
        return time.time() - start
    
    def insert_without_sync():
        """Insert without durability (OS manages writes)"""
        start = time.time()
        
        for i in range(1000):
            with open('data_nosync.txt', 'a') as f:
                f.write(f"record_{i}\n")
                # No fsync - data may be lost on crash
        
        return time.time() - start
    
    sync_time = insert_with_sync()
    nosync_time = insert_without_sync()
    
    print(f"With fsync: {sync_time:.2f}s")
    print(f"Without fsync: {nosync_time:.2f}s")
    print(f"Durability overhead: {(sync_time / nosync_time - 1) * 100:.1f}%")

benchmark_durability_overhead()
```

## Common Durability Pitfalls

### 1. Forgetting to Sync

```python
# BAD: Data may be lost on crash
def unsafe_write(data):
    with open('important_data.txt', 'w') as f:
        f.write(data)
    # File might still be in OS buffer!

# GOOD: Ensure data reaches disk
def safe_write(data):
    with open('important_data.txt', 'w') as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())  # Force to disk
```

### 2. Assuming Rename is Atomic

```python
# DANGEROUS: Not atomic on all filesystems
def unsafe_atomic_write(filename, data):
    with open(filename, 'w') as f:
        f.write(data)
    # If crash happens here, file might be corrupted!

# SAFE: Write to temp file then rename
def safe_atomic_write(filename, data):
    temp_name = filename + '.tmp'
    with open(temp_name, 'w') as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    
    # Atomic rename (on most POSIX systems)
    os.rename(temp_name, filename)
```

### 3. Trusting Application-Level Caching

```python
# BAD: Cache hides durability issues
class UnsafeCache:
    def __init__(self):
        self.cache = {}
    
    def set(self, key, value):
        self.cache[key] = value
        # User thinks data is saved, but it's only in memory!
    
    def get(self, key):
        return self.cache.get(key)

# GOOD: Cache with explicit durability
class SafeCache:
    def __init__(self):
        self.cache = {}
        self.storage = DurableStorage()
    
    def set(self, key, value):
        # Write to durable storage first
        self.storage.put(key, value)
        # Then cache for performance
        self.cache[key] = value
    
    def get(self, key):
        # Check cache first
        if key in self.cache:
            return self.cache[key]
        # Fall back to storage
        return self.storage.get(key)
```

## Key Takeaways

1. **Durability ensures committed data survives system failures**
2. **Write-Ahead Logging (WAL) is the primary durability mechanism**
3. **Force log to disk before confirming transaction commit**
4. **Checkpointing provides recovery optimization**
5. **Test durability with crash simulations**
6. **Balance durability with performance using group commits**
7. **Never trust data is durable until it's on persistent storage**

## Series Conclusion

We've completed our journey through the ACID properties:

- **[Atomicity](../acid-database-properties-part-1-atomicity/)**: All-or-nothing transactions
- **[Consistency](../acid-database-properties-part-2-consistency/)**: Valid state transitions  
- **[Isolation](../acid-database-properties-part-3-isolation/)**: Concurrent transaction safety
- **Durability**: Committed data persistence

Understanding ACID properties is crucial for building reliable database applications. These properties work together to ensure your data remains consistent, reliable, and safe even in the face of failures.

Whether you're choosing a database, designing an application, or debugging data issues, the ACID properties provide a framework for thinking about data reliability and consistency.

---

*That concludes our ACID database properties series! Found it helpful? Have questions? Let's connect on [Twitter @b0nvic](https://twitter.com/b0nvic)!*

*Want to dive deeper? Consider exploring specific database implementations like PostgreSQL's WAL, MySQL's InnoDB engine, or distributed databases and how they handle ACID properties across multiple nodes.*
