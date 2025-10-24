---
title: "ACID Database Properties: Part 2 - Consistency"
date: 2024-01-22T10:00:00+03:00
description: "Exploring database consistency - the 'C' in ACID. Learn how consistency ensures that transactions maintain database integrity and business rules."
tags: ["Database", "ACID", "Consistency", "Constraints", "Integrity"]
series: ["ACID Database Properties"]
series_order: 2
author: "Bonvic Bundi"
---

# Understanding Database Consistency

Welcome back to our ACID database properties series! In [Part 1](../acid-database-properties-part-1-atomicity/), we explored atomicity and the all-or-nothing principle. Today, we'll dive into **Consistency** - the property that ensures your database always moves from one valid state to another.

## What is Consistency?

Consistency in the ACID context means that any transaction will bring the database from one valid state to another valid state. The database must always satisfy all defined rules, constraints, and business logic.

Think of consistency as the database's **integrity guardian** - it ensures that no transaction can leave your data in an invalid or corrupted state.

## Types of Consistency

### 1. Entity Integrity

Every table must have a primary key, and that key cannot be null.

```sql
-- This violates entity integrity
INSERT INTO users (id, name, email) VALUES (NULL, 'John Doe', 'john@example.com');
-- Error: Primary key cannot be NULL
```

### 2. Referential Integrity

Foreign key relationships must be maintained.

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100)
);

-- Orders table with foreign key
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- This violates referential integrity
INSERT INTO orders (id, user_id, amount) VALUES (1, 999, 100.00);
-- Error: user_id 999 doesn't exist in users table
```

### 3. Domain Integrity

Data must satisfy column constraints and data types.

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    category VARCHAR(50) CHECK (category IN ('electronics', 'books', 'clothing'))
);

-- This violates domain integrity
INSERT INTO products (id, name, price, category) 
VALUES (1, 'Laptop', -500.00, 'electronics');
-- Error: CHECK constraint violated (price > 0)
```

### 4. User-Defined Business Rules

Custom constraints that enforce business logic.

```sql
-- Business rule: A customer cannot have more than $10,000 in credit
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    credit_limit DECIMAL(10,2) CHECK (credit_limit <= 10000.00)
);
```

## Real-World Example: E-commerce Inventory

Let's see consistency in action with an inventory management system:

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    stock_quantity INTEGER CHECK (stock_quantity >= 0)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    quantity INTEGER CHECK (quantity > 0),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Initial state: 10 items in stock
INSERT INTO products (id, name, stock_quantity) VALUES (1, 'Laptop', 10);
```

### Maintaining Consistency During Order Processing

```sql
BEGIN TRANSACTION;

-- Check current stock
SELECT stock_quantity FROM products WHERE id = 1;
-- Returns: 10

-- Customer orders 5 items
INSERT INTO orders (id, product_id, quantity) VALUES (101, 1, 5);

-- Update inventory
UPDATE products SET stock_quantity = stock_quantity - 5 WHERE id = 1;

-- Verify consistency: stock should now be 5
SELECT stock_quantity FROM products WHERE id = 1;
-- Returns: 5

COMMIT;
```

### What Happens When Consistency is Violated?

```sql
BEGIN TRANSACTION;

-- Attempt to order more items than available
INSERT INTO orders (id, product_id, quantity) VALUES (102, 1, 15);

-- This would make stock negative, violating our CHECK constraint
UPDATE products SET stock_quantity = stock_quantity - 15 WHERE id = 1;
-- Error: CHECK constraint violated (stock_quantity >= 0)

-- Transaction is rolled back automatically
ROLLBACK;
```

## Implementing Consistency in Code

### Python Example with Proper Validation

```python
import sqlite3
from decimal import Decimal

class InventoryManager:
    def __init__(self, db_connection):
        self.conn = db_connection
        
    def process_order(self, product_id, quantity):
        try:
            cursor = self.conn.cursor()
            
            # Begin transaction
            cursor.execute("BEGIN TRANSACTION")
            
            # Check current stock (consistency check)
            cursor.execute(
                "SELECT stock_quantity FROM products WHERE id = ?", 
                (product_id,)
            )
            
            result = cursor.fetchone()
            if not result:
                raise ValueError(f"Product {product_id} not found")
                
            current_stock = result[0]
            
            # Business rule: Cannot oversell
            if current_stock < quantity:
                raise ValueError(
                    f"Insufficient stock. Available: {current_stock}, "
                    f"Requested: {quantity}"
                )
            
            # Create order
            cursor.execute(
                "INSERT INTO orders (product_id, quantity) VALUES (?, ?)",
                (product_id, quantity)
            )
            
            # Update inventory
            cursor.execute(
                "UPDATE products SET stock_quantity = stock_quantity - ? "
                "WHERE id = ?",
                (quantity, product_id)
            )
            
            # Commit maintains consistency
            self.conn.commit()
            
            print(f"Order processed successfully. "
                  f"Remaining stock: {current_stock - quantity}")
            
        except Exception as e:
            # Rollback preserves consistency
            self.conn.rollback()
            print(f"Order failed: {e}")
            raise
```

### Node.js Example with Business Logic

```javascript
class OrderService {
    constructor(dbClient) {
        this.db = dbClient;
    }
    
