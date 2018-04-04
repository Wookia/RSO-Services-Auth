"use strict";

let Promise = require("bluebird");
let database = require('../storage/database.js');
let bcrypt = require('bcrypt');
let User = database.models().user;
const uuid = require('uuid/v4');

function mapUser(user){
    return {
        id: user.id,
        username: user.username,
        role: user.role
    };
}

module.exports.createUserAsync = function(userData, sysCall){
    bcrypt.hash(userData.password, 10).then((hash) => {
        return User.create({
            username: userData.username,
            password: hash,
            role: sysCall ? userData.role : 0,
            id: uuid()
        }).then((user) => {
            return Promise.resolve({
                id: user.id,
                username: user.username,
                role: user.role
            });
        });
    });
};

module.exports.getUserAsync = function(userId){
    return User.findById(userId).then((user)=>{
        return Promise.resolve(mapUser(user));
    });
};

module.exports.getUsersAsync = function(){
    return User.findAll({
        attributes: {
            exclude: ['password']
        }
    });
};

module.exports.updateUserAsync = function(userId, userData){
    return User.findById(userId).then((user)=>{
        if(user){
            return user.updateAttributes({
                username: userData.username ? userData.username : user.username,
                role: userData.role ? userData.role : user.role
            }).then((user)=>{
                return Promise.resolve(mapUser(user));
            });
        }
        return Promise.reject("404");
    });
};

module.exports.deleteUserAsync = function(userId){
    return User.findById(userId).then((user)=>{
        if(user){
            return user.destroy().then(()=>{
                return Promise.resolve();
            });
        }
        return Promise.reject("404");
    });
};