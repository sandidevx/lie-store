/**
 * Main App Logic for Index Page
 */

function app() {
    return {
        products: [],
        config: {},
        loading: true,
        error: null,

        async init() {
            try {
                // Load config and products in parallel
                const [configData, productsData] = await Promise.all([
                    API.getConfig(),
                    API.getProducts()
                ]);

                this.config = configData;
                this.products = productsData;
                
                // Set dynamic favicon
                if (this.config.logo_url) {
                    const favicon = document.getElementById('favicon');
                    if (favicon) {
                        favicon.href = this.config.logo_url;
                    }
                }
                
                // Update page title
                if (this.config.store_name) {
                    document.title = this.config.store_name + (this.config.store_slogan ? ' - ' + this.config.store_slogan : '');
                }
            } catch (err) {
                this.error = 'Gagal memuat data: ' + err.message;
            } finally {
                this.loading = false;
            }
        },

        formatPrice(price) {
            return 'Rp ' + parseInt(price).toLocaleString('id-ID');
        },

        goToDetail(productId) {
            window.location.href = `detail.html?id=${productId}`;
        }
    }
}
