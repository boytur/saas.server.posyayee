
const { getUserStoreId } = require("../../libs/getUserData");
const uploadToCloundflare = require("../../libs/uploadToCloundflare");
const Store = require("../../models/Store");

/**
 * Edit store profile.
 * This function is responsible for editing the profile of a store.
 * It takes the request object and response object as parameters.
 * It returns the response object.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 * @author {PSBLaLaHey}
 */
const EditStoreProfile = async (req, res) => {
    try {

        const { store_name, store_address, store_taxid } = req.body;
        const storeId = await getUserStoreId(req);
        let fileName;

        if (!req.file) {
            // using old file
        } else {
            fileName = `${process.env.URL}/store${storeId}${Date.now().toString()}`;
        }

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "Store name is required",
            });
        }

        let query = {
            store_name: store_name,
            store_address: store_address,
            store_taxid: store_taxid,
            store_image: fileName,
        };

        if (!req.file) {
            query = {
                store_name: store_name,
                store_address: store_address,
                store_taxid: store_taxid,
            };
        }

        const updateStore = await Store.update(query, {
            where: {
                store_id: storeId,
            },
        });

        // upload product image
        if (req.file) {
            await uploadToCloundflare(req.file.buffer, fileName);
        } else {
            console.log("===== This store not has image =====");
        }

        return res.status(200).json({
            success: true,
            message: "Edit store profile successfully",
        });
        
    } catch (error) {
        console.error("Error editing store profile: ", error);
        return res.status(500).json({
            message: "Error editing store profile",
        });
    }
};

module.exports = EditStoreProfile;
