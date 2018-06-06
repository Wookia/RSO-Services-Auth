"use strict";

let request = require("request");
let port = process.env.PORT || 3000;
const fs = require('fs');

let myService;
let token;
let userId;
let adminId;
describe("Authentication Service - Integration Tests / ", function(){

    process.env.TESTS = true;
    process.env.DB_NAME = "postgress";
    process.env.DB_USER = "user";
    process.env.DB_PASSWORD = "password" ;

    let baseUrl = "http://localhost:" + port + "/api/";

    beforeAll(function(done) {
        fs.unlink('spec/database.sqlite');
        myService = require("../../src/server.js");
        myService.startServer().then(() => {
            done();
        });

    }, 60000);
    
    afterAll(function(done){
        myService.stopServer().then(() => {
            fs.unlink('spec/database.sqlite');
            done();
        });
    }, 60000);
   
    describe("POST /", function(){
        it("should authenticate", function(done){
            request.post(baseUrl + "auth", {
                body: { 
                    "username" : "admin",
                    "password" : "admin"
                },
                headers: {'Content-Type': 'application/json'},
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                expect(response.body.token).toBeDefined();
                token = response.body.token;
                
                done(); 
            });
        });
        it("should create user", function(done){
            request.post(baseUrl + "user", {
                body: { 
                    "username" : "user",
                    "password" : "user"
                },
                headers: {'Content-Type': 'application/json'},
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                expect(response.body.username).toBe("user");
                expect(response.body.password).toBeUndefined();
                expect(response.body.role).toBe(0);
                userId = response.body.id;
                done(); 
            });
        });
   
    });

    describe("GET /", function(){
        it("should get users", function(done){
            request.get(baseUrl + "user", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                expect(response.body.length).toBe(2);
                expect(response.body[0].username).toBe('admin');
                expect(response.body[0].password).toBeUndefined();
                expect(response.body[1].username).toBe('user');
                expect(response.body[1].password).toBeUndefined();
                adminId = response.body[0].id;
                done(); 
            });
        });
        it("should get user", function(done){
            request.get(baseUrl + "user/" + userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                expect(response.body.username).toBe('user');
                expect(response.body.password).toBeUndefined();
                done(); 
            });
        });
   
    });   

    describe("PUT /", function(){
        it("should update user", function(done){
            request.put(baseUrl + "user/" + userId, {
                body: { 
                    "role": 2
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                expect(response.body.role).toBe(2);
                expect(response.body.username).toBe('user');
                expect(response.body.password).toBeUndefined();
                
                done(); 
            });
        });
        it("should fail to update user without token", function(done){
            request.put(baseUrl + "user/" + userId, {
                body: { 
                    "role": 2
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(401);
                
                done(); 
            });
        });
        it("should update user password", function(done){
            request.put(baseUrl + "user/" +adminId+ "/password", {
                body: { 
                    "oldPassword" : "admin",
                    "newPassword" : "admin1"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                json : true
            }, function(err, response, body){
                expect(response.statusCode).toEqual(200);
                request.post(baseUrl + "auth", {
                    body: { 
                        "username" : "admin",
                        "password" : "admin1"
                    },
                    headers: {'Content-Type': 'application/json'},
                    json : true
                }, function(err, response, body){
                    expect(response.statusCode).toEqual(200);
                    expect(response.body.token).toBeDefined();
                    
                    done(); 
                });
            });
        });
        describe("DELETE /", function(){
            it("should update user", function(done){
                request.delete(baseUrl + "user/" + userId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    json : true
                }, function(err, response, body){
                    expect(response.statusCode).toEqual(200);
                    request.get(baseUrl + "user", {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        json : true
                    }, function(err, response, body){
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.length).toBe(1);
                        done();
                    });
                });
            });
        });
   
    });          

});