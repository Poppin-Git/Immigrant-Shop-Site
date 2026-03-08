# Firebase Database Scripts

This directory contains utility scripts for managing your Firestore database.

## Scripts

### 1. updateFirebaseData.js
Update a single field in a Firestore document.

**Usage:**
```bash
node scripts/updateFirebaseData.js [collection] [document] [field] [value]
```

**Examples:**
```bash
# Update site title
node scripts/updateFirebaseData.js settings system siteTitle "My New App Title"

# Update site email
node scripts/updateFirebaseData.js settings system siteEmail "newemail@example.com"

# Set a boolean value
node scripts/updateFirebaseData.js settings system maintenanceMode true

# Set a numeric value
node scripts/updateFirebaseData.js settings system itemsPerPage 20

# Update nested fields (JSON)
node scripts/updateFirebaseData.js contact business address '{"street":"123 Main St","city":"NYC"}'
```

### 2. initializeFirebase.js
Initialize the Firestore database with default data for all pages and settings.

**Usage:**
```bash
node scripts/initializeFirebase.js
```

**What it creates:**
- `settings/system` - System configuration (site title, email, etc.)
- `siteContent/homepage` - Homepage content
- `siteContent/contact` - Contact page content
- `siteContent/about` - About page content
- `siteContent/services` - Services page content
- `siteContent/faq` - FAQ page content
- `siteContent/gallery` - Gallery page content
- `siteContent/testimonials` - Testimonials page content
- `siteContent/team` - Team page content
- `siteContent/settingsPage` - Company settings page content

## Quick Reference

### Update Homepage Title
```bash
node scripts/updateFirebaseData.js siteContent homepage title "Welcome!"
```

### Update Contact Email
```bash
node scripts/updateFirebaseData.js siteContent contact email "contact@example.com"
```

### Reset All Defaults
```bash
node scripts/initializeFirebase.js
```

## Troubleshooting

If you get "Cannot find module '../firebase'":
- Make sure you're running scripts from the project root directory
- Ensure your Firebase configuration file exists at `/config/firebase.js`

If Firebase connection times out:
- Check your internet connection
- Verify Firebase credentials in `.env` file
- Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set
