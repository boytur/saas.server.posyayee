const express = require('express');
const { getUser, getUserDetail } = require('./User');
const { getOder, getOderDetail } = require('./Order');
const { getStore, getStoreDetail } = require('./Store');
const { can_view_admin_analytics } = require('../../../middlewares/permission');
const Analytic = require('./Analytic');
const admin_analytics = express.Router();


admin_analytics.get('/admin/analytic/analytics', can_view_admin_analytics, Analytic);
admin_analytics.get('/admin/analytic/users', can_view_admin_analytics, getUser);
admin_analytics.get('/admin/analytic/orders', can_view_admin_analytics, getOder);
admin_analytics.get('/admin/analytic/stores', can_view_admin_analytics, getStore);

admin_analytics.get('/admin/analytic/user/:user_id', can_view_admin_analytics, getUserDetail);
admin_analytics.get('/admin/analytic/order/:order_id', can_view_admin_analytics, getOderDetail);
admin_analytics.get('/admin/analytic/store/:store_id', can_view_admin_analytics, getStoreDetail);

module.exports = admin_analytics;