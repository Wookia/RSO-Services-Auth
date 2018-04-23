"use strict";

let router = require("express-promise-router")();
let bodyParser = require('body-parser');
let jwt = require('express-jwt');

let authController = require("./controllers/authController.js");
let userController = require("./controllers/userController.js");

let publicKey =  "-----BEGIN PUBLIC KEY-----\n" + process.env.PUBLIC_KEY + "\n-----END PUBLIC KEY-----";
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/auth', authController.authenticate);

router.get('/user', jwt({secret: publicKey, algorithms: ['RS256']}), userController.getUsers);
router.get('/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.getUser);
router.put('/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.updateUser);
//router.delete('/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.deleteUser);

router.post('/user', userController.createUser);

module.exports = router;