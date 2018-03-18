"use strict";

let Promise = require("bluebird");
let userCommands = require("../domain/userCommands.js");
//let permissions = require('./permissions.js');

module.exports.createUser = function(req, res, next){
    return userCommands.createUserAsync(req.body).then((user) => {
        res.status(201).json(user);
        return Promise.resolve();
    });
};

module.exports.getUsers = function(req, res, next){
    if(req.user.role > 0){
        return userCommands.getUsersAsync().then((users) => {
            res.json(users);
            return Promise.resolve();
        });
    }
    res.status(403).send();
    return Promise.resolve();
};

module.exports.getUser = function(req, res, next){
    
    let params = req.params;
    if(req.user.role > 0 || (req.user.role === 0 && params.id == req.user.id)){
        return userCommands.getUserAsync(params.id).then((users) => {
            res.json(users);
            return Promise.resolve();
        });
    }
    res.status(403).send();
    return Promise.resolve();
};

module.exports.updateUser = function(req, res, next){
    let params = req.params;
    if(params.id != req.user.id && req.user.role != 3){
        res.status(403).send();
        return Promise.resolve();
    }
    else if(params.id == req.user.id){
        req.body.role = req.user.role
    }
    return userCommands.updateUserAsync(params.id, req.body).then((users) => {
        res.json(users);
        return Promise.resolve();
    });
};