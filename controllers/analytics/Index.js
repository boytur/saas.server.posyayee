const express = require('express');
const { GetBill, GetBillInfo } = require('./products/Bill');
const { can_get_bill, can_get_store_user, can_view_dashboard } = require('../../middlewares/permission');
const { getUser } = require('../admins/analytics/User');
const GetStoreUser = require('./users/GetUser');
const { GetCashFlow } = require('./cashs/GetCashFlow');
const analytics = express.Router();

analytics.get('/api/analytic/products/bill', can_get_bill, GetBill);
analytics.get('/api/analytic/products/bill/:bill_id/info', can_get_bill, GetBillInfo);
analytics.get('/api/analytic/users', can_get_store_user, GetStoreUser);
analytics.get('/api/analytic/cashflows', can_view_dashboard, GetCashFlow);

module.exports = analytics;