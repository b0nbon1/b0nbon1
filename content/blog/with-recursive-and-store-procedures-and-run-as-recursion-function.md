---
title: "SQL Recursion Explained: Why I Chose a Recursive Function Over WITH RECURSIVE (and When You Should Too)"
date: 2025-11-07T10:00:00+03:00
description: "Learn the difference between WITH RECURSIVE and recursive SQL functions through a real PostgreSQL example. See why I chose a recursive function to build nested JSON trees—and when you should too. ~ Bonvic"
tags: 
     - Observability
     - Metrics
     - Logs
     - Traces
     - Golang
author: Bonvic Bundi
---

If you’ve ever had to fetch data that’s deeply nested like folders inside folders — you’ve probably faced the *recursive query* problem. In my case, I was building a folder system where each folder could have subfolders and files nested multiple levels deep. I needed a way to fetch the entire hierarchy, cleanly structured as JSON, ready for my Node.js backend to send to the frontend.

## 💭 The Challenge: Fetching Deeply Nested Folders (getting children of children)

Let’s say you have this table:
```sql
CREATE TABLE folder (
  id UUID PRIMARY KEY,
  name TEXT,
  parent_id UUID REFERENCES folder(id),
  owner_id UUID
);
```

And your data looks like this:
| id | name      | parent_id |
| -- | --------- | --------- |
| 1  | Root      | NULL      |
| 2  | Documents | 1         |
| 3  | Pictures  | 1         |
| 4  | Invoices  | 2         |
| 5  | Receipts  | 4         |

If you query for `parent_id = 1`, you’ll only get “Documents” and “Pictures.” But I needed everything — all the nested folders and their children — in one go.

## 🧩 Attempt #1: Using WITH RECURSIVE (CTE)

My first instinct was to use PostgreSQL’s CTE `WITH RECURSIVE`. It’s a powerful feature for walking through hierarchical data. Here’s a simple version:

```sql
WITH RECURSIVE folder_tree AS (
  SELECT id, name, parent_id
  FROM folder
  WHERE parent_id IS NULL

  UNION ALL

  SELECT f.id, f.name, f.parent_id
  FROM folder f
  INNER JOIN folder_tree ft ON ft.id = f.parent_id
)
SELECT * FROM folder_tree;
```

This flattens all folders into a single table — great for lists or reporting. But in my case, I didn’t need a flat list — I needed structured JSON, something like this:

```json
{
  "id": "1",
  "name": "Root",
  "children": [
    {
      "id": "2",
      "name": "Documents",
      "children": [
        {
          "id": "4",
          "name": "Invoices",
          "children": [
            { "id": "5", "name": "Receipts", "children": [] }
          ]
        }
      ]
    },
    {
      "id": "3",
      "name": "Pictures",
      "children": []
    }
  ]
}
```

That’s where `WITH RECURSIVE` started to break down for me. It could fetch all rows, but it required extra work in my Node.js backend to rebuild the hierarchy into JSON. I ended up doing multiple loops in JavaScript to attach children to parents — extra processing that felt unnecessary when the database could do it more efficiently.

## 🚀 Switching Gears: The Recursive Stored Function

That’s when I turned to PostgreSQL’s stored functions. By writing a recursive SQL function, I could let the database handle both recursion and JSON construction internally. Here’s a simplified version:

```sql
CREATE OR REPLACE FUNCTION build_tree(folder_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', f.id,
    'name', f.name,
    'children', COALESCE(
      (SELECT jsonb_agg(build_tree(id))
       FROM folder
       WHERE parent_id = f.id),
      '[]'::jsonb
    )
  )
  INTO result
  FROM folder f
  WHERE f.id = folder_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```
Now, all I had to do in my backend was:

```sql
SELECT build_tree('root-folder-uuid');
```

## ⚡ Performance & Optimization

Once I switched to the stored procedure approach, I made a few key optimizations:
- **Indexes**: I added indexes on parent_id and owner_id to speed up recursive lookups.
- **Depth-based Pagination**: Using a depth_limit parameter, I could easily control how deep to fetch — making pagination simple and predictable.
- **Reduced Backend Work**: In my Node.js app, I now just pass parameters to the function and get ready-to-use structured JSON.

This approach fully utilized the PostgreSQL engine’s power, reduced data transfer, and simplified backend logic dramatically.

## 🧠 What’s Really Happening

Each call to `build_tree()` returns one folder, along with:

- All its direct files (using `json_agg`),
- All its subfolders (recursively calling itself).

When recursion finishes, you get a complete tree — clean and structured. So instead of assembling the hierarchy manually in code, PostgreSQL builds it for you.

### 🔍 Visual Overview

