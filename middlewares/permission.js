
const authen = require('./authen');
const Permission = require('../libs/Permission');


const can_get_order_session_id = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canGetOrderSessionId()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการขอเซสชันไอดี!' });
        }
    });
}

const can_log_out = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canLogout()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการล็อกเอ้าท์' });
        }
    });
}

const can_view_admin_analytics = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canViewAdminAnalytic()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดู analytics' });
        }
    });
}

const can_view_product = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canViewProduct()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดูสต็อกสินค้า' });
        }
    });
};

const can_add_unit = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canViewProduct()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการเพิ่มหน่วยสินค้า!' });
        }
    });
};

const can_add_categories = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canViewAddCategories) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการเพิ่มประเภทสินค้า!' });
        }
    });
};

const can_create_promotion = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canCreatePromotion()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการสร้างโปรโมชั่น' });
        }
    })
}

const can_get_bill = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canGetBill()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดูบิล' });
        }
    })
}

const can_get_store_user = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canGetStoreUser()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดูบิล' });
        }
    })
}

const can_sell_products = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canSellProducts()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการขายสินค้า' });
        }
    })
};

const can_view_dashboard = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canViewDashboard()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดูแดชบอร์ด' });
        }
    })
};

const can_manage_employees = function (req, res, next) {
    authen.isLogedin(req, res,() => {
        const permission = new Permission(req);
        if (permission.canManageEmployees()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการจัดการพนักงาน' });
        }
    });
};

const can_edit_store = function (req, res, next) {
    authen.isLogedin(req, res, () => {
        const permission = new Permission(req);
        if (permission.canEditStore()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการแก้ไขร้านค้า!' });
        }
    });
};

module.exports = {
    can_get_order_session_id,
    can_log_out,
    can_view_admin_analytics,
    can_add_categories,
    can_view_product,
    can_add_unit,
    can_create_promotion,
    can_sell_products,
    can_get_bill,
    can_get_store_user,
    can_view_dashboard,
    can_manage_employees,
    can_edit_store,
};
