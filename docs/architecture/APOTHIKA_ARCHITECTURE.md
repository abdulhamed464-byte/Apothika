# APOTHIKA ERP
# SYSTEM ARCHITECTURE
Version: 1.0
Architecture Status: Stable

====================================================
PROJECT VISION
====================================================

APOTHIKA is a cloud-native Modular ERP Platform.

It is designed as a multi-industry SaaS application where
each business activates only the modules required for its industry.

Example

Workspace
        ↓
Organization
        ↓
Industry
        ↓
Enabled Modules
        ↓
Business Data

Examples

Pharmacy
Restaurant
Retail
Warehouse
Manufacturing
Hospital
Wholesale

Future industries can be added without changing the core system.

====================================================
ARCHITECTURE PRINCIPLES
====================================================

1. Modular Design

Every feature is an independent module.

Examples

Inventory

Purchase

Sales

Supplier

Customer

Reports

Finance

Settings

Future AI

Each module should be isolated.

----------------------------------------------------

2. Service Layer

UI never directly talks to Supabase.

Always

React Component

↓

Service Layer

↓

Supabase

↓

Database

----------------------------------------------------

3. Reusable Components

Never duplicate UI.

Everything reusable.

Examples

Buttons

Cards

Tables

Forms

Modals

Statistics Cards

Search Bar

Filters

Reports

====================================================
PROJECT STRUCTURE
====================================================

src/

    components/

        dashboard/

        inventory/

        purchase/

        supplier/

        customer/

        shared/

    pages/

        Dashboard.tsx

        Inventory.tsx

        Purchase.tsx

        Suppliers.tsx

        Customers.tsx

        Reports.tsx

        Settings.tsx

    services/

        inventory/

        purchase/

        supplier/

        customer/

        auth/

    lib/

        supabase.ts

    hooks/

    utils/

    types/

====================================================
DATABASE ARCHITECTURE
====================================================

Core Tables

profiles

organizations

workspaces

user_workspaces

industries

modules

workspace_modules

----------------------------------------------------

Business Tables

products

suppliers

customers

purchases

purchase_items

sales

sale_items

stock_entries

payments

====================================================
RELATIONSHIPS
====================================================

Workspace

↓

Products

↓

Purchase Items

↓

Stock Entries

↓

Inventory

----------------------------------------------------

Supplier

↓

Purchase

↓

Purchase Items

----------------------------------------------------

Customer

↓

Sales

↓

Sale Items

====================================================
SERVICE ARCHITECTURE
====================================================

Every module has

Service

↓

CRUD Functions

↓

Validation

↓

Database

Example

ProductService

getProducts()

createProduct()

updateProduct()

deleteProduct()

searchProducts()

generateSKU()

generateBarcode()

====================================================
INVENTORY ARCHITECTURE
====================================================

Inventory Module

Statistics

↓

Product Form

↓

Product Table

↓

Reports

Future

↓

Scanner

↓

Barcode Lookup

↓

Label Generator

↓

Stock Adjustment

↓

Expiry

↓

Batch

====================================================
PURCHASE FLOW
====================================================

Supplier

↓

Purchase

↓

Purchase Items

↓

Stock Entry

↓

Inventory Updated

====================================================
SALES FLOW
====================================================

Customer

↓

Sales Invoice

↓

Sale Items

↓

Reduce Stock

↓

Payment

↓

Reports

====================================================
REPORTING ARCHITECTURE
====================================================

Every module provides

Statistics

Charts

Export

PDF

Excel

Print

====================================================
UI STANDARDS
====================================================

Theme

Enterprise Glass ERP

Dark Background

Emerald Green Accent

Rounded Cards

Soft Shadows

Large Headings

Professional Business Appearance

Each module follows

Header

↓

Statistics

↓

Action Buttons

↓

Form

↓

Search

↓

Filters

↓

Table

↓

Details Modal

↓

Reports

====================================================
FORM STANDARDS
====================================================

Every Create/Edit Form

Section Based

Example

General Information

Identity

Pricing

Inventory

Image

Status

Buttons always

Save

Cancel

====================================================
TABLE STANDARDS
====================================================

Every Table

Search

Filters

Sorting

Pagination

Actions

Edit

Delete

View

Print

====================================================
CODING STANDARDS
====================================================

React Functional Components

TypeScript Interfaces

Service Layer

Async/Await

No Duplicate Code

Reusable Components

Meaningful Variable Names

====================================================
SECURITY
====================================================

Authentication

Supabase Auth

Authorization

Role Based

Workspace Isolation

Row Level Security

Audit Ready

====================================================
FUTURE AI LAYER
====================================================

APOTHIKA Intelligence Layer

Business Health Score

Inventory Prediction

Demand Forecast

Low Stock Intelligence

Purchase Recommendation

Cash Flow Analysis

Business Risk Detection

Decision Engine

====================================================
ROADMAP
====================================================

Phase 1

Foundation

Authentication

Dashboard

Purchase

Inventory

---------------------------------

Phase 2

Supplier

Customer

Sales

Reports

---------------------------------

Phase 3

Finance

HR

Payroll

Assets

CRM

---------------------------------

Phase 4

AI Layer

Analytics

Automation

Prediction

====================================================
DEVELOPMENT RULES
====================================================

Never rewrite working architecture.

Never duplicate business logic.

Always use services.

Always keep modules independent.

Every new feature must fit inside this architecture.

When suggesting code:

1. Preserve architecture.
2. Follow folder structure.
3. Maintain reusable components.
4. Keep database relationships intact.
5. Write production-ready code.
6. Explain architectural decisions when introducing new patterns.

====================================================
MISSION
====================================================

Build APOTHIKA into a world-class cloud ERP platform with modular architecture, enterprise-grade code quality, and an AI-powered business intelligence layer.


## Inventory Architecture

Inventory module contains:

ProductService
- Product CRUD operations
- Workspace based products

SKUService
- SKU generation
- SKU uniqueness checking

BarcodeService
- Barcode generation
- Barcode validation
- Barcode type detection

Future:
- BarcodeScanner using ZXing
- Warehouse stock tracking
- Batch and expiry management