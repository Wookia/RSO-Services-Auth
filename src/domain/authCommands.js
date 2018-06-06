"use strict";

let Promise = require("bluebird");
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let fs = require('fs');

let database = require('../storage/database.js');

let User = database.models().user;

function getPrivateKey(){
	return fs.readFileSync('./dev-keys/private.ppk');
}


module.exports.authenticateAsync = function(username, password){
    return User.findOne({ where: {username: username} }).then((user) => {
        if(user){
            return bcrypt.compare(password, user.password).then((res) => {
                if(res){
                    return Promise.resolve(jwt.sign({
                        username: user.username,
                        role: user.role,
                        id: user.id
                    }, getPrivateKey(), {
                        algorithm: 'RS256',
                        expiresIn: "10h"
                    }));
                }
                return Promise.reject();
            });
        }
        return Promise.reject();
    });
};