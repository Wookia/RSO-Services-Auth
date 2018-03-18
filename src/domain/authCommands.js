"use strict";

let Promise = require("bluebird");
let jwt = require('jsonwebtoken');
let database = require('../storage/database.js');
let bcrypt = require('bcrypt');
let User = database.models().user;

module.exports.authenticateAsync = function(username, password){
    return User.findOne({ where: {username: username} }).then((user) => {
        if(user){
            return bcrypt.compare(password, user.password).then((res) => {
                if(res){
                    return Promise.resolve(jwt.sign({
                        username: user.username,
                        role: user.role,
                        id: user.id
                    }, process.env.PRIVATE_KEY, {
                        algorithm: 'RS256',
                        expiresIn: "10h"
                    }));
                }
            });
        }
        return Promise.reject("Unauthenticated Error");
    });
}