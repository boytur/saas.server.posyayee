const { cache } = require("../connections/redis");
const Categories = require("../models/Categories");
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");

const ProductCacheClear = async (storeId) => {
    try {
        if (!storeId) {
            throw new Error('Product Cache storeId is required to clear products');
        }

        // Fetch active products for the given store along with their categories and promotions
        const products = await Product.findAndCountAll({
            where: {
                store_id: storeId,
                prod_status: 'active'
            },
            include: [
                { model: Categories, attributes: ['cat_id', 'cat_name'] },
                { model: Promotion, attributes: ['promo_id', 'promo_name', 'promo_prod_amount', 'promo_prod_price', 'start_date', 'end_date'] },
            ],
            attributes: ['prod_id', 'prod_barcode', 'prod_name', 'prod_sale', 'prod_cost', 'prod_image', 'prod_quantity']
        });

        // Clear the old cache data for the specified store
        await cache.del(`products_${storeId}`);

        // Save the new product data to cache with a 30-second expiration
        const saveProdToCache = await cache.setEx(`products_${storeId}`, 86400, JSON.stringify(products));

        if (saveProdToCache === 'OK') {
            console.log(`=== Product data for store ${storeId} cached successfully with a 1 day expiration. ===`);
        } else {
            console.log(`=== Failed to cache product data for store ${storeId}. ===`);
        }
    } catch (err) {
        console.error(`Error clearing product cache for store ${storeId}:`, err);
    }
}

module.exports = { ProductCacheClear };
