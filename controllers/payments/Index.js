const express = require('express');
const VerifyPayment = require('./VerifyPayment');
const bodyParser = require('body-parser');
const GetOrderSessionId = require('./GetOrderSessionId');
const { can_get_order_session_id } = require('../../middlewares/permission');
const { GetOrderDetail, GetOpenOrder, GetOrder } = require('./GetOrder');
const payments = express.Router();

payments.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), VerifyPayment);
payments.get('/api/payment/get-payment-order/:order_id', can_get_order_session_id, GetOrderSessionId);

payments.get('/api/payment/get-open-order', can_get_order_session_id, GetOpenOrder);
payments.get('/api/payment/get-order', can_get_order_session_id, GetOrder);
payments.get('/api/payment/get-order/:order_id', can_get_order_session_id, GetOrderDetail);

module.exports = payments;