# Dawn Estate - Luxury Real Estate Platform

Dawn Estate is a luxury real estate marketplace and property management platform designed for premium property listings, multilingual browsing, lead generation, and internal moderation workflows. The project combines a modern React frontend with a secure Express backend and Prisma-powered database layer to support listings, authentication, uploads, and admin operations.

This README is written as a comprehensive project summary for reporting, presentation, and reuse. It captures the business purpose, technical architecture, feature set, workflows, and operational details needed to understand the platform as a complete website.

## 1. Project Overview

Dawn Estate is a digital real estate platform focused on luxury residential and commercial property discovery in Morocco, with a premium aesthetic and a multilingual experience. The website allows users to:

- browse premium property listings
- view detailed property information
- filter properties by category, location, price, and amenities
- submit property listings for review
- request an estimated property value
- contact agents through WhatsApp or contact channels
- manage content through an admin dashboard

The platform combines user-facing property search with administrative review and moderation capabilities, making it suitable for both a public listing website and an internal real estate operations flow.

## 2. Business and Functional Purpose

The main goal of the project is to provide an elegant digital presence for a premium real estate brand while supporting lead generation and listing management.

Core business objectives:

- present properties in a sophisticated and premium visual format
- make property discovery easy through advanced filtering
- offer a trust-building experience for buyers, tenants, and investors
- support property sellers and users who want to publish their own offerings
- allow administrators to approve or reject listings before publication
- collect estimation requests from prospects interested in valuation or purchase

## 3. Key Features

### Frontend features
- multilingual user interface: English, French, and Arabic
- RTL support for Arabic layout
- luxury dark aesthetic with warm earthy brand colors
- responsive design for desktop, tablet, and mobile screens
- animated transitions and premium UI motion effects
- curated property cards and feature-rich listing pages
- contact and WhatsApp actions for each property
- public plus authenticated user flows

### Listing and search features
- property search by category, city, price range, and pool availability
- sale and rent transaction types
- property detail pages with gallery and video support
- dynamic filters for premium browsing experience
- recent property showcase on the homepage

### User functions
- user registration and login
- JWT-based authentication
- property submission form for authenticated users
- media upload for property images and videos
- support for property owner and admin moderation

### Admin functions
- dashboard overview with site statistics
- property moderation queue
- approve or reject submissions
- delete unwanted listings
- view user list and manage roles
- review estimation requests

### Additional functionality
- WhatsApp property contact integration
- estimation request form for valuation assistance
- file upload handling for media assets
- demo data seeding for quick testing

## 4. Website Structure and Pages

The application includes the following major pages:

1. Home Page
   - luxury hero section
   - brand positioning and call-to-action buttons
   - recent property showcase
   - premium value proposition section

2. Properties Page
   - searchable property catalog
   - filters for category, price, city, pool, and transaction type
   - responsive property grid

3. Property Detail Page
   - large image gallery
   - property attributes and statistics
   - location and description
   - WhatsApp direct contact action

4. Add Property Page
   - authenticated form for creating listings
   - personal information and property details
   - media upload for images and videos
   - listing submission and validation flow

5. Help / Estimation Page
   - valuation request form
   - leads generation for prospect inquiries

6. Contact Page
   - general contact information and inquiry flow

7. Login and Register Pages
   - authentication UI for site users
   - token-based session management

8. Admin Dashboard
   - metrics for users, properties, pending reviews, and estimations
   - moderation tables for properties and estimation requests
   - role and user management actions

## 5. User Roles and Workflow

The platform defines multiple user roles:

- admin
- agent
- user
- client

The key operational logic is:

- a visitor can browse public listings
- a user can create an account and submit a property
- submitted properties remain pending until reviewed
- an admin approves or rejects listings
- approved properties become public and visible in the catalog
- rejected or deleted listings are removed from public access
- estimation requests and other leads are monitored by admin users

Typical property lifecycle:

1. user logs in
2. user submits a property listing with media
3. listing is created with status = pending
4. admin reviews listing in dashboard
5. admin approves or rejects the listing
6. public site updates based on approval status

## 6. Technologies Used

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Radix UI components
- Material UI / Emotion utilities
- Lucide icons and React icons
- Motion library for animation
- React Router DOM for client-side page navigation

### Backend
- Node.js
- Express
- Prisma ORM
- JWT for authentication
- CORS support
- multipart upload handling with multer
- local file serving for uploaded media

### Data and storage
- PostgreSQL-compatible Prisma datasource configuration
- local file storage for uploaded property images/videos
- environment-based configuration via .env

### Additional tools
- bcryptjs for password hashing
- uuid for record IDs
- dotenv for env config
- Vitest for tests
- Supertest for API testing

## 7. Project Structure

```text
Dawn_Estate/
├── public/                  # static assets
├── src/                     # frontend source files
│   ├── app/
│   │   ├── components/      # reusable UI components
│   │   ├── pages/           # page-level views
│   │   └── App.tsx          # app navigation and page routing
│   ├── contexts/            # auth context
│   ├── i18n/                # multilingual translations
│   └── lib/                 # API helper functions
├── server/                  # backend source
│   ├── routes/              # auth, properties, admin, estimations
│   ├── middleware/          # auth middleware
│   ├── utils/               # helper utilities
│   ├── app.ts               # Express application setup
│   ├── index.ts             # server bootstrapping
│   └── seed.ts              # demo seed script
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # database migration scripts
├── API_DOCUMENTATION.md     # REST API documentation
├── DEPLOYMENT_GUIDE.md      # setup and deployment instructions
├── database-mysql.sql       # legacy database bootstrap script
├── package.json             # scripts and dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── README.md                # project summary report
└── .gitignore
```

