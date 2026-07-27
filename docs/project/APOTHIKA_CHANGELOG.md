# APOTHIKA CHANGELOG

====================================================
July 2026
====================================================

## Inventory V3 Product Master Completion

Completed Inventory Product Master System.

Added:

- Product CRUD
- Product listing
- Product editing
- Product details view
- Product archive workflow
- Inventory table actions
- Search
- Filters
- SKU generator
- Barcode generator
- Barcode validation
- Barcode scanner
- Product image upload
- Inventory KPI cards
- Inventory reports

Fixed:

- Product loading issues
- Inventory table actions
- Archive status workflow

Testing completed:

✔ Product display

✔ View details

✔ Archive product

✔ Dashboard inventory integration

Technical Notes:

Products and stock_entries are separate database entities.

Stock quantity operations must be handled through stock_entries relationships.

====================================================

## Inventory V4 Stock Management

Completed:

- Stock In Workflow
- Stock Out Workflow
- Stock Entries
- Stock Out Entries
- Inventory Table Integration
- Inventory Dashboard Statistics
- Live Inventory Stock Calculation
- Inventory Value Calculation
- Low Stock Detection

Fixed:

- Inventory dashboard displaying outdated stock quantities.
- Inventory value using Stock In totals instead of current stock.
- Dashboard statistics now match Inventory Table calculations.
- Unified stock calculation across Inventory components.
- Removed temporary debugging logs after validation.

Testing Completed:

✔ Stock In updates inventory correctly.

✔ Stock Out updates inventory correctly.

✔ Inventory table displays current stock.

✔ Dashboard statistics match inventory table.

✔ Inventory value calculation verified.

✔ Low stock calculation verified.

Verified Formula:

Current Stock

=

Total Stock In

−

Total Stock Out

Inventory Value

=

Current Stock

×

Purchase Price

Technical Notes:

- Stock calculations are derived dynamically from stock_entries and stock_out_entries.
- Inventory dashboard and table now share the same calculation logic.
- Supabase relationships for Stock In and Stock Out verified.
- Inventory module is ready for Batch Management.

====================================================

Next Development Phase

Inventory V4 - Batch & Expiry Management

Planned:

- Batch Number Tracking
- Expiry Date Tracking
- Batch-wise Inventory
- FIFO Stock Consumption
- Inventory Adjustment
- Stock Transfer
- Expired Stock Alerts
- Inventory Permissions