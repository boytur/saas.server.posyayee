const { getUserStoreId, getStorePackageId } = require("../../libs/getUserData");
const uploadToB2 = require("../../libs/uploadB2");
const uploadToCloundflare = require("../../libs/uploadToCloundflare");
const alertStoreRemaining = require("../../middlewares/alertStoreRemaining");
const Package = require("../../models/Package");
const Product = require("../../models/Product");
const Store = require("../../models/Store");
const User = require("../../models/User");

const AddProduct = async (req, res) => {

    try {
        const {
            auto_generate_barcode,
            prod_barcode,
            prod_name,
            prod_description,
            prod_cost,
            prod_sale,
            prod_quantity,
            prod_image
        } = req.body;

        if (!prod_name || !prod_quantity || !prod_cost || !prod_sale) {
            return res.status(400).json({
                success: false,
                message: "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน!"
            });
        }

        if (prod_barcode && prod_barcode?.length !== 13) {
            return res.status(400).json({
                success: false,
                message: "บาร์โค้ดต้องมี 13 หลักค่ะ!"
            });
        }

        const storeId = await getUserStoreId(req);
        let fileName = `prod${storeId}${Date.now().toString()}`;
        const packageId = await getStorePackageId(req);

        if (!req.file) {
            fileName = "placeholder.png"
        }

        const storePackage = await Package.findOne({
            where: {
                package_id: packageId
            }
        });

        const prodCount = await Product.count({
            where: {
                store_id: storeId
            }
        });

        if (storePackage && prodCount >= storePackage.package_prod_limit) {
            return res.status(403).json({
                success: false,
                message: "คุณได้เพิ่มจำนวนสินค้าตามขีดจำกัดของแพ็คเกจแล้ว"
            });
        }

        if (prod_barcode?.trim() !== "") {
            const existingProduct = await Product.findAll({
                where: {
                    store_id: storeId,
                    prod_barcode: prod_barcode,
                }
            });

            if (existingProduct?.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "สินค้าบาร์โค้ดนี้มีอยู่แล้วค่ะ!"
                });
            }
        }

        let barcode;
        if ((auto_generate_barcode === "true" || auto_generate_barcode === true) && prod_barcode?.trim() === "") {
            barcode = Date.now().toString().substring(0, 13);
        } else {
            barcode = prod_barcode;
        }

        const newProduct = await Product.create({
            'prod_barcode': barcode,
            'prod_name': prod_name,
            'prod_description': prod_description,
            'prod_cost': prod_cost,
            'prod_sale': prod_sale,
            'prod_quantity': prod_quantity,
            'prod_image': `${process.env.URL}${fileName}`,
            'store_id': parseInt(storeId)
        });

        // upload product image
        if (req.file) {
            await uploadToCloundflare(req.file.buffer, fileName);
        }
        else {
            console.log("===== This product not has image =====");
        }

        return res.status(201).json({
            success: true,
            message: `${prod_name} ถูกเพิ่มแล้วค่ะ!`,
            product: newProduct
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

module.exports = AddProduct;