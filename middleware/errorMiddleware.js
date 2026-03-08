const db = require('../firebase');

// Centralized error handler middleware
const errorHandler = async (err, req, res, next) => {
  console.error('Error:', err);

  // Log error to Firestore (optional)
  try {
    await db.collection('logs').add({
      type: 'ERROR',
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      userId: req.session?.userId || null,
      createdAt: new Date()
    });
  } catch (logError) {
    console.error('Failed to log error to Firestore:', logError);
  }

  // Determine status code
  const status = err.status || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Return error response
  if (req.path.startsWith('/api/')) {
    // API route - return JSON
    return res.status(status).json({
      error: isDevelopment ? err.message : 'Internal Server Error',
      ...(isDevelopment && { stack: err.stack })
    });
  } else {
    // Regular route - render error page
    return res.status(status).render('error', {
      title: `Error ${status}`,
      status: status,
      message: isDevelopment ? err.message : 'An error occurred. Please try again later.'
    });
  }
};

module.exports = {
  errorHandler
};
