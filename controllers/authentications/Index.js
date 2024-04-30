const express = require('express');
const Register = require('./Register');
const Login = require('./Login');
const Refresh = require('./Refresh');
const GetOTPRegister = require('./GetOTPRegister');
const authentications = express.Router();

authentications.get('/api/auth/refresh', Refresh);

authentications.post('/api/auth/get-otp-register', GetOTPRegister);
authentications.post('/api/auth/register', Register);
authentications.post('/api/auth/login', Login);

module.exports = authentications;