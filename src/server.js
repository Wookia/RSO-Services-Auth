let express = require("express");
let db = require('./storage/database.js');
let routing;
const app = express();

exports.startServer = function(){
    let self = this;
    db.initialize().then(()=>{
        routing = require('./routing.js')
        console.log('Database connection initialized');
        app.use(function (req, res, next) {
        
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        
            res.setHeader('Access-Control-Allow-Credentials', true);
        
            next();
        });
        
        app.use("", routing);
    
        self._server = app.listen(process.env.PORT || 3000, () => {
            console.log('App listening on port: ' + (process.env.PORT || 3000))
        });
    });
}

exports.stopServer = function(){
    this._server.close()
}
