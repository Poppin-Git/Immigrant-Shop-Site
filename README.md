# Firebase Express E-Commerce Application

A modern e-commerce platform built with Node.js, Express, Firebase Firestore, and EJS. This application includes a complete admin dashboard, dynamic content management system, product catalog with discounts, shopping cart, and comprehensive business features.

**Status**: ✅ FULLY IMPLEMENTED & TESTED  
**Current Version**: 1.0.0  
**Node.js Port**: 3000

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Admin Dashboard](#admin-dashboard)
6. [Setup Instructions](#setup-instructions)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Configuration](#configuration)
10. [Scripts & Utilities](#scripts--utilities)
11. [Troubleshooting](#troubleshooting)
12. [Development](#development)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your configuration
echo "NODE_ENV=development
PORT=3000
SESSION_SECRET=your-secret-key" > .env

# 3. Add Firebase service account key
# Download from Firebase Console → Service Accounts
# Save as serviceAccountKey.json in project root

# 4. Start the server
npm start

# 5. Open in browser
# http://localhost:3000
```

---

## 🛠 Technology Stack

| Technology | Purpose | Version |
|---|---|---|
| **Node.js** | JavaScript runtime | LTS |
| **Express.js** | Web framework | Latest |
| **Firebase Admin SDK** | Backend database & auth | Latest |
| **Firestore** | NoSQL cloud database | Native |
| **EJS** | Template engine | Latest |
| **bcrypt** | Password hashing | Latest |
| **express-session** | Session management | Latest |
| **dotenv** | Environment variables | Latest |

---

## 📁 Project Structure

```
project-root/
│
├── server.js                          # Main Express application entry point
├── firebase.js                        # Firebase initialization
├── package.json                       # Dependencies & scripts
├── .env                               # Environment configuration (create locally)
├── .gitignore                         # Git ignore rules
│
├── routes/                            # Express route handlers
│   ├── publicRoutes.js               # Public pages (home, about, products, etc.)
│   ├── authRoutes.js                 # Authentication (login, register, logout)
│   └── adminRoutes.js                # Admin-only routes and dashboard
│
├── controllers/                       # Business logic
│   ├── contentController.js           # Content management logic
│   ├── discountController.js          # Discount CRUD operations
│   └── productController.js           # Product operations
│
├── middleware/                        # Express middleware
│   └── authMiddleware.js              # Authentication & authorization checks
│
├── models/                            # Database operations
│   ├── userModel.js                   # User Firestore operations
│   └── contentModel.js                # Content management DB operations
│
├── views/                             # EJS templates
│   ├── layouts/
│   │   ├── adminLayout.ejs            # Admin page wrapper
│   │   ├── publicLayout.ejs           # Public page wrapper
│   │   └── authLayout.ejs             # Auth page wrapper
│   │
│   ├── partials/                      # Reusable components
│   │   ├── _header.ejs                # Navigation header
│   │   ├── _footer.ejs                # Page footer
│   │   ├── _adminSidebar.ejs          # Admin sidebar navigation
│   │   └── _productCard.ejs           # Product card component
│   │
│   ├── admin/                         # Admin pages
│   │   ├── dashboard.ejs              # Admin dashboard (16 widgets)
│   │   ├── products.ejs               # Product management
│   │   ├── discounts.ejs              # Discount management
│   │   ├── changePassword.ejs         # Password change form
│   │   ├── profile.ejs                # Admin profile
│   │   ├── messages.ejs               # Contact messages
│   │   └── content/                   # Content editing pages
│   │       ├── home.ejs
│   │       ├── about.ejs
│   │       ├── contact.ejs
│   │       ├── faq.ejs
│   │       ├── services.ejs
│   │       ├── gallery.ejs
│   │       ├── testimonials.ejs
│   │       └── team.ejs
│   │
│   ├── public/                        # Public pages
│   │   ├── home.ejs
│   │   ├── about.ejs
│   │   ├── contact.ejs
│   │   ├── products.ejs
│   │   ├── faq.ejs
│   │   ├── services.ejs
│   │   ├── gallery.ejs
│   │   ├── testimonials.ejs
│   │   └── team.ejs
│   │
│   └── auth/                          # Authentication pages
│       ├── login.ejs
│       └── register.ejs
│
├── public/                            # Static assets
│   ├── css/
│   │   └── style.css                  # Global styles
│   ├── js/
│   │   └── cart.js                    # Shopping cart functionality (450+ lines)
│   └── images/                        # Static images
│
├── scripts/                           # Utility scripts
│   ├── updateFirebaseData.js          # Update database fields
│   ├── initializeFirebase.js          # Initialize defaults
│   └── README.md                      # Script documentation
│
└── node_modules/                      # Dependencies (auto-generated)
```

---

## ✨ Core Features

### 🎨 UI/UX Design System

**Modern Design Principles:**
- **Responsive Design**: Fully mobile-optimized with touch-friendly interactions
- **Dark Mode Support**: Complete theme switching with persistent preferences
- **Smooth Animations**: Professional hover effects, transitions, and micro-interactions
- **Accessibility**: Proper contrast ratios, semantic HTML, and keyboard navigation
- **Performance**: Optimized loading with efficient CSS and minimal JavaScript

**Interactive Elements:**
- **Enhanced Hover Effects**: All buttons, links, and cards have reactive animations
- **Card Components**: Product cards, service cards, and content cards with lift effects
- **Navigation**: Sticky header with smooth mobile menu transitions
- **Form Interactions**: Real-time validation feedback and focus states
- **Loading States**: Smooth transitions between page states

**Mobile-First Approach:**
- **Touch Targets**: All interactive elements meet 44px minimum size requirements
- **Gesture Support**: Swipe-friendly galleries and responsive touch interactions
- **Mobile Navigation**: Collapsible sidebar with smooth open/close animations
- **Responsive Grids**: Flexible layouts that adapt to any screen size
- **Mobile Typography**: Optimized font sizes and line heights for readability

### 🔐 Authentication System
- User registration with email validation
- Secure login with bcrypt password hashing
- Session-based authentication
- Admin-only route protection
- Password change with validation (8+ chars, uppercase, lowercase, number, special char)
- User profile management with last login tracking

### 📊 Admin Dashboard
**16 interactive widgets across 4 sections:**

**Section A - Overview:**
- Total Products count
- Total Messages count
- Total Categories count
- Total Admins count

**Section B - Engagement Metrics:**
- Today's Visitors
- Weekly Views
- Bounce Rate
- Conversion Rate

**Section C - Shop Status:**
- Featured Products count
- Hidden Products count
- Discounted Products count
- Out of Stock count

**Section D - System:**
- Last Login timestamp
- System Status indicator
- Storage Usage
- Database Size

**Quick Action Buttons:**
- 📝 Create Product
- 🏷️ Manage Discounts
- 📄 Edit Content
- 👥 View Messages
- ⚙️ System Settings
- 🔒 Change Password

### 📄 Dynamic Content Management
**8 fully editable pages:**
1. **Homepage** - Hero section, intro, featured content
2. **About** - Company information, mission, values
3. **Contact** - Business contact details, WhatsApp, email, phone, address, hours
4. **FAQ** - Frequently asked questions with answers
5. **Services** - Service listings with descriptions
6. **Gallery** - Image gallery with captions
7. **Testimonials** - Customer reviews and ratings
8. **Team** - Team member profiles

All content:
- Editable through admin panel (`/admin/content/{page}`)
- Stored in Firestore `siteContent` collection
- Display dynamically on public pages
- Persist across server restarts
- Support Firestore merge updates for instant changes

### 🛍️ Product Management System

**Product Features:**
- Complete CRUD operations (Create, Read, Update, Delete)
- Product images via URL
- Price management
- Discount system (percentage-based)
- Category organization
- Stock/inventory tracking
- Active/inactive status
- Product descriptions

**Product Display:**
- Responsive grid layout (3-4 columns)
- Product images with fallback
- Discount badges (e.g., "20% OFF")
- Original pricing (strikethrough if discounted)
- Calculated discounted price
- "Add to Cart" functionality
- "Learn More" modal with product details
- WhatsApp inquiry button

### 🏷️ Discount Management System

**Discount Features:**
- Create, read, update, delete discounts
- Discount codes for customer use
- Two types: Percentage or Fixed Amount
- Maximum usage limits with tracking
- Expiry dates
- Active/inactive toggle
- Applied to products at checkout

**Admin Interface:**
- Discount list with statistics
- Create new discount form
- Edit existing discounts
- Delete discounts
- Usage tracking (current uses / max uses)

### 🛒 Shopping Cart System

**Features:**
- LocalStorage persistence (survives page refresh)
- Add items to cart
- Remove items from cart
- Adjust quantity (+ and - buttons)
- Real-time total calculation
- Discount calculation and application
- WhatsApp checkout integration
- Empty cart message

**Cart UI:**
- Modern gradient design (purple to pink)
- Dark mode support
- Smooth animations and transitions
- Responsive mobile design
- Item cards with organized information
- Better visual hierarchy
- Professional typography

### 📬 Contact Management
- Contact form submission to Firestore
- Admin message inbox at `/admin/messages`
- Dynamic contact page with business info
- WhatsApp integration
- Contact hours management

### 🌓 Dark Mode Support
- System-wide dark mode toggle with CSS variables
- Persistent user preference via localStorage
- Smooth transitions between modes
- All pages and components inherit CSS variables correctly
- Proper contrast ratios for accessibility
- Dark mode does NOT turn off when switching tabs

---

## 📊 Admin Dashboard

### Dashboard Access
**URL:** `http://localhost:3000/admin/dashboard`

**Requirements:** Login as admin user

### Widget Features

All 16 widgets have:
- Unique IDs for targeting
- Data attributes for JavaScript access
- Real-time data from Firestore
- Responsive card layout
- Icon indicators
- Numerical displays

### Quick Actions Panel

6 action buttons with emoji icons:
- **Create Product** → `/admin/products/new`
- **Manage Discounts** → `/admin/discounts`
- **Edit Content** → Dashboard sidebar link
- **View Messages** → `/admin/messages`
- **Settings** → `/admin/settings`
- **Change Password** → `/admin/changePassword`

### Sidebar Navigation

**Main Sections:**
- Dashboard (home)
- Products
- Content Management
- Discounts
- Messages
- Settings
- Profile
- Change Password
- Logout

---

## 🔧 Setup Instructions

### Prerequisites

1. **Node.js** (LTS version recommended)
2. **Firebase Account**
   - Create project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database (Native mode)
   - Create Service Account (Project Settings → Service Accounts)
   - Generate private key (download as JSON)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd project-root
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in package.json:
- express
- express-session
- ejs
- firebase-admin
- bcrypt
- dotenv
- nodemon (dev)
- uuid
- And more...

### Step 3: Configure Firebase

1. Download service account JSON from Firebase Console
2. Save as `serviceAccountKey.json` in project root
3. The file will be automatically ignored by Git (.gitignore)

**Never commit this file - it contains sensitive credentials!**

### Step 4: Create .env File

Create `.env` in project root:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Session Secret (change in production)
SESSION_SECRET=your-very-secret-key-change-this-in-production

# Optional: Firebase configuration (if not using service account key file)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Step 5: Initialize Database (Optional)

To seed the database with default content:

```bash
node scripts/initializeFirebase.js
```

This creates:
- Homepage content
- About page content
- Contact information
- FAQ entries
- Services list
- Gallery templates
- Testimonials section
- Team members
- System settings

### Step 6: Start Development Server

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Step 7: Test the Application

**Public Pages:**
- Home: http://localhost:3000/
- About: http://localhost:3000/about
- Products: http://localhost:3000/products
- Contact: http://localhost:3000/contact
- FAQ: http://localhost:3000/faq
- Services: http://localhost:3000/services
- Gallery: http://localhost:3000/gallery
- Testimonials: http://localhost:3000/testimonials
- Team: http://localhost:3000/team

**Authentication:**
- Register: http://localhost:3000/auth/register
- Login: http://localhost:3000/auth/login

**Admin Panel (requires login as admin):**
- Dashboard: http://localhost:3000/admin/dashboard
- Products: http://localhost:3000/admin/products
- Discounts: http://localhost:3000/admin/discounts
- Messages: http://localhost:3000/admin/messages
- Edit Content: http://localhost:3000/admin/content/home (and other pages)
- Settings: http://localhost:3000/admin/settings
- Change Password: http://localhost:3000/admin/changePassword

---

## 🗄️ Database Schema

### Firestore Collections

#### **users** Collection
```javascript
users/{userId}
{
  email: string,                    // User email address (unique)
  passwordHash: string,             // bcrypt hashed password
  role: "user" | "admin",          // User role
  isActive: boolean,                // Account status
  lastLogin: Timestamp,             // Last login time
  createdAt: Timestamp,             // Account creation date
  updatedAt: Timestamp              // Last update date
}
```

#### **products** Collection
```javascript
products/{productId}
{
  name: string,                     // Product name
  description: string,              // Product description
  price: number,                    // Base price in USD
  discount: number,                 // Discount percentage (0-100)
  imageUrl: string,                 // Product image URL
  category: string,                 // Product category
  stock: number | string,           // Available quantity
  isActive: boolean,                // Product visibility
  createdAt: Timestamp,             // Creation date
  updatedAt: Timestamp              // Last update date
}
```

#### **discounts** Collection
```javascript
discounts/{discountId}
{
  name: string,                     // Discount name
  code: string,                     // Unique discount code
  type: "percentage" | "fixed",     // Discount type
  value: number,                    // Discount amount/percent
  description: string,              // Discount description
  maxUses: number,                  // Maximum usage limit (-1 = unlimited)
  currentUses: number,              // Times used so far
  expiryDate: Timestamp,            // Expiration date
  active: boolean,                  // Is active?
  createdAt: Timestamp,             // Creation date
  updatedAt: Timestamp              // Last update date
}
```

#### **messages** Collection
```javascript
messages/{messageId}
{
  name: string,                     // Sender name
  email: string,                    // Sender email
  subject: string,                  // Message subject
  message: string,                  // Message content
  phone: string,                    // Sender phone (optional)
  status: "unread" | "read",        // Message status
  createdAt: Timestamp              // Submission date
}
```

#### **siteContent** Collection

Dynamic content for all 8 pages. Each page has similar structure:

```javascript
// Homepage
siteContent/homepage
{
  title: string,
  subtitle: string,
  introText: string,
  ctaButton: string,
  heroImage: string,
  updatedAt: Timestamp
}

// About Page
siteContent/about
{
  title: string,
  content: string,
  mission: string,
  values: Array<string>,
  teamIntro: string,
  updatedAt: Timestamp
}

// Contact Page
siteContent/contact
{
  title: string,
  email: string,
  phone: string,
  address: string,
  whatsapp: string,
  hours: Array<{day: string, hours: string}>,
  mapUrl: string,
  updatedAt: Timestamp
}

// Similar structure for:
// - faq
// - services
// - gallery
// - testimonials
// - team
```

#### **settings** Collection
```javascript
settings/system
{
  siteTitle: string,                // Website title
  siteEmail: string,                // Contact email
  sitePhone: string,                // Contact phone
  siteAddress: string,              // Business address
  siteLogo: string,                 // Logo URL
  whatsappNumber: string,           // WhatsApp number
  maintenanceMode: boolean,         // Site maintenance mode
  updatedAt: Timestamp
}
```

---

## 🔌 API Endpoints

### Public Routes

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | Home page |
| GET | `/about` | About page |
| GET | `/products` | Products listing |
| GET | `/contact` | Contact page |
| GET | `/faq` | FAQ page |
| GET | `/services` | Services page |
| GET | `/gallery` | Gallery page |
| GET | `/testimonials` | Testimonials page |
| GET | `/team` | Team page |
| POST | `/contact/submit` | Submit contact form |

### Authentication Routes

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/auth/register` | Registration form |
| POST | `/auth/register` | Process registration |
| GET | `/auth/login` | Login form |
| POST | `/auth/login` | Process login |
| GET | `/auth/logout` | Logout user |

### Admin Routes (Protected - Require Authentication)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/dashboard` | Admin dashboard |
| GET | `/admin/products` | Products management |
| GET | `/admin/products/new` | Create product form |
| POST | `/admin/products` | Save new product |
| GET | `/admin/products/:id/edit` | Edit product form |
| POST | `/admin/products/:id/edit` | Update product |
| POST | `/admin/products/:id/delete` | Delete product |
| GET | `/admin/discounts` | Discounts management |
| GET | `/admin/discounts/create` | Create discount form |
| POST | `/admin/discounts/create` | Save discount |
| GET | `/admin/discounts/:id/edit` | Edit discount form |
| POST | `/admin/discounts/:id/edit` | Update discount |
| POST | `/admin/discounts/:id/delete` | Delete discount |
| GET | `/admin/messages` | View contact messages |
| GET | `/admin/content/:page` | Edit page content |
| POST | `/admin/content/:page` | Save page content |
| GET | `/admin/settings` | Settings page |
| POST | `/admin/settings` | Save settings |
| GET | `/admin/profile` | User profile |
| GET | `/admin/changePassword` | Change password form |
| POST | `/admin/changePassword` | Update password |

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server
NODE_ENV=development                    # development | production
PORT=3000                               # Server port

# Session
SESSION_SECRET=your-secret-key          # Change in production!
SESSION_MAX_AGE=86400000               # Session timeout (ms)

# Firebase (auto-loaded from service account key file)
# Or set manually:
FIREBASE_PROJECT_ID=your-id
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email

# Application
APP_NAME="My E-Commerce Store"
APP_DESCRIPTION="A modern e-commerce platform"
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",           // Start production server
    "dev": "nodemon server.js",          // Development with auto-reload
    "init": "node scripts/initializeFirebase.js",  // Initialize DB
    "update-db": "node scripts/updateFirebaseData.js"  // Update fields
  }
}
```

---

## 🔨 Scripts & Utilities

### Initialize Database

```bash
node scripts/initializeFirebase.js
```

Creates default data for:
- All 8 content pages
- System settings
- Sample contact information
- Empty discounts and products collections

### Update Database Fields

Update a single field in any document:

```bash
node scripts/updateFirebaseData.js [collection] [document] [field] [value]
```

**Examples:**

```bash
# Update site title
node scripts/updateFirebaseData.js settings system siteTitle "My New Store"

# Update contact email
node scripts/updateFirebaseData.js siteContent contact email "contact@mystore.com"

# Set boolean value
node scripts/updateFirebaseData.js settings system maintenanceMode true

# Update numeric value
node scripts/updateFirebaseData.js settings system itemsPerPage 20
```

---

## 🐛 Troubleshooting

### Port Already In Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Firebase Connection Error

**Error:** `Error: Failed to initialize Firebase Admin SDK`

**Solutions:**
1. Verify `serviceAccountKey.json` exists in project root
2. Check Firebase project ID matches
3. Ensure Firestore database is enabled in Firebase Console
4. Verify service account has appropriate permissions

### EJS Template Errors

**Error:** `Error: Cannot find module 'views/...'`

**Solution:**
- Verify file paths in route handlers match actual file structure
- Check that template files exist in `/views` directory
- Ensure file extensions are `.ejs`

### Session Not Persisting

**Error:** User logged out after page refresh

**Solution:**
- Session uses in-memory storage by default
- For production, upgrade to Redis in firebase.js:
  ```javascript
  const RedisStore = require('connect-redis').default;
  const { createClient } = require('redis');
  ```

### Database Not Updating

**Error:** Changes made in admin panel don't appear

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify Firestore write permissions in Security Rules
3. Check that collection names match exactly
4. Ensure values are being serialized correctly to JSON

### Dark Mode Not Working

**Solution:**
- Clear browser cache and local storage
- Check that CSS includes dark mode media query: `@media (prefers-color-scheme: dark)`

---

## � GitHub Setup & Publication

### Quick Start: Publishing to GitHub

Follow these steps to safely publish your project to GitHub:

#### 1. **Prepare Your Environment**

```bash
# Generate a strong SESSION_SECRET
# On Linux/Mac:
openssl rand -hex 32

# On Windows PowerShell (use the generated hex string below):
# Copy-paste a secure random value like: a1b2c3d4e5f6...
```

#### 2. **Update package.json with Your Information**

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/firebase-express-ecommerce.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/firebase-express-ecommerce/issues"
  },
  "homepage": "https://github.com/yourusername/firebase-express-ecommerce#readme"
}
```

**Note:** Replace `yourusername` with your actual GitHub username.

#### 3. **Create Local Environment File**

```bash
# Copy the template
cp .env.example .env

# Edit with your values
# Set: SESSION_SECRET=<your-secure-random-string>
# Set: NODE_ENV=development (for local development)
```

#### 4. **Initialize Git Repository**

```bash
cd your-project-directory
git init
git config user.email "your.email@example.com"
git config user.name "Your Name"
```

#### 5. **Verify Safety Before First Commit**

```bash
# Check that sensitive files are NOT tracked
git status

# Verify serviceAccountKey.json is in .gitignore
cat .gitignore | grep serviceAccountKey.json
# Should output: serviceAccountKey.json

# Verify .env is in .gitignore
cat .gitignore | grep "^\.env"
# Should output: .env
```

#### 6. **Make First Commit**

```bash
git add .
git commit -m "Initial commit: Firebase Express E-Commerce Application

- Complete e-commerce platform with admin dashboard
- Product management with discounts and inventory
- User authentication with bcrypt password hashing
- Dynamic content management (8 editable pages)
- Shopping cart with dark mode support
- Admin panel with 16 analytics widgets
- Email and WhatsApp integration
- Responsive mobile-friendly design
- Enterprise-grade security practices"
```

#### 7. **Add GitHub Remote & Push**

```bash
# Create new repository on GitHub.com first

git remote add origin https://github.com/yourusername/firebase-express-ecommerce.git
git branch -M main
git push -u origin main
```

#### 8. **Verify Repository Security**

After pushing to GitHub:

```bash
# Check that sensitive files are NOT in repository
git log --all -S "PRIVATE KEY"
# Should output nothing

git log --all -S "firebase-adminsdk"
# Should output nothing
```

Visit your GitHub repository and verify:
- ✅ `serviceAccountKey.json` is NOT present
- ✅ `.env` is NOT present (only `.env.example` exists)
- ✅ No sensitive files in any commits

#### 9. **Configure on GitHub**

1. Go to your GitHub repository Settings
2. **Branches** → Add Rule → Protect Main Branch
3. Enable:
   - Require pull request reviews before merging
   - Dismiss stale reviews when new commits are pushed
   - Require branches to be up to date before merging

#### 10. **Setup Hosting Platform**

When deploying to Heroku, Railway, Vercel, or other platforms:

**Set these environment variables:**
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=<your-secure-random-string>
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key (full key including newlines)
FIREBASE_CLIENT_EMAIL=your-service-account-email
```

Or upload `serviceAccountKey.json` securely if your platform supports file uploads.

### Important Security Information

#### Files That Must Stay Private

**`serviceAccountKey.json`:**
- Contains Firebase Admin SDK private key
- **NEVER commit to git**
- Already in `.gitignore` ✓
- Save locally only
- If accidentally committed: immediately revoke the key in Firebase Console and generate a new one

**`.env` file:**
- Contains `SESSION_SECRET` and other secrets
- **NEVER commit to git**
- Already in `.gitignore` ✓
- Use `.env.example` as template
- Create `.env` locally with your real values

#### If You Accidentally Committed Credentials

**IMMEDIATE ACTIONS:**

1. **Revoke Firebase Key**
   ```
   Go to Firebase Console → Project Settings → Service Accounts
   → Delete the exposed key
   → Generate new private key
   ```

2. **Remove from Git History** (if repo is still private)
   ```bash
   git rm --cached serviceAccountKey.json
   git reflog expire --expire=now --all
   git gc --aggressive --prune=now
   ```

3. **Force Push** (only if repository is private and not shared)
   ```bash
   git push origin main --force
   ```

4. **Note:** Once committed to a public repository, the credentials are compromised. Always revoke them immediately.

#### Environment Variable Requirements

**Production (`NODE_ENV=production`):**
- `SESSION_SECRET` is **MANDATORY** - Application will crash without it
- This is intentional for security

**Development (`NODE_ENV=development`):**
- `SESSION_SECRET` defaults to fallback (shows warning)
- Useful for local testing

### Contributing to This Project

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Commit message standards
- Testing requirements
- Security guidelines

---

## �💻 Development

### Code Structure Best Practices

1. **Routes**: Handle HTTP requests, validate input
2. **Controllers**: Implement business logic
3. **Models**: Interact with Firestore database
4. **Middleware**: Authentication, error handling
5. **Views**: EJS templates for rendering HTML

### Adding a New Admin Page

1. **Create route** in `routes/adminRoutes.js`:
```javascript
router.get('/mynewpage', requireAdmin, (req, res) => {
  // Fetch data
  // Render view
  res.render('admin/mynewpage', { data });
});
```

2. **Create view** in `views/admin/mynewpage.ejs`:
```ejs
<%- include('../layouts/adminLayout', { title: 'My New Page' }) %>
<h1>My New Page</h1>
```

3. **Add sidebar link** in `views/partials/_adminSidebar.ejs`

### Adding a New Product Field

1. **Update product form** in `views/admin/products/`:
   - Add input field in HTML
   - Add form validation

2. **Update controller** in `controllers/productController.js`:
   - Include new field in Firestore update

3. **Update display** in `views/partials/_productCard.ejs`:
   - Show new field on product card

### Database Queries

```javascript
// Get all products
const snapshot = await db.collection('products').get();
const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Get specific product
const product = await db.collection('products').doc(productId).get();
const data = product.data();

// Create new document
const docRef = await db.collection('discounts').add({
  name: 'Summer Sale',
  value: 20,
  // ... more fields
});

// Update document
await db.collection('products').doc(productId).update({
  price: 29.99,
  updatedAt: new Date()
});

// Delete document
await db.collection('products').doc(productId).delete();

// Query with conditions
const snapshot = await db.collection('products')
  .where('isActive', '==', true)
  .where('stock', '>', 0)
  .get();
```

---

## 🔒 Security Guide

### Essential Security Practices

#### 1. **Never Commit Sensitive Files**
These files are included in `.gitignore` and **must never** be committed:
- `serviceAccountKey.json` - Firebase Admin SDK credentials
- `.env` - Environment variables with secrets

```bash
# Verify .gitignore includes these
cat .gitignore | grep serviceAccountKey.json
cat .gitignore | grep .env
```

#### 2. **Secure Session Secret in Production**

The application now **requires** a `SESSION_SECRET` environment variable in production:

```env
# In production, this MUST be set to a strong, random value
SESSION_SECRET=your-secure-random-string-here

# Generate a secure key using:
# openssl rand -hex 32
```

**If SESSION_SECRET is not set in production, the application will crash and refuse to start** (this is intentional for security).

#### 3. **Environment Variables Setup**

Create a `.env` file locally (not committed to git):

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=<generate-secure-random-string>

# Optional Firebase configuration (if not using serviceAccountKey.json)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email
```

Never edit or commit `.env` with real values. Always use `.env.example` as a template.

#### 4. **Firebase Credentials Security**

**Safe Method:**
- Download `serviceAccountKey.json` from Firebase Console
- Keep it **only locally** in project root (gitignored)
- Never share or commit this file

**Alternative Method (for CI/CD):**
```env
FIREBASE_PROJECT_ID=your-id
FIREBASE_PRIVATE_KEY=your-key-here
FIREBASE_CLIENT_EMAIL=your-email@iam.gserviceaccount.com
```

#### 5. **HTTPS in Production**

Session cookies are automatically set to `secure: true` in production:

```javascript
cookie: {
  secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
  httpOnly: true,  // Prevents XSS access to session
  maxAge: 1000 * 60 * 60 * 24 // 24 hours
}
```

**Requirement**: Use HTTPS in production. Configure your hosting provider to enforce HTTPS-only traffic.

#### 6. **Password Security**

Passwords are hashed with bcrypt (10 salt rounds):
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

This is secure by default. **Never store plaintext passwords.**

#### 7. **Input Validation**

All user input should be validated before database operations:
```javascript
// Example validation
const email = req.body.email?.trim().toLowerCase();
const password = req.body.password;

if (!email || !email.includes('@')) {
  return res.status(400).send('Invalid email');
}

if (password.length < 8) {
  return res.status(400).send('Password too short');
}
```

#### 8. **Firestore Security Rules**

Configure strict security rules in Firestore Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Products readable by all, writable by admins only
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Admin-only collections
    match /discounts/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
    
    match /messages/{document=**} {
      allow create: if true;  // Anyone can submit contact messages
      allow read: if request.auth.token.admin == true;  // Admins only
    }
  }
}
```

#### 9. **Dependency Security**

Keep dependencies updated:
```bash
npm audit           # Check for vulnerabilities
npm audit fix       # Auto-fix known vulnerabilities
npm outdated        # List outdated packages
npm update          # Update to latest versions
```

#### 10. **Rate Limiting** (Recommended)

For production, consider adding rate limiting:
```bash
npm install express-rate-limit
```

### Security Checklist

- [ ] `serviceAccountKey.json` is **only local**, not in git
- [ ] `.env` contains all secrets, is in `.gitignore`
- [ ] `SESSION_SECRET` is set to a strong random value
- [ ] HTTPS is enforced in production
- [ ] Firestore Security Rules are properly configured
- [ ] All user input is validated before database operations
- [ ] Passwords are hashed with bcrypt
- [ ] Admin routes are protected with `requireAdmin` middleware
- [ ] No sensitive data logged to console
- [ ] Dependencies are audited and updated

---

## 🚀 Deployment Instructions

### Deployment Options

#### Option 1: Heroku (Recommended for Beginners)

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=$(openssl rand -hex 32)
   heroku config:set FIREBASE_PROJECT_ID=your-project-id
   # ... set other variables as needed
   ```

4. **Prepare Firebase Credentials**
   
   Option A: Upload service account key
   ```bash
   # Convert serviceAccountKey.json to environment variable
   cat serviceAccountKey.json | base64 | heroku config:set FIREBASE_CREDS_BASE64=-
   ```
   
   Then in `firebase.js`:
   ```javascript
   let serviceAccount;
   if (process.env.FIREBASE_CREDS_BASE64) {
     serviceAccount = JSON.parse(
       Buffer.from(process.env.FIREBASE_CREDS_BASE64, 'base64').toString()
     );
   } else {
     serviceAccount = require('./serviceAccountKey.json');
   }
   ```

5. **Deploy**
   ```bash
   git push heroku main  # or your branch name
   heroku logs -t        # Watch deployment logs
   heroku open           # Open deployed app
   ```

#### Option 2: Vercel (For Edge Computing)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure `vercel.json`**
   ```json
   {
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add NODE_ENV production
   vercel env add SESSION_SECRET
   # ... add other variables
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

#### Option 3: Railway (Modern Alternative)

1. **Connect Repository**
   - Go to https://railway.app
   - Sign in with GitHub
   - Create new project from repo

2. **Configure Environment**
   - Add environment variables in dashboard
   - Set `NODE_ENV=production`
   - Set `SESSION_SECRET=<generate-new-value>`

3. **Auto-Deploy**
   - Railway auto-deploys on git push

#### Option 4: Self-Hosted (DigitalOcean, AWS, etc.)

1. **Set Up Server**
   ```bash
   # SSH into your server
   ssh root@your-server-ip
   
   # Install Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   
   # Clone repository
   git clone https://github.com/yourusername/firebase-express-ecommerce.git
   cd firebase-express-ecommerce
   ```

2. **Install Dependencies**
   ```bash
   npm install --production
   ```

3. **Configure Environment**
   ```bash
   nano .env
   # Add all required variables for production
   ```

4. **Upload Firebase Credentials**
   ```bash
   # Securely copy serviceAccountKey.json to server
   scp serviceAccountKey.json root@your-server-ip:~/firebase-express-ecommerce/
   ```

5. **Start Application**
   ```bash
   # Using PM2 for process management
   npm install -g pm2
   pm2 start server.js --name "ecommerce-app"
   pm2 startup
   pm2 save
   ```

6. **Set Up Reverse Proxy (Nginx)**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

7. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] All routes tested and working
- [ ] Admin dashboard functional
- [ ] Products display correctly
- [ ] Discounts apply properly
- [ ] Contact form submits to database
- [ ] User authentication working
- [ ] Dark mode functioning
- [ ] Responsive design on mobile
- [ ] All environment variables documented
- [ ] NODE_ENV set to 'production'
- [ ] SESSION_SECRET is strong and random
- [ ] HTTPS configured
- [ ] Database backups configured
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Logging configured
- [ ] Never committed `.env` or `serviceAccountKey.json`

### Production Considerations

1. **Performance**
   - Enable caching headers
   - Optimize images and assets
   - Use CDN for static files
   - Enable gzip compression

2. **Monitoring**
   - Set up error tracking (Sentry, Rollbar)
   - Monitor application logs
   - Set up uptime monitoring
   - Track database usage and costs

3. **Backups**
   - Configure Firestore automated backups
   - Regular database snapshots
   - Document backup recovery process

4. **Scaling**
   - Monitor CPU and memory usage
   - Plan for database growth
   - Use read/write replicas if needed
   - Consider caching solutions (Redis)

5. **Security Maintenance**
   - Regularly update dependencies
   - Review Firestore security rules
   - Monitor Firebase logs
   - Keep OS and packages patched

---

## Contributing

We welcome contributions! Please see [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

---

### Security Considerations

1. **Never commit `serviceAccountKey.json`** (.gitignore already includes it)
2. **Change `SESSION_SECRET`** in production
3. **Implement Firestore Security Rules** to restrict unauthorized access
4. **Use HTTPS** in production
5. **Validate all user input** before database operations
6. **Hash passwords** with bcrypt (already implemented)
7. **Protect admin routes** with `requireAdmin` middleware (already implemented)

---

## � License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

You are free to use this project for commercial and non-commercial purposes.

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review server logs in console
3. Check browser console for client-side errors
4. Verify Firestore database rules and data
5. Ensure all environment variables are set correctly
6. See [Security Guide](#-security-guide) for security-related issues

---

## 🎉 Conclusion

This is a complete, production-ready e-commerce application with all essential features implemented:

✅ User authentication with role-based access  
✅ Dynamic content management system (8 pages)  
✅ Product catalog with images and discounts  
✅ Shopping cart with dark mode support  
✅ Complete admin dashboard (16 widgets)  
✅ Discount management system  
✅ Contact management  
✅ Responsive mobile design  
✅ Professional UI with animations  
✅ Firebase Firestore integration  
✅ Enterprise-grade security  

Ready to customize and deploy!
