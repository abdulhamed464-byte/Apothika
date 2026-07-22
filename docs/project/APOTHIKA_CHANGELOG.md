# APOTHIKA CHANGELOG

---

# Version 0.1.0

Date:
2026-07-21

Completed

Authentication

Features:

- Login
- Registration
- Workspace detection


Database:

- profiles
- workspaces


Files Changed:

src/pages/Login.tsx

src/pages/Register.tsx

src/services/auth/AuthService.ts


---

# Version 0.2.0

Completed

Purchase Module

Features:

- Purchase Creation
- Purchase History
- Purchase Details
- PDF Export
- Inventory Update


Database:

Added:

- purchase_items
- stock_entries


Files Changed:

src/pages/Purchase.tsx

src/components/purchase/PurchaseModal.tsx

src/services/purchase/PurchaseService.ts


---

# Version 0.3.0

Completed

Inventory Product Master V2

Features:

- Product Form
- SKU
- Barcode
- Brand
- Category
- Pricing
- Inventory Rules


Files Changed:

Inventory.tsx

ProductForm.tsx

ProductService.ts


Database:

- products table enhanced


---

# Version 0.4.0

Completed

Inventory V3 Professional Barcode System


Features:

- SKU generation service
- SKU validation foundation
- Barcode generation
- Barcode validation
- Camera barcode scanner
- Barcode lookup
- Barcode labels
- Product image upload
- Product image preview
- Search and filtering
- Product editing
- Product deletion
- Product details modal


Files Added:

src/components/inventory/BarcodeScanner.tsx

src/components/inventory/BarcodeLabel.tsx

src/components/inventory/InventoryScannerButton.tsx

src/components/inventory/ProductDetailsModal.tsx

src/components/shared/ImageUploader.tsx

src/components/shared/SearchFilterBar.tsx

src/services/inventory/BarcodeLookupService.ts


---

# Next Version

Inventory V4

Stock Management System

Features:

- Stock In
- Stock Out
- Stock Adjustment
- Movement History
- Batch Tracking
- Expiry Tracking
