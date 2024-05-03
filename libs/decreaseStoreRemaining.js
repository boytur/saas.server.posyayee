const Store = require('../models/Store');
const { Op } = require('sequelize');

const decreaseStoreRemaining = async () => {
    try {
        const stores = await Store.findAll({
            where: {
                store_remaining: {
                    [Op.gt]: 0 // Use Sequelize operators if you're using Sequelize
                }
            }
        });

        console.log('==================================');
        console.log('==== DECREASE STORE REMAINING ====');
        console.log('==================================');

        for (const store of stores) {
            await store.update({ store_remaining: store.store_remaining - 1 });
        }

    } catch (err) {
        console.error('Error while decreasing Store Remaining: ', err);
    }
}

module.exports = decreaseStoreRemaining;
