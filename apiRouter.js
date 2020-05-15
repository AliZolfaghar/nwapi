var apiversion = '1.1.1';
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));
var db = require('./knex_mssql');
// var path = require('path');
// var log = require('./azlog');
// var token = require('./token');
// var http = require('http');

var express = require('express');
var router = express.Router();

router.get('/api/', async (req, res) => {
    res.json({
        success: true,
        message: 'api is up and running'
    });
});

router.get('/api/testdb', async (req, res) => {
    // USE QUERY 
    var sql = "select top 1 * from information_schema.tables" // sql to execute SP 
    var params = {}
    try {
        res.json(await db.raw(sql, params));
    } catch (ex) {
        res.status(500).json({
            success: false,
            message: ex.message
        })
    }

    // USE SP 
    // var sql = "EXEC dbname.[dbo].[SP_NAME] :param1 , :param2 " // sql to execute SP 
    // var params = {param1 :'abc' , param2:'123'}
    // res.json(await db.raw(sql,params)) ; 
});


// other routes goes here 
/*
___  _  _ ___  _    _ ____    ____ ____ _  _ ___ ____ ____ 
|__] |  | |__] |    | |       |__/ |  | |  |  |  |___ [__  
|    |__| |__] |___ | |___    |  \ |__| |__|  |  |___ ___] 
                                                           
*/

// add other public router 
// router.use(require('./routes/is.router'));
// router.use(require('./routes/edalat.router'));


// call other private  api like this 
// var r = require('request');
// router.get('/api/se/portfoy',function(request,response,next){
//   var url = '/www/data/portfoy.json'
//   var url = 'http://edalatapp.ipo.org//api/api.aspx?api=GetCoAppDashBoard1' ; 
//   r.get(url,function(err,res,body){
//     response.send(body);
//   });
// });



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
router.route('*').all(function (request, response, next) {
    console.log('apikey is : ' + request.body.apikey);
    if (apikeys.hasOwnProperty(request.body.apikey)) {
        console.log('api-key used : ', apikeys[request.body.apikey]);
        if (request.body.apikey == '4EA69F21-169D-4A55-AEC4-5AA320D7F40B') {
            // response.json(testValue);
            response.json({
                success: true,
                owner: 'test-key'
            });

        } else {
            request.apiOwner = apikeys[request.body.apikey];
            next();
        }
    } else {
        console.log('invalid api-key ', request.body.apikey);
        response.json({
            success: false,
            error: 'invalid api-key!'
        });
    }
});


// the other request require api-key 

// todo you can use jwt to secure the routes 
var jwt = require('jsonwebtoken');
var jwt_secret = '(9<s)NR6vc^2]-x[';


// login 
router.post('/api/login',async(request,response)=>{    
    // console.log(request.body);
    try {
        var _user = await knex('tbl_users').where('username',request.body.username).andWhere('password',request.body.password) ; 
        if(_user[0]){
            
            var payload = {
                userid   : _user[0].userid , 
                username : _user[0].username,
                realname : _user[0].realname 
            } ; 

            var expiresIn = request.body.remember?'356d':'24h'; 
            // console.log(expiresIn);

            // console.log(payload);
            // login
            var login_token = jwt.sign(payload, jwt_secret, {expiresIn: expiresIn});        
        
            response.cookie('login_token', login_token);
            // response.cookie('current_user', JSON.stringify(payload));
            response.cookie('realname', _user[0].realname);

            response.json({success: true});
        
        }else{
            response.cookie('login_token', '');
            // response.cookie('current_user', JSON.stringify(payload));
            response.cookie('realname', '');

            response.status(401).json({success:false});
        }
        
    } catch (error) {
        console.log(116,error.message);
        response.status(500).json(error.message);
    }
});

// logout 
router.get('/api/logout',async(request,response)=>{
    response.cookie('login_token', '');
    // response.cookie('current_user', JSON.stringify(payload));
    response.cookie('realname', '');
    response.json({success: true});
});


/*
     ██╗██╗    ██╗████████╗    ██████╗ ██████╗  ██████╗ ████████╗███████╗ ██████╗████████╗
     ██║██║    ██║╚══██╔══╝    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝
     ██║██║ █╗ ██║   ██║       ██████╔╝██████╔╝██║   ██║   ██║   █████╗  ██║        ██║   
██   ██║██║███╗██║   ██║       ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██╔══╝  ██║        ██║   
╚█████╔╝╚███╔███╔╝   ██║       ██║     ██║  ██║╚██████╔╝   ██║   ███████╗╚██████╗   ██║   
 ╚════╝  ╚══╝╚══╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   */

function isAuthenticated(request) {
    // token name is : login_token , it can be change to authToken to meet the standard patterns 

    // todo : 
    // token can be pass in 
    // [X] form-body 
    // [X] json post 
    // [] header 
    // [] cookie

    if (request.cookies.login_token) {
        try {
            var login_token = jwt.verify(request.cookies.login_token, jwt_secret);
            // console.log('login_token' , login_token);
            request.userid = login_token.userid;
            request.username = login_token.username;
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    } else {
        return false;
    }
};

router.use(function (request, response, next) {
    if (isAuthenticated(request)) {
        next(); //allow the next api(s)
    } else {
        response.status(401).json({success: false,message: 'invalid access token'});
    }
});

// other routes need a valid jwt token 

// the routes could be setau as :
// /api/v1/public  -> for public/free routes 
// /api/v1/private -> for api-key required apis 
// /api/v1/secure  -> for auth requires apis 
// the api-key validation and authToken validation must be moved in thir modules 


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