const express = require("express");
const route = express.Router();
const AuthModel = require("../../Model/AuthModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// route.post('regestration',)


module.exports = route