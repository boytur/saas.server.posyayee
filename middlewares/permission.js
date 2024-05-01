
const authen = require('./authen');
const Permission = require('../libs/Permission');

const can_get_order_session_id = function (req, res, next) {
    authen.isLogedin(req, res);
    const permission = new Permission(req);
    if (permission.canGetOrderSessionId()) {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการขอเซสชันไอดี!' });
    }
}

const can_log_out = function (req, res, next) {
    authen.isLogedin(req, res);
    const permission = new Permission(req);
    if (permission.canLogout()) {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการล็อกเอ้าท์' });
    }
}

const can_view_stock = function (req, res, next) {
    authen.isLogedin(req, res);
    const permission = new Permission(req);
    if (permission.canViewStock()) {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการดูสต็อกสินค้า' });
    }
};

const can_sell_products = function (req, res, next) {
    authen.isLogedin(req, res);
    const permission = new Permission(req);
    if (permission.canSellProducts()) {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการขายสินค้า' });
    }
};


const can_manage_employees = function (req, res, next) {
    authen.isLogedin(req, res);
    const permission = new Permission(req);
    if (permission.canManageEmployees()) {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'แกไม่มีสิทธิ์! ในการจัดการพนักงาน' });
    }
};

module.exports = {
    can_get_order_session_id,
    can_log_out,
    can_view_stock,
    can_sell_products,
    can_manage_employees
};
