const Sequelize = require('sequelize');
let Promise = require("bluebird");


function initializeUser(sequelize){
    return sequelize.define('user', {
        id: { type: Sequelize.STRING, primaryKey: true },
        username: { type: Sequelize.STRING, unique: true },
        password: Sequelize.STRING,
        role: Sequelize.INTEGER
    });
}
module.exports.initializeModel = function(sequelize){
    return new Promise((resolve, reject) => {
        return resolve({
            user: initializeUser(sequelize)
        });
    });
}