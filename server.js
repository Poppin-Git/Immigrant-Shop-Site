const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminContentRoutes = require('./routes/adminContentRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// ============================================================================
// VIEW ENGINE SETUP
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// STATIC FILES
// ============================================================================
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// BODY PARSER MIDDLEWARE
// ============================================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================================
// SESSION MIDDLEWARE
// ============================================================================
// Ensure SESSION_SECRET is set (mandatory for security)
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL ERROR: SESSION_SECRET environment variable is required in production');
    process.exit(1);
  }
  console.warn('WARNING: SESSION_SECRET not set. Using development-only fallback. This is INSECURE in production!');
}

app.use(
  session({
    secret: SESSION_SECRET || 'dev-fallback-insecure-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// ============================================================================
// ROUTE MOUNTING
// ============================================================================
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/content', adminContentRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/api', apiRoutes);

// ============================================================================
// 404 HANDLER
// ============================================================================
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    status: 404,
    message: 'The page you are looking for does not exist.'
  });
});

// ============================================================================
// ERROR HANDLER (must be last)
// ============================================================================
app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
