/**
 * API Client for Google Apps Script Backend - JSONP VERSION
 * SOLUSI CORS: Menggunakan JSONP karena Google Apps Script tidak support CORS
 * 
 * IMPORTANT: Replace API_BASE_URL with your deployed Google Apps Script URL
 * Format: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwuhGDtxJI4oBaRkRvHEG7Y6f6Vc1Jv1It61FQF7XGLV1veAMKllw4nVOk3ISjQnAR2/exec';

/**
 * JSONP Request Helper - Bypass CORS
 */
function jsonpRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
        const script = document.createElement('script');
        
        const cleanup = () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete window[callbackName];
        };
        
        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };
        
        script.onerror = () => {
            cleanup();
            reject(new Error('JSONP request failed'));
        };
        
        const queryParams = new URLSearchParams(params);
        queryParams.append('callback', callbackName);
        script.src = `${url}?${queryParams.toString()}`;
        
        setTimeout(() => {
            cleanup();
            reject(new Error('Request timeout'));
        }, 30000);
        
        document.head.appendChild(script);
    });
}

const API = {
    /**
     * Get all active products
     * @returns {Promise<Array>}
     */
    async getProducts() {
        try {
            const data = await jsonpRequest(API_BASE_URL, { action: 'getProducts' });
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
            const data = await jsonpRequest(API_BASE_URL, { action: 'getProduct', id: id });
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
            const data = await jsonpRequest(API_BASE_URL, { action: 'getConfig' });
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
