"use strict";

let Promise = require("bluebird");
let userCommands = require("../domain/userCommands.js");

module.exports.createUser = function(req, res, next){
    return userCommands.createUserAsync(req.body).then((user) => {
        console.log("createUser");
        res.sendStatus(201);
        return Promise.resolve();
    }).catch(next);
};

module.exports.getUsers = function(req, res, next){
    if(req.user.role > 0){
        console.log("getUsers");
        return userCommands.getUsersAsync().then((users) => {
            res.json(users);
            return Promise.resolve();
        }).catch(next);
    }
    res.sendStatus(403);
    return Promise.resolve();
};

module.exports.getUser = function(req, res, next){
    
    let params = req.params;
    if(req.user.role > 0 || (req.user.role === 0 && params.id == req.user.id)){
        console.log("getUser");
        return userCommands.getUserAsync(params.id).then((users) => {
            res.json(users);
            return Promise.resolve();
        }).catch(next);
    }
    res.sendStatus(403);
    return Promise.resolve();
};

module.exports.updateUser = function(req, res, next){
    let params = req.params;
    if(params.id != req.user.id && req.user.role != 3){
        res.sendStatus(403);
        return Promise.resolve();
    }
    else if(params.id == req.user.id){
        req.body.role = req.user.role;
    }
    console.log("updateUser");
    return userCommands.updateUserAsync(params.id, req.body).then((users) => {
        res.json(users);
        return Promise.resolve();
    }).catch(next);
};