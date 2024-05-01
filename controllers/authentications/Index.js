const express = require('express');
const Register = require('./Register');
const Login = require('./Login');
const Refresh = require('./Refresh');
const GetOTPRegister = require('./GetOTPRegister');
const Logout = require('./Logout');
const { can_log_out } = require('../../middlewares/permission');
const authentications = express.Router();

authentications.get('/api/auth/refresh', Refresh);

authentications.post('/api/auth/get-otp-register', GetOTPRegister);
authentications.post('/api/auth/register', Register);
authentications.post('/api/auth/login', Login);
authentications.delete('/api/auth/logout', can_log_out, Logout);

module.exports = authentications;