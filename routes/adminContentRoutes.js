const express = require('express');
const { requireAdmin } = require('../middleware/authMiddleware');
const {
  showHomepageEditor,
  updateHomepage,
  showAboutEditor,
  updateAbout,
  showContactEditor,
  updateContact,
  showProductsEditor,
  updateProducts,
  showFAQEditor,
  updateFAQ,
  showServicesEditor,
  updateServices,
  showGalleryEditor,
  updateGallery,
  showTestimonialsEditor,
  updateTestimonials,
  showTeamEditor,
  updateTeam,
  showSettingsEditor,
  updateSettings
} = require('../controllers/contentController');

const router = express.Router();

// All routes require admin
router.use(requireAdmin);

// GET /admin/content/home
router.get('/home', showHomepageEditor);

// POST /admin/content/home
router.post('/home', updateHomepage);

// GET /admin/content/about
router.get('/about', showAboutEditor);

// POST /admin/content/about
router.post('/about', updateAbout);

// GET /admin/content/contact
router.get('/contact', showContactEditor);

// POST /admin/content/contact
router.post('/contact', updateContact);

// GET /admin/content/products
router.get('/products', showProductsEditor);

// POST /admin/content/products
router.post('/products', updateProducts);

// GET /admin/content/faq
router.get('/faq', showFAQEditor);

// POST /admin/content/faq
router.post('/faq', updateFAQ);

// GET /admin/content/services
router.get('/services', showServicesEditor);

// POST /admin/content/services
router.post('/services', updateServices);

// GET /admin/content/gallery
router.get('/gallery', showGalleryEditor);

// POST /admin/content/gallery
router.post('/gallery', updateGallery);

// GET /admin/content/testimonials
router.get('/testimonials', showTestimonialsEditor);

// POST /admin/content/testimonials
router.post('/testimonials', updateTestimonials);

// GET /admin/content/team
router.get('/team', showTeamEditor);

// POST /admin/content/team
router.post('/team', updateTeam);

// GET /admin/content/settings
router.get('/settings', showSettingsEditor);

// POST /admin/content/settings
router.post('/settings', updateSettings);

module.exports = router;