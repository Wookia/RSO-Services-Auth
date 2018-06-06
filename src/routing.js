"use strict";

let router = require("express-promise-router")();
let bodyParser = require('body-parser');
let jwt = require('express-jwt');
let fs = require('fs');

let authController = require("./controllers/authController.js");
let userController = require("./controllers/userController.js");

let publicKey =  fs.readFileSync('./dev-keys/public.pem');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/api/auth', authController.authenticate);

router.get('/api/user', jwt({secret: publicKey, algorithms: ['RS256']}), userController.getUsers);
router.get('/api/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.getUser);
router.put('/api/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.updateUser);
router.put('/api/user/:id/password', jwt({secret: publicKey, algorithms: ['RS256']}), userController.updateUserPassword);
router.delete('/api/user/:id', jwt({secret: publicKey, algorithms: ['RS256']}), userController.deleteUser);

router.post('/api/user', userController.createUser);

module.exports = router;