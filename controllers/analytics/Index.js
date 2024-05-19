const express = require('express');
const { GetBill, GetBillInfo } = require('./products/Bill');
const { can_get_bill } = require('../../middlewares/permission');
const analytics = express.Router();

analytics.get('/api/analytic/products/bill', can_get_bill, GetBill);
analytics.get('/api/analytic/products/bill/:bill_id/info', can_get_bill, GetBillInfo);

module.exports = analytics;