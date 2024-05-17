const { cache } = require("../connections/redis");
const Categories = require("../models/Categories");

const CategoriesCacheClear = async (storeId) => {
    try {
        if (!storeId) {
            throw new Error('Categories Cache storeId is required to clear categories');
        }

        // Fetch active categories for the given store
        const categories = await Categories.findAll({
            where: {
                store_id: storeId,
            },
            attributes: ['cat_id', 'cat_name']
        });

        // Clear the old cache data for the specified store
        await cache.del(`categories_${storeId}`);

        // Save the new category data to cache with a 1-day expiration
        const saveCatToCache = await cache.setEx(`categories_${storeId}`, 86400, JSON.stringify(categories));

        if (saveCatToCache === 'OK') {
            console.log(`=== Categories data for store ${storeId} cached successfully with a 1 day expiration. ===`);
        } else {
            console.log(`=== Failed to cache categories data for store ${storeId}. ===`);
        }
    }
    catch (err) {
        console.error(`Error clearing categories cache for store ${storeId}:`, err);
    }
}
module.exports = { CategoriesCacheClear };