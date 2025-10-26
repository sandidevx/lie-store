/**
 * Shared utilities for all pages
 */

const SharedUtils = {
    /**
     * Set dynamic favicon from logo URL
     * @param {string} logoUrl - URL of the logo image
     */
    setFavicon(logoUrl) {
        if (!logoUrl) return;
        
        const favicon = document.getElementById('favicon');
        if (favicon) {
            favicon.href = logoUrl;
        }
    },

    /**
     * Set dynamic page title
     * @param {string} storeName - Store name
     * @param {string} pageTitle - Page specific title
     * @param {string} slogan - Store slogan (optional)
     */
    setPageTitle(storeName, pageTitle = '', slogan = '') {
        if (storeName) {
            if (pageTitle) {
                document.title = `${pageTitle} - ${storeName}`;
            } else {
                document.title = storeName + (slogan ? ' - ' + slogan : '');
            }
        }
    },

    /**
     * Format price to Indonesian Rupiah
     * @param {number} price - Price value
     * @returns {string} Formatted price
     */
    formatPrice(price) {
        return 'Rp ' + parseInt(price).toLocaleString('id-ID');
    },

    /**
     * Initialize shared utilities (favicon + title)
     * @param {Object} config - Configuration object
     * @param {string} pageTitle - Page specific title (optional)
     */
    async initShared(config, pageTitle = '') {
        // Set favicon
        if (config.logo_url) {
            this.setFavicon(config.logo_url);
        }

        // Set page title
        this.setPageTitle(config.store_name, pageTitle, config.store_slogan);
    }
};
