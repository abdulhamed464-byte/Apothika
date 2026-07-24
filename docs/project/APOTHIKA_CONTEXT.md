# APOTHIKA PROJECT CONTEXT

## Current Architecture

APOTHIKA is a modular ERP platform.

Stack:
- React
- TypeScript
- Vite
- Supabase
- PostgreSQL

Architecture rule:

React Component
↓
Service Layer
↓
Supabase
↓
Database


## Completed Modules

### Authentication
✅ Login
✅ Register
✅ Workspace detection
✅ Session handling


### Dashboard
✅ KPI cards
✅ Inventory summary


### Purchase
✅ Purchase creation
✅ Supplier selection
✅ Product selection
✅ Purchase history
✅ Stock entry creation


### Inventory V3 Product Master
✅ Product CRUD
✅ Product table
✅ Search
✅ Filters
✅ SKU
✅ Barcode
✅ Archive workflow


### Inventory V4 Stock Management

Completed:
✅ Stock entries table
✅ Stock In workflow
✅ Stock Out table
✅ Stock Out workflow
✅ RLS policies
✅ Product stock relationships


Current issue:

Inventory display calculation needs final verification.

Expected:

Stock In - Stock Out = Available Stock


Example:

Stock In:
275

Stock Out:
10

Expected:
265


## Current Database Relationships

products
↓
stock_entries

products
↓
stock_out_entries


## Current Next Task

Finish Inventory V4:

1. Fix inventory displayed stock calculation
2. Verify available stock
3. Add stock adjustment
4. Add stock movement history
5. Continue batch and expiry tracking


## Development Rules

- Use service layer
- Do not rewrite working architecture
- Maintain database relationships
- Provide complete replaceable files
- Build after major changes