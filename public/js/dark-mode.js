/**
 * Dark Mode Toggle System
 * Persistent dark mode with localStorage and CSS variables
 */

class DarkModeManager {
    constructor() {
        this.isDarkMode = false;
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light
        this.loadTheme();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial theme
        this.applyTheme();
        
        // Sync mobile toggle with desktop toggle
        this.syncToggles();
    }

    /**
     * Load theme preference from localStorage
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
        } else {
            // Check system preference as fallback
            this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    /**
     * Save theme preference to localStorage
     */
    saveTheme() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const root = document.documentElement;
        
        if (this.isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            this.updateThemeIndicators(true);
        } else {
            root.removeAttribute('data-theme');
            this.updateThemeIndicators(false);
        }
        
        // Save to localStorage
        this.saveTheme();
    }

    /**
     * Update theme toggle buttons and icons
     */
    updateThemeIndicators(isDark) {
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        const mobileToggle = document.getElementById('mobile-theme-toggle');
        
        if (icon && text) {
            if (isDark) {
                icon.textContent = '☀️';
                text.textContent = 'Light';
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.textContent = '🌙';
                text.textContent = 'Dark';
                icon.style.transform = 'rotate(0deg)';
            }
        }
        
        if (mobileToggle) {
            mobileToggle.checked = isDark;
        }
    }

    /**
     * Toggle between light and dark mode
     */
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
    }

    /**
     * Sync mobile and desktop toggles
     */
    syncToggles() {
        const desktopToggle = document.getElementById('theme-toggle');
        const mobileToggle = document.getElementById('mobile-theme-toggle');
        
        if (desktopToggle) {
            desktopToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        if (mobileToggle) {
            mobileToggle.addEventListener('change', () => {
                this.isDarkMode = mobileToggle.checked;
                this.applyTheme();
            });
        }
    }

    /**
     * Set up event listeners for system theme changes
     */
    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Handle system theme changes
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't explicitly set a preference
                const savedTheme = localStorage.getItem('theme');
                if (!savedTheme) {
                    this.isDarkMode = e.matches;
                    this.applyTheme();
                }
            });
        }

        // Listen for keyboard shortcuts (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkModeManager();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}