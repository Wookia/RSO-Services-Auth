"use strict";

const Sequelize = require('sequelize');
let Promise = require("bluebird");
let _sequelize;
let _models = {};
let models = require("./models.js");

module.exports.models = function(){
    return _models;
};

module.exports.initialize = function(){
    _sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    });
    return models.initializeModel(_sequelize).then((definedModels) => {
        _models = definedModels;
        return _sequelize.sync();
    });
};