- **Left**: `WITH RECURSIVE` — unfolds data level by level (flat).
- **Right**: Recursive function — builds a complete nested JSON tree.

Both approaches, `WITH RECURSIVE` and recursive functions — are correct. The real question is what trade-offs you’re willing to make.

| Feature      | `WITH RECURSIVE`      | Recursive Stored Function    |
| ------------ | --------------------- | ---------------------------- |
| Output       | Flat table            | Structured JSON              |
| Ease of use  | Simpler for lists     | Better for hierarchies       |
| Performance  | Great for aggregation | Great for JSON tree building |
| Backend work | Needs extra logic     | Minimal post-processing      |
| Control      | SQL-driven            | Function-driven & flexible   |


In my case, the function was more efficient overall. It reduced backend complexity, improved speed with indexing, and made pagination simple with a depth parameter. But if I only needed a flat report (like total folder counts or breadcrumb paths), I’d still go with `WITH RECURSIVE`. So, it’s not about which one is better — **it’s about which one fits your goal**. Sometimes clarity and maintainability matter more than squeezing every bit of performance.

## Wrapping it all up

- `WITH RECURSIVE` is great for listing or aggregating hierarchical data.
- Recursive stored functions shine when you need nested, structured JSON.
- Use indexes and depth limits for efficiency.
- Choose the tool that balances performance, simplicity, and maintainability for your project.
- Both methods are right — it’s about what’s efficient for your case without adding unnecessary complexity.

For me, switching to a recursive SQL function wasn’t about fancy optimization — it was about choosing what’s efficient without complicating the system. Both methods are valid and powerful; the real skill is in understanding their trade-offs and picking what makes sense for your system.

## BONUS: 🧱 Full Implementation Example (Production Version)

Here’s my actual working function — optimized for JSON aggregation, ownership, and depth control.
```sql
-- =====================================================
-- Function: build_tree
-- Description: Recursively builds a folder tree with files
-- =====================================================
CREATE OR REPLACE FUNCTION build_tree(
  folder_uuid UUID,
  owner_uuid UUID,
  current_depth INT DEFAULT 1,
  depth_limit INT DEFAULT 5
)
RETURNS JSONB AS $$
  SELECT jsonb_build_object(
    'id',            f.id,
    'name',          f.name,
    'parent_id',     f.parent_id,
    'owner_id',      f.owner_id,
    'old_parent_id', f.old_parent_id,
    'trashed_at',    f.trashed_at,
    'created_at',    f.created_at,
    'updated_at',    f.updated_at,
    'files',         COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id',         fl.id,
            'name',       fl.name,
            'url',        fl.url,
            'size',       fl.size,
            'type',       fl.type,
            'system',     fl.system,
            'owner_id',   fl.owner_id,
            'trashed_at', fl.trashed_at,
            'created_at', fl.created_at,
            'updated_at', fl.updated_at
          )
        )
        FROM file fl
        WHERE fl.folder_id = f.id
          AND fl.owner_id = owner_uuid::text
      ),
      '[]'::jsonb
    ),
    'children',      CASE
      WHEN current_depth < depth_limit THEN
        COALESCE(
          (
            SELECT jsonb_agg(
              build_tree(c.id, owner_uuid, current_depth + 1, depth_limit)
            )
            FROM folder c
            WHERE NULLIF(c.parent_id, '')::uuid = f.id
              AND c.owner_id = owner_uuid::text
          ),
          '[]'::jsonb
        )
      ELSE '[]'::jsonb
    END
  )
  FROM folder f
  WHERE f.id = folder_uuid
    AND f.owner_id = owner_uuid::text;
$$ LANGUAGE sql STABLE;

-- =====================================================
-- Function: get_folder_hierarchy
-- Description: Gets the folder hierarchy for a specific folder or all root folders
-- =====================================================
CREATE OR REPLACE FUNCTION get_folder_hierarchy(
  folder_uuid UUID,
  owner_uuid UUID,
  depth_limit INT DEFAULT 5
)
RETURNS JSONB AS $$
  SELECT jsonb_agg(
    build_tree(f.id, owner_uuid, 1, depth_limit)
  )
  FROM folder f
  WHERE (
      f.id = folder_uuid 
      OR (folder_uuid IS NULL AND f.parent_id IS NULL)
    )
    AND f.owner_id = owner_uuid::text;
$$ LANGUAGE sql STABLE;
```

This function now powers my folder explorer. In my Node.js backend, I just call it with parameters — no restructuring, no recursion logic, no JSON manipulation. Everything comes ready from the database.

> Use SQL recursion wisely — not just for clever queries, but to make your system simpler, faster, and cleaner.

If you have any questions drop them in the comment section below and also if you have better suggestion or correction.

Thanks for reading, cheers 🥂
