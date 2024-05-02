const { getStoreRemaining } = require("../libs/getUserData");

const alertStoreRemaining = async (req, res) => {
    try {
        
        const storeRemaining = await getStoreRemaining(req);
        if (parseInt(storeRemaining) <= 0) {
            return res.status(403).json({
                success: false,
                message: "วันใช้งานหมดแล้วค่ะ \n กรุณาชำระค่าใช้งาน"
            });
        }

    } catch (err) {
        console.log("Err while alert Store Remaining", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

module.exports = alertStoreRemaining;
