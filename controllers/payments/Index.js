const express = require('express');
const VerifyPayment = require('./VerifyPayment');
const bodyParser = require('body-parser');
const GetOrderSessionId = require('./GetOrderSessionId');
const { can_get_order_session_id } = require('../../middlewares/permission');
const payments = express.Router();

payments.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), VerifyPayment);
payments.get('/api/payment/get-payment-order/:order_id', can_get_order_session_id, GetOrderSessionId);

module.exports = payments;