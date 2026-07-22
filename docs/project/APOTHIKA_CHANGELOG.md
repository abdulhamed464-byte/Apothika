# APOTHIKA CHANGELOG

---

# Version 0.1.0

Date:
2026-07-21

Completed

- Authentication
- Login
- Registration
- Workspace detection

Database

- profiles
- workspaces

Files Changed

src/pages/Login.tsx

src/pages/Register.tsx

src/services/auth/AuthService.ts

---

# Version 0.2.0

Completed

Purchase Module

Features

- Purchase Creation
- Purchase History
- Purchase Details
- PDF Export
- Inventory Update

Database

Added

purchase_items

stock_entries

Files Changed

src/pages/Purchase.tsx

src/components/purchase/PurchaseModal.tsx

src/services/purchase/PurchaseService.ts

---

# Version 0.3.0

Completed

Inventory Product Master V2

Features

- Product Form
- SKU
- Barcode
- Brand
- Category
- Pricing
- Inventory Rules

Files Changed

Inventory.tsx

ProductForm.tsx

ProductService.ts

Database

products table updated

Next Version

Inventory V3
Professional Barcode Scanner

## Inventory V3 - SKU and Barcode Foundation

Completed:

- Added SKU generation service
- Added barcode service
- Added barcode validation utility
- Added SKU generator utility
- Added product identity improvements
- Added barcode generation capability
- Prepared system for barcode scanner integration