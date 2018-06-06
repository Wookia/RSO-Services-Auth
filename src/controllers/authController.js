"use strict";

let Promise = require("bluebird");
let authCommands = require("../domain/authCommands.js");

module.exports.authenticate = function(req, res, next){
    console.log("authenticate");
    return authCommands.authenticateAsync(req.body.username, req.body.password).then((token)=>{
        res.json({token: token});
        return Promise.resolve();
    }).catch((error) =>{
        res.sendStatus(401);
    });
};
