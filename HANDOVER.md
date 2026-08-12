# Apothika — Buyer Handover Guide

## 1. What the Buyer Receives

The sale includes the Apothika software project and its existing implementation.

Included:

- Source code
- Application UI and frontend implementation
- Existing project structure
- Existing documentation
- Design assets included in the repository
- Existing inventory and business-management functionality
- Current production deployment configuration
- Setup and deployment documentation

## 2. Technology Stack

Apothika is built using:

- React
- TypeScript
- Vite
- Supabase
- React Router
- Tailwind CSS
- Recharts
- Lucide React

## 3. Current Production Application

Live demo:

https://apothika.vercel.app

The application currently includes authentication and a protected business dashboard.

## 4. Current Features

The existing implementation includes:

- User registration
- User authentication
- Protected dashboard
- Product management
- SKU management
- Inventory management
- Stock In workflows
- Stock Out workflows
- Stock adjustments
- Purchase management
- Supplier management
- Inventory transactions
- Dashboard analytics
- Responsive web interface

## 5. Accounts and Services

The buyer should create and control their own accounts for:

- GitHub
- Vercel
- Supabase
- Domain provider
- Any future third-party services

The seller's personal credentials should not be transferred.

## 6. Environment Variables

The application requires:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

The buyer should create their own Supabase project and configure these values.

Refer to `SETUP.md` for installation and deployment instructions.

## 7. Supabase

The buyer should use their own Supabase project for the transferred application.

The buyer is responsible for configuring:

- Authentication
- Database
- Database policies
- Production URL configuration
- Any future Supabase services

Production credentials should not be stored in the Git repository.

## 8. GitHub Transfer

The buyer should receive or clone the source code into a repository controlled by the buyer.

After transfer, the buyer should verify:

```bash
npm install
npm run build
```

The buyer should then configure their own environment variables and deployment.

## 9. Vercel Transfer

The buyer should deploy the project under their own Vercel account.

Recommended configuration:

- Framework: Vite
- Build command: `npm run build`
- Node.js: 24.x

The buyer should configure the required environment variables in Vercel before deploying.

## 10. Domain

The current application is available at:

https://apothika.vercel.app

The buyer may continue using the existing deployment during transition or deploy the project under a new Vercel project and domain.

Any custom domain should be controlled by the buyer after the sale.

## 11. Security

The buyer should generate and control their own credentials.

Do not reuse or request the seller's private credentials.

Never commit:

- `.env`
- Service-role keys
- Private API keys
- Database passwords
- Vercel access tokens
- Other private credentials

## 12. Recommended Buyer Handover Process

1. Buyer receives the source code.
2. Buyer creates their GitHub repository.
3. Buyer creates or configures their Supabase project.
4. Buyer configures environment variables.
5. Buyer deploys to their Vercel account.
6. Buyer verifies registration and login.
7. Buyer verifies the dashboard.
8. Buyer verifies inventory functionality.
9. Buyer connects their domain if required.
10. Seller removes or relinquishes access to services that were used only for the original deployment.

## 13. Current Business Status

Apothika is a pre-revenue software asset.

There are currently no represented customers or recurring revenue.

The value of the project is primarily in the existing software implementation, product foundation, UI, authentication, inventory functionality, documentation, and ability to continue development.

## 14. Potential Market Opportunities

The buyer can continue developing Apothika for:

- Retail businesses
- Pharmacies
- Medical suppliers
- Wholesalers
- Distributors
- Warehouses
- Small businesses
- Inventory-focused service businesses

Potential future development areas include:

- Barcode scanning
- Purchase orders
- Advanced reporting
- Multi-location inventory
- Role-based permissions
- Low-stock alerts
- Customer management
- Supplier analytics
- Billing and subscriptions
- Mobile/PWA support
- Industry-specific workflows

## 15. Documentation

Additional setup instructions are available in:

`SETUP.md`

The main project information is available in:

`README.md`

## 16. Important Note

This handover document describes the current project state and intended transfer process.

The buyer should independently verify the application's functionality, source code, dependencies, infrastructure, and configuration before completing a transaction.

The buyer should replace all seller-controlled credentials and services with accounts controlled by the buyer.