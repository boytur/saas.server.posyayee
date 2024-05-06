const jwt = require('jsonwebtoken');

const getUserId = async (req) => {
    try {
        if (!req) { return; }
        const userTokenCookies = req.cookies.access_token;

        if (!userTokenCookies) {
            return;
        }

        const decoded = jwt.decode(userTokenCookies);
        const userId = decoded?.user?.user_id;
        return userId;
    } catch (error) {
        console.error('Error decoding JWT getUserStoreId:', error);
        throw error;
    }
}

const getUserStoreId = async (req) => {
    try {
        if (!req) { return; }
        const userTokenCookies = req.cookies.access_token;

        if (!userTokenCookies) {
            return;
        }

        const decoded = jwt.decode(userTokenCookies);
        const storeId = decoded?.user?.store?.store_id;
        return storeId;
    } catch (error) {
        console.error('Error decoding JWT getUserStoreId:', error);
        throw error;
    }
}

const getStoreRemaining = async (req) => {
    try {
        if (!req) { return; }
        const userTokenCookies = req.cookies.access_token;

        if (!userTokenCookies) {
            return;
        }

        const decoded = await jwt.decode(userTokenCookies);
        const storeRemaining = decoded?.user?.store?.store_remaining;
        return storeRemaining;
    } catch (error) {
        console.error('Error decoding JWT getStoreRemaining:', error);
        throw error;
    }
};

const getStorePackageId = async (req) => {
    try {
        if (!req) { return; }
        const userTokenCookies = req.cookies.access_token;

        if (!userTokenCookies) {
            return;
        }

        const decoded = await jwt.decode(userTokenCookies);
        const storePackageId = decoded?.user?.store?.package_id;
        return storePackageId;
    } catch (error) {
        console.error('Error decoding JWT getStorePackageId:', error);
        throw error;
    }
};

module.exports = { getUserStoreId, getStoreRemaining, getStorePackageId, getUserId }