## 8. Core Architecture

The application is organized into two major layers:

### Frontend layer
- built with React and Vite
- renders public pages and authenticated dashboard views
- integrates with backend APIs via helper module calls
- supports translation context and auth context

### Backend layer
- Express API receives requests from the frontend
- Prisma communicates with the database
- JWT and middleware enforce protected routes
- media uploads are processed and saved locally or through the configured media directory

In simple terms, the project follows a standard layered web architecture:

Client (React UI) -> REST API (Express) -> Prisma/Database -> application logic and moderation workflows

## 9. Database and Data Model

The project uses Prisma models for core entities including:

- User
- Role
- Permission
- RolePermission
- Category
- TransactionType
- Property
- PropertyImage
- EstimationThread
- ForumReply

Core entities used by the application:

### User
Stores account data such as:
- email
- password hash
- first name / last name
- phone
- role
- timestamps

### Property
Stores property listing data such as:
- title
- description
- price
- address and city
- category and transaction type
- property attributes like bedrooms, bathrooms, pool, surface
- status (pending, approved, rejected, etc.)
- creator information

### PropertyImage
Stores uploaded property media:
- image URL
- main image flag
- property relation

### EstimationThread
Stores valuation requests and property estimation interaction data.

This reflects a real-world real-estate system with user-generated listings and moderation support.

## 10. Authentication and Security

Security features implemented in the project include:

- password hashing with bcryptjs
- JWT access tokens for authenticated requests
- protected admin routes
- authorization checks before approving, deleting, or viewing admin data
- upload validation and server-side processing
- secure cookie usage for auth tokens
- optional Google OAuth implementation support

Important security notes:

- ensure JWT_SECRET is configured securely
- change the default admin password after first use
- force HTTPS in production environments
- keep secrets in environment variables or a secret manager
- validate media upload sources and type restrictions before production deployment

## 11. API Overview

The application exposes a REST API under `/api`.

### Authentication endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/google/url`
- `GET /api/auth/callback/google`

### Property endpoints
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id/status`
- `DELETE /api/properties/:id`

### Estimation endpoints
- `POST /api/estimations`
- `GET /api/estimations`

### Admin endpoints
- `GET /api/admin/stats`
- `GET /api/admin/users`

### Upload and health endpoints
- `POST /api/upload`
- `GET /api/health`

The API supports filters such as:
- category
- prestation
- city
- minPrice
- maxPrice
- pool
- status

## 12. Default Demo Accounts

The seed script creates demo users automatically.

```text
Admin:
Email: admin@dawnestate.com
Password: Admin@2024!

Agent:
Email: agent@dawnestate.com
Password: Agent@2024!

User:
Email: user@dawnestate.com
Password: User@2024!
```

These credentials are intended for local testing and demonstration purposes.

## 13. Environment Variables

The project expects environment-based configuration. Typical variables include:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dawn_estate
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_API_BASE_URL=http://localhost:3001/api
PORT=3001
```

Notes:
- the Prisma schema is configured for PostgreSQL
- earlier documentation refers to MySQL in places, so the implementation should be aligned to the actual deployment database engine
- local development is usually run with front-end on port 5173 and backend on port 3001

## 14. Setup and Run Instructions

### Install dependencies

```bash
npm install
```

### Configure environment
Create a `.env` file and set the database and auth variables.

### Generate Prisma client

```bash
npm run prisma:generate
```

### Start the backend

```bash
npm run server
```

### Start the frontend

```bash
npm run dev
```

### Seed demo data

```bash
npm run seed:demo
```

### Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## 15. Deployment Notes

The project includes deployment- and setup-oriented guidance in separate documentation files:

- `DEPLOYMENT_GUIDE.md`
- `API_DOCUMENTATION.md`

These documents describe environment configuration, database setup, secure deployment, and endpoint usage.

Recommended production improvements:

- use a managed database such as PostgreSQL or MySQL in production
- serve uploaded media with a CDN or object storage service
- configure email sending for user and admin notifications
- enforce stricter validation for uploaded media files
- rotate secrets and manage them via environment secret storage
- enable HTTPS and production security headers

## 16. Limitations and Current State

The current implementation is a functional demo and development-ready real estate platform with a premium UI and digital workflow. Some features are intentionally simple and should be expanded for production use, including:

- no live email notification system
- local media storage instead of cloud object storage
- demo account credentials intended only for test environments
- simplified administrative and validation flows compared to a full commercial CRM

## 17. Summary for Reporting

Dawn Estate is a luxury real estate website built with a modern React frontend and Express/Prisma backend. It offers multilingual, premium property browsing, real listing submission and moderation, admin controls, and lead generation mechanisms. The platform is designed to serve as a polished real-estate marketplace with both public-facing discovery and internal operational workflows, making it suitable for showcasing property inventory, managing listings, and supporting sales and valuation outreach.

## 18. Credits

Dawn Estate is presented as a modern luxury property platform for premium real estate promotion and listing management.

---

Project Name: Dawn Estate
Type: Real Estate Marketplace / Property Listing Platform
Stack: React + Vite + TypeScript + Tailwind + Express + Prisma + JWT
Status: Demo / Development-ready project with premium UI and admin workflows
