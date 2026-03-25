/**
 * Main client-side JavaScript
 * 
 * This file contains utility functions and event handlers for client-side interactions.
 * Note: This is a server-rendered app with minimal client-side JS.
 * Most functionality is handled server-side via Express and Firebase Admin SDK.
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch current user data from API
 */
async function getCurrentUser() {
  try {
    const response = await fetch('/api/user/me');
    if (response.ok) {
      const user = await response.json();
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Fetch application statistics (admin only)
 */
async function getStats() {
  try {
    const response = await fetch('/api/admin/stats');
    if (response.ok) {
      const stats = await response.json();
      return stats;
    }
    return null;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

/**
 * Fetch logs (admin only)
 */
async function getLogs(limit = 50, type = null) {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (type) {
      params.append('type', type);
    }

    const response = await fetch(`/api/admin/logs?${params.toString()}`);
    if (response.ok) {
      const logs = await response.json();
      return logs;
    }
    return [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

/**
 * Show confirmation dialog
 */
function showConfirm(message) {
  return confirm(message);
}

/**
 * Show alert dialog
 */
function showAlert(message, type = 'info') {
  const alertClass = `${type}-message`;
  alert(message);
}

// ============================================================================
// MOBILE SIDEBAR FUNCTIONALITY
// ============================================================================

/**
 * Initialize mobile sidebar functionality
 */
function initMobileSidebar() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const closeSidebar = document.getElementById('close-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileSidebar = document.getElementById('mobile-sidebar');

  if (!menuToggle || !closeSidebar || !sidebarOverlay || !mobileSidebar) {
    return;
  }

  // Open sidebar
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    mobileSidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });

  // Close sidebar with close button
  closeSidebar.addEventListener('click', function(e) {
    e.preventDefault();
    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable background scrolling
  });

  // Close sidebar with overlay click
  sidebarOverlay.addEventListener('click', function() {
    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable background scrolling
  });

  // Close sidebar when clicking on menu items (for better UX on mobile)
  const menuItems = mobileSidebar.querySelectorAll('.sidebar-menu a');
  menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
      mobileSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable background scrolling
    });
  });

  // Close sidebar when window is resized to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      mobileSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable background scrolling
    }
  });
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Initialize event listeners when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  initMobileSidebar();
  
  // Add any other global event listeners here if needed
});

// ============================================================================
// EXPORTS (for testing or external use)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentUser,
    getStats,
    getLogs,
    showConfirm,
    showAlert
  };
}
