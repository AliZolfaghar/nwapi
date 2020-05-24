var apiversion = '1.1.1';
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));
// var db = require('./knex_mssql');
var db = require('./knex_sqlite');

// var path = require('path');
// var log = require('./azlog');
// var token = require('./token');
// var http = require('http');

var express = require('express');
var router = express.Router();

// -> /api/private/test
router.get('/test', async (req, res) => {
    res.json({
        success: true,
        message: 'api with api-key protection is up and running'
    });
});

////////////////////////////////////////////////////////////////////  
// validate apikey , all api request need an api key except /api.test
////////////////////////////////////////////////////////////////////
var apikeys = JSON.parse(fs.readFileSync('./apikeys.json'));

// TODO : apikey must read from : field : apikey 
// [X] form-body 
// [X] json post 
// [] header 
// [] cookie


/*

 █████╗ ██████╗ ██╗      ██╗  ██╗███████╗██╗   ██╗    ██████╗ ██████╗  ██████╗ ████████╗███████╗ ██████╗████████╗
██╔══██╗██╔══██╗██║      ██║ ██╔╝██╔════╝╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝
███████║██████╔╝██║█████╗█████╔╝ █████╗   ╚████╔╝     ██████╔╝██████╔╝██║   ██║   ██║   █████╗  ██║        ██║   
██╔══██║██╔═══╝ ██║╚════╝██╔═██╗ ██╔══╝    ╚██╔╝      ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██╔══╝  ██║        ██║   
██║  ██║██║     ██║      ██║  ██╗███████╗   ██║       ██║     ██║  ██║╚██████╔╝   ██║   ███████╗╚██████╗   ██║   
╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   

*/
router.route('*').all(function (req, res, next) {
    var apikey = req.headers.apikey || req.body.apikey ; 
    console.log('apikey is : ' + apikey);
    if (apikeys.hasOwnProperty(apikey)) {
        console.log('api-key used : ', apikeys[apikey]);
        if (apikey == '4EA69F21-169D-4A55-AEC4-5AA320D7F40B') {
            // res.json(testValue);
            res.json({
                success: true,
                owner: 'test-key'
            });

        } else {
            req.apikey = apikey ; 
            req.apikeyOwner = apikeys[apikey];
            next();
        }
    } else {
        console.log('invalid api-key ', apikey);
        res.json({
            success: false,
            error: 'invalid api-key!'
        });
    }
});

// -> /api/private/check
router.get('/check', async (req, res) => {
    res.json({
        success: true,
        message: 'api-key is correct : ' + req.apikey + ' / ' + req.apikeyOwner
    });
});


////////////////////////////////////////////////////////////////////
// trap invalid endpoints 
////////////////////////////////////////////////////////////////////
router.route('*').all((request, response, next) => {
    response.json({
        success: false,
        error: 'invalid endpoint'
    });
}); // trap invalid endpoints 

module.exports = router;