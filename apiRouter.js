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

// test route
router.get('/test', async (req, res) => {
    res.json({
        success: true,
        message: 'api is up and running'
    });
});

router.get('/testdb', async (req, res) => {
    // USE QUERY 
    var sql = "select username from tbl_users" // sql to execute SP 
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

██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗    ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝    ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║   ██║██████╔╝██║     ██║██║         ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║         ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗    ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝ 
                                                           
*/


// call other private api (web-service) like this 
// var r = require('request');
// router.get('/api/se/portfoy',function(request,res,next){
//   var url = '/www/data/portfoy.json'
//   var url = 'http://edalatapp.ipo.org/api/api.aspx?api=GetCoAppDashBoard1' ; 
//   r.get(url,function(err,res,body){
//     res.send(body);
//   });
// });



// todo you can use jwt to secure the routes 
var jwt = require('jsonwebtoken');
var jwt_secret = '(9<s)NR6vc^2]-x[';


// /api/login 
router.post('/login',async(req,res)=>{   
    console.log('/api/login is triggerd') 
    if(!req.body.username || !req.body.password){
        return res.status(401).json({success:false , message:'no username or password'});
    }
    // console.log(req.body);
    try {
        var _user = await db('tbl_users').where('username',req.body.username).andWhere('password',req.body.password) ; 
        if(_user[0]){
            
            var payload = {
                userid   : _user[0].userid , 
                username : _user[0].username,
                realname : _user[0].realname 
            } ; 

            var expiresIn = req.body.remember?'356d':'24h'; 
            var authToken = jwt.sign(payload, jwt_secret, {expiresIn: expiresIn});        
        
            res.cookie('authtoken', authToken);
            res.cookie('realname', _user[0].realname);

            res.json({success: true , token:authToken , realname:_user[0].realname , username:_user[0].username});
        
        }else{
            res.cookie('authtoken', '');
            // res.cookie('current_user', JSON.stringify(payload));
            res.cookie('realname', '');

            res.status(401).json({success:false , message:'username or password is not correct'});
        }
        
    } catch (error) {
        console.log(116,error.message);
        res.status(500).json(error.message);
    }
});

// /api/logout 
router.get('/logout',async(req,res)=>{
    res.cookie('authtoken', '');
    // res.cookie('current_user', JSON.stringify(payload));
    res.cookie('realname', '');
    res.json({success: true});
});


/*
     ██╗██╗    ██╗████████╗    ██████╗ ██████╗  ██████╗ ████████╗███████╗ ██████╗████████╗
     ██║██║    ██║╚══██╔══╝    ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝
     ██║██║ █╗ ██║   ██║       ██████╔╝██████╔╝██║   ██║   ██║   █████╗  ██║        ██║   
██   ██║██║███╗██║   ██║       ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██╔══╝  ██║        ██║   
╚█████╔╝╚███╔███╔╝   ██║       ██║     ██║  ██║╚██████╔╝   ██║   ███████╗╚██████╗   ██║   
 ╚════╝  ╚══╝╚══╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   */

function isAuthenticated(req) {
    // access-token name is : authtoken in header or cookies 
    var token =  req.headers.authtoken || req.cookies.authtoken; 
    if (token) {
        try {
            var authToken = jwt.verify(token, jwt_secret);
            // console.log('authtoken' , authToken);
            req.userid = authToken.userid; // put userid and username in req object 
            req.username = authToken.username;
            req.realname = authToken.realname;
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    } else {
        return false;
    }
};

router.use(function (req, res, next) {
    if (isAuthenticated(req)) {
        next(); //allow the next api(s)
    } else {
        res.status(401).json({success: false,message: 'invalid access token'});
    }
});

// other routes need a valid jwt token 

router.get('/checkToken',(req,res)=>{
    res.json({success:true , message:'authToken is valid' , username:req.username , userid:req.userid});
});


// the routes could be setau as :
// /api/v1/public  -> for public/free routes 
// /api/v1/private -> for api-key required apis 
// /api/v1/secure  -> for auth requires apis 
// the api-key validation and authToken validation must be moved in thir modules 



////////////////////////////////////////////////////////////////////
// trap invalid endpoints 
////////////////////////////////////////////////////////////////////
router.route('*').all((req, res, next) => {
    res.json({
        success: false,
        error: 'invalid endpoint'
    });
}); // trap invalid endpoints 

module.exports = router;