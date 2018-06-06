"use strict";

const Sequelize = require('sequelize');
let Promise = require("bluebird");

let iteration = 0;

let _sequelize;
let _models = {};

let models = require("./models.js");

function getDbHost() {
    let host = '';
    const isWin = process.platform === "win32";
    if (isWin === true) {
        console.log('System: Windows');
        host = 'localhost';
    } else {
        console.log('System: Linux/Mac');
        host = '192.168.99.100';
    }
    return host;
}

function getValidConnection(dbDriver) {
    return new Promise((resolve, reject) => {
        dbDriver
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                resolve(dbDriver);
            })
            .catch(err => {
                console.log('Connection to DB cannot be established at the moment');
                console.log(err.message);
                // reject(err);
                if(iteration < 10){
                    setTimeout(() => resolve(getValidConnection(dbDriver)), 10000);
                    iteration++;
                }
                else reject(err);
            });
    });
}

module.exports.models = function(){
    return _models;
};

module.exports.initialize = function(){
    let config = process.env.TESTS ? {
        dialect: 'sqlite',
        storage: 'spec/database.sqlite'
    } : {
        dialect: 'postgres',
        host: process.env.DB_HOST ? process.env.DB_HOST : getDbHost(),
        port: process.env.DB_PORT
    };
    _sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, config);

    return getValidConnection(_sequelize).then(() => {
        return models.initializeModel(_sequelize).then((definedModels) => {
            _models = definedModels;
            return _sequelize.sync();
        }).catch((error) => {
            return Promise.reject(error);
        });
    });
    
};