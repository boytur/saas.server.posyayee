const express = require('express');
const EditStoreProfile = require('./EditStoreProfile');
const { can_edit_store, can_manage_employees } = require('../../middlewares/permission');
const storesRoute = express.Router();
const multer = require('multer');
const AddEmployee = require('./AddEmployee');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        try {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                throw new Error('ไม่อุนุญาติให้อัพโหลดไฟล์ชนิดอื่นนอกจากภาพ!');
            }
            callback(null, true);
        } catch (error) {
            callback(error);
        }
    }
});
storesRoute.put('/api/stores/edit-store-profile', can_edit_store,upload.single('store_image'),(req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            success: false,
            message: req.fileValidationError
        });
    }
    EditStoreProfile(req, res, next);
});
storesRoute.post('/api/stores/add-employee',can_manage_employees,AddEmployee);

module.exports = storesRoute;