    async processOrder(customerId, items) {
        const client = await this.db.connect();
        
        try {
            await client.query('BEGIN');
            
            // Consistency check: Validate customer exists
            const customerResult = await client.query(
                'SELECT credit_limit, current_balance FROM customers WHERE id = $1',
                [customerId]
            );
            
            if (customerResult.rows.length === 0) {
                throw new Error('Customer not found');
            }
            
            const { credit_limit, current_balance } = customerResult.rows[0];
            
            let totalAmount = 0;
            
            // Process each item and maintain consistency
            for (const item of items) {
                // Check stock availability
                const stockResult = await client.query(
                    'SELECT stock_quantity, price FROM products WHERE id = $1',
                    [item.productId]
                );
                
                if (stockResult.rows.length === 0) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                
                const { stock_quantity, price } = stockResult.rows[0];
                
                if (stock_quantity < item.quantity) {
                    throw new Error(
                        `Insufficient stock for product ${item.productId}`
                    );
                }
                
                totalAmount += price * item.quantity;
                
                // Update inventory
                await client.query(
                    'UPDATE products SET stock_quantity = stock_quantity - $1 ' +
                    'WHERE id = $2',
                    [item.quantity, item.productId]
                );
            }
            
            // Business rule: Check credit limit
            if (current_balance + totalAmount > credit_limit) {
                throw new Error('Order exceeds customer credit limit');
            }
            
            // Create order record
            const orderResult = await client.query(
                'INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) ' +
                'RETURNING id',
                [customerId, totalAmount]
            );
            
            // Update customer balance
            await client.query(
                'UPDATE customers SET current_balance = current_balance + $1 ' +
                'WHERE id = $2',
                [totalAmount, customerId]
            );
            
            await client.query('COMMIT');
            
            return {
                orderId: orderResult.rows[0].id,
                totalAmount,
                message: 'Order processed successfully'
            };
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
```

## Advanced Consistency Patterns

### 1. Triggers for Automatic Consistency

```sql
-- Automatically update total when order items change
CREATE TRIGGER update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END;
```

### 2. Check Constraints for Complex Business Rules

```sql
-- Ensure discount doesn't exceed 50%
ALTER TABLE products 
ADD CONSTRAINT reasonable_discount 
CHECK (
    discount_percentage IS NULL OR 
    (discount_percentage >= 0 AND discount_percentage <= 50)
);

-- Ensure end_date is after start_date for promotions
ALTER TABLE promotions
ADD CONSTRAINT valid_date_range
CHECK (end_date > start_date);
```

### 3. Multi-Table Consistency with Views

```sql
-- Create a view that maintains consistency across related tables
CREATE VIEW customer_order_summary AS
SELECT 
    c.id,
    c.name,
    c.credit_limit,
    COALESCE(SUM(o.total_amount), 0) as total_orders,
    c.credit_limit - COALESCE(SUM(o.total_amount), 0) as available_credit
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.credit_limit;
```

## Testing Consistency

```python
def test_consistency_violations():
    """Test that consistency is properly enforced"""
    
    # Test 1: Foreign key violation
    try:
        cursor.execute(
            "INSERT INTO orders (product_id, quantity) VALUES (999, 1)"
        )
        assert False, "Should have failed due to foreign key violation"
    except sqlite3.IntegrityError:
        print("✅ Foreign key constraint properly enforced")
    
    # Test 2: Check constraint violation
    try:
        cursor.execute(
            "INSERT INTO products (name, stock_quantity) VALUES ('Test', -5)"
        )
        assert False, "Should have failed due to negative stock"
    except sqlite3.IntegrityError:
        print("✅ Check constraint properly enforced")
    
    # Test 3: Business rule enforcement
    try:
        # Attempt to oversell
        cursor.execute("BEGIN TRANSACTION")
        cursor.execute(
            "UPDATE products SET stock_quantity = stock_quantity - 1000 "
            "WHERE id = 1"
        )
        # This should trigger the check constraint
        assert False, "Should have failed due to business rule violation"
    except sqlite3.IntegrityError:
        cursor.execute("ROLLBACK")
        print("✅ Business rule properly enforced")
```

## Common Consistency Pitfalls

### 1. Race Conditions

```python
# BAD: Race condition can violate consistency
def unsafe_stock_update(product_id, quantity):
    stock = get_stock(product_id)  # Stock = 5
    # Another transaction reduces stock to 2 here!
    if stock >= quantity:  # Still thinks stock = 5
        reduce_stock(product_id, quantity)  # Reduces by 3, resulting in -1!
```

```python
# GOOD: Use database locks or constraints
def safe_stock_update(product_id, quantity):
    cursor.execute("BEGIN TRANSACTION")
    cursor.execute(
        "UPDATE products SET stock_quantity = stock_quantity - ? "
        "WHERE id = ? AND stock_quantity >= ?",
        (quantity, product_id, quantity)
    )
    
    if cursor.rowcount == 0:
        cursor.execute("ROLLBACK")
        raise ValueError("Insufficient stock")
    
    cursor.execute("COMMIT")
```

### 2. Ignoring Constraint Violations

```python
# BAD: Silently ignoring constraint violations
try:
    insert_invalid_data()
except IntegrityError:
    pass  # This hides data quality issues!

# GOOD: Handle violations appropriately
try:
    insert_data()
except IntegrityError as e:
    log_error(f"Data integrity violation: {e}")
    raise ValueError("Invalid data provided")
```

## Key Takeaways

1. **Consistency ensures valid state transitions** in your database
2. **Use constraints liberally** - primary keys, foreign keys, check constraints
3. **Implement business rules** at the database level when possible
4. **Test constraint violations** to ensure they're properly enforced
5. **Handle race conditions** with appropriate locking or constraint strategies
6. **Never ignore integrity errors** - they indicate real problems

## What's Next?

In Part 3 of our ACID series, we'll explore **Isolation** - how databases handle concurrent transactions without them interfering with each other. We'll dive into isolation levels, locking mechanisms, and how to prevent issues like phantom reads and dirty reads.

Stay tuned for Part 3: Isolation, where we'll learn about the complexity of concurrent database access!

---

*Enjoying this series? Have questions about consistency? Connect with me on [Twitter @b0nvic](https://twitter.com/b0nvic)!*
