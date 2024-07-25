
const { getUserStoreId } = require("../../libs/getUserData");
const { validateInteger } = require("../../libs/validate");
const Categories = require("../../models/Categories");
const Product = require("../../models/Product");
const ProductUnit = require("../../models/ProductUnit");
const uploadToCloundflare = require("../../libs/uploadToCloundflare");

/* 
* EditProduct
* Function for editing a product.
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @returns {Object} - The response object.
* Author : {TNP}
* Created date: 25-07-2567
*/

const EditProduct = async (req, res) => {
  try {
    const {
      prod_id,
      prod_barcode,
      prod_name,
      prod_cost,
      prod_sale,
      prod_quantity,
      cat_id,
      unit_id,
    } = req.body;
    const storeId = await getUserStoreId(req);

    if (prod_barcode && prod_barcode?.length !== 13) {
      return res.status(400).json({
        success: false,
        message: "บาร์โค้ดต้องมี 13 หลักค่ะ!",
      });
    }
    if (prod_barcode?.trim() !== "") {
      const existingProduct = await Product.findAll({
        where: {
          store_id: storeId,
          prod_barcode: prod_barcode,
        },
      });

      if (
        existingProduct?.length > 0 &&
        existingProduct[0].prod_id !== prod_id
      ) {
        return res.status(400).json({
          success: false,
          message: "สินค้าบาร์โค้ดนี้มีอยู่แล้วค่ะ!",
        });
      }
    }

    if (cat_id && !validateInteger(cat_id)) {
      return res.status(400).json({
        success: false,
        message: "ไม่มีประเภทสินค้านี้ในระบบ!",
      });
    }

    if (cat_id) {
      const existingCategories = await Categories.findAll({
        where: {
          cat_id: parseInt(cat_id),
          store_id: storeId,
        },
      });

      if (existingCategories?.length <= 0) {
        return res.status(400).json({
          success: false,
          message: "ไม่มีประเภทสินค้านี้ในระบบ!",
        });
      }
    }
    if (unit_id && !validateInteger(unit_id)) {
      return res.status(400).json({
        success: false,
        message: "ไม่มีหน่วยเรียกสินค้านี้ในระบบ!",
      });
    }

    if (unit_id) {
      const existingUnit = await ProductUnit.findAll({
        where: {
          unit_id: parseInt(unit_id),
          store_id: storeId,
        },
      });

      if (existingUnit?.length <= 0) {
        return res.status(400).json({
          success: false,
          message: "ไม่มีหน่วยเรียกสินค้านี้ในระบบ!",
        });
      }
    }

    if (!prod_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบไอดีสินค้า!",
      });
    }

    const existingProduct = await Product.findAll({
      where: {
        prod_id: parseInt(prod_id),
        store_id: storeId,
      },
    });

    if (existingProduct?.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "ไม่มีสินค้านี้ในระบบ!",
      });
    }

    let filename;
    if (!req.file) {
    } else {
      filename = `${
        process.env.URL
      }prod${storeId}${prod_id}${Date.now().toString()}`;
    }

    let query = {
      prod_name: prod_name,
      prod_barcode: prod_barcode,
      prod_cost: prod_cost,
      prod_sale: prod_sale,
      prod_quantity: prod_quantity,
      cat_id: cat_id,
      unit_id: unit_id,
      prod_image: filename,
    };

    const updateProduct = await Product.update(query, {
      where: {
        prod_id: parseInt(prod_id),
        store_id: storeId,
      },
    });

    if (!req.file) {
      query = {
        prod_name: prod_name,
        prod_barcode: prod_barcode,
        prod_cost: prod_cost,
        prod_sale: prod_sale,
        prod_quantity: prod_quantity,
        cat_id: cat_id,
        unit_id: unit_id,
      };
    }

    if (req.file) {
      await uploadToCloundflare(req.file.buffer, filename);
    } else {
      console.log("===== This product not has image =====");
    }

    console.log("hello world", prod_name, prod_cost, prod_sale, prod_quantity);

    return res.status(200).json({
      message: "Hello Mao",
      updateProduct,
      existingProduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = EditProduct;
