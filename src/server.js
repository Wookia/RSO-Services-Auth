"use strict";

let Promise = require("bluebird");
let express = require("express");
let db = require('./storage/database.js');
let routing;
let userCommands;
const app = express();

exports.startServer = function(){
    let self = this;
    return db.initialize().then(()=>{
        userCommands = require('./domain/userCommands.js');
        return userCommands.getUsersAsync().then((result) => {
            if(result.length === 0){
                return userCommands.createUserAsync({
                    username: 'admin',
                    password: 'admin',
                    role: 3
                }, true).then(() => {
                    return Promise.resolve();
                });
            }
            else{
                return Promise.resolve();
            }
        });
    }).then(()=>{
        routing = require('./routing.js');
        console.log('Database connection initialized');
        app.use(function (req, res, next) {
        
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        
            res.setHeader('Access-Control-Allow-Credentials', true);
        
            next();
        });
        
        app.use("", routing);
    
        self._server = app.listen(process.env.PORT || 3000, () => {
            console.log('App listening on port: ' + (process.env.PORT || 3000))
        });
    });
};

exports.stopServer = function(){
    this._server.close();
};
