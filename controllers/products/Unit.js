const { getUserStoreId } = require("../../libs/getUserData");
const { validateString } = require("../../libs/validate");
const ProductUnit = require("../../models/ProductUnit");


const AddUnit = async (req, res) => {
    try {
        const { unit_name } = req.body;

        if (!validateString(unit_name) || !unit_name) {
            return res.status(400).json({
                success: false,
                message: 'Invalid unit name'
            })
        }

        const storeId = await getUserStoreId(req);

        const existingUnit = await ProductUnit.findAll({
            where: {
                unit_name: unit_name.trim(),
                store_id: storeId
            }
        });

        if (existingUnit?.length > 0) {
            return res.status(400).json({
                success: true,
                message: "มีหน่วยเรียกนี้ในระบบอยู่แล้วค่ะ"
            })
        }

        const newUnit = await ProductUnit.create({
            'unit_name': unit_name,
            'store_id': storeId
        });

        return res.status(201).json({
            success: true,
            message: "สร้างหน่วยเรียกใหม่เรียบร้อยค่ะ",
            unit: newUnit,
        });
    }

    catch (e) {
        console.error('Err while adding unit: ', e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

const GetUnit = async (req, res) => {
    try {

        const storeId = await getUserStoreId(req);
        const units = await ProductUnit.findAll({
            where: {
                store_id: storeId
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Get unit successfully',
            units: units
        });
    }
    catch (e) {
        console.error('Err while getting unit: ', e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


module.exports = { AddUnit, GetUnit }