/**
 * API Client for Google Apps Script Backend
 * 
 * IMPORTANT: Replace API_BASE_URL with your deployed Google Apps Script URL
 * Format: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwuhGDtxJI4oBaRkRvHEG7Y6f6Vc1Jv1It61FQF7XGLV1veAMKllw4nVOk3ISjQnAR2/exec';

const API = {
    /**
     * Get all active products
     * @returns {Promise<Array>}
     */
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}?action=getProducts`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
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
            const response = await fetch(`${API_BASE_URL}?action=getProduct&id=${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
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
            const response = await fetch(`${API_BASE_URL}?action=getConfig`);
            if (!response.ok) {
                throw new Error('Failed to fetch config');
            }
            const data = await response.json();
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
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'createOrder',
                    data: orderData
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            
            const data = await response.json();
            
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
