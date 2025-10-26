/**
 * API Client for Google Apps Script Backend - JSONP VERSION
 * 
 * SOLUSI CORS: Google Apps Script tidak support CORS untuk fetch()
 * Kita menggunakan JSONP sebagai workaround (sesuai dokumentasi Google)
 * 
 * IMPORTANT: Replace API_BASE_URL with your deployed Google Apps Script URL
 * Format: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwuhGDtxJI4oBaRkRvHEG7Y6f6Vc1Jv1It61FQF7XGLV1veAMKllw4nVOk3ISjQnAR2/exec';

/**
 * JSONP Helper Function
 * Membuat request JSONP ke Google Apps Script
 */
function jsonpRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
        // Generate unique callback name
        const callbackName = 'jsonp_cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        
        // Cleanup function
        const cleanup = () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete window[callbackName];
        };
        
        // Set up callback
        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };
        
        // Handle errors
        script.onerror = () => {
            cleanup();
            reject(new Error('JSONP request failed'));
        };
        
        // Build URL with parameters
        const queryParams = new URLSearchParams(params);
        queryParams.append('callback', callbackName);
        
        script.src = `${url}?${queryParams.toString()}`;
        
        // Set timeout (30 seconds)
        setTimeout(() => {
            cleanup();
            reject(new Error('JSONP request timeout'));
        }, 30000);
        
        // Append script to DOM
        document.head.appendChild(script);
    });
}

/**
 * API Methods
 */
const API = {
    /**
     * Get all active products
     * @returns {Promise<Array>}
     */
    async getProducts() {
        try {
            const data = await jsonpRequest(API_BASE_URL, {
                action: 'getProducts'
            });
            return data.products || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Get product by ID
     * @param {string|number} id - Product ID
     * @returns {Promise<Object>}
     */
    async getProduct(id) {
        try {
            const data = await jsonpRequest(API_BASE_URL, {
                action: 'getProduct',
                id: id
            });
            return data.product || null;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Get store configuration
     * @returns {Promise<Object>}
     */
    async getConfig() {
        try {
            const data = await jsonpRequest(API_BASE_URL, {
                action: 'getConfig'
            });
            return data.config || {};
        } catch (error) {
            console.error('Error fetching config:', error);
            throw error;
        }
    },

    /**
     * Create new order
     * @param {Object} orderData - Order data (customer_name, customer_email, product_id)
     * @returns {Promise<Object>}
     */
    async createOrder(orderData) {
        try {
            const data = await jsonpRequest(API_BASE_URL, {
                action: 'createOrder',
                customer_name: orderData.customer_name,
                customer_email: orderData.customer_email,
                product_id: orderData.product_id
            });
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.order;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
};
