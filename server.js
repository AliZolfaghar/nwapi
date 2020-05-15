// read config.json 
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));
// test config
// console.log(config)

// create http and https 
var http        = require('http');
var https       = require('https');

// #############################################################################
//  SSL :                                                                      #
//  use this commandes to generate a test SSL-Certificate                      #
//  openssl genrsa 1024 > private.key                                          #
//  openssl req -new -key private.key -out cert.csr                            #
//  openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem   #
// #############################################################################
// openssl genrsa -out app-key.pem 2048                                        #
// openssl req -new -sha256 -key app-key.pem -out app-csr.pem                  #
// openssl x509 -req -in app-csr.pem -signkey app-key.pem -out app-cert.pem    #
// #############################################################################
// load SSL certificate
var ssl_options = {
    key   : fs.readFileSync('./ssl/private.key'),
    cert  : fs.readFileSync('./ssl/certificate.pem')
};

// use some packages 
var morgan = require('morgan');
var cors = require('cors');
var azdate = require('azdate');

// create express app 
var express = require('express');
var app     = express();

// use express status monitor if neede 
// app.use(require('express-status-monitor')());

// log all route to console
app.all('*',function(request,response,next){
    console.log('process : ' + request.connection.remoteAddress + '/' + request.url );
    next();
});

// setup body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Bad JSON handler 
app.use(function (error, request, response, next) {
    if (error instanceof SyntaxError) return response.status(400).send(JSON.stringify({
        error: "Invalid JSON"
    }));
    console.error(error);
    response.status(500).send();
});

// setup cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// setup express static 
app.use(express.static('./www'));

// setup cors 
app.use(cors());

// setup morgan logger 
// app.use(morgan('short'));

// use api-router 
var apiRouter = require('./apiRouter');
app.use(apiRouter);


// // bind https server to express app and start to listen
// var httpsServer = https.createServer(ssl_options, app);
// httpsServer.listen(config.httpsPort , function(err){
//     if(err){
//         log.error(err);
//     }
//     else{
//         log.info('https-server listen on port : ' + config.httpsPort);
//     }
// });


// // http server :
// var httpServer = http.createServer(function(req , res){
//     var httpServer = http.createServer(function(req , res){
//     // redirect all http request to https
//     log.info('incomming http request : ' + req.url);
//     redirectToHttps(req.headers.host , req.url , res);
// });

// var httpServer = http.createServer(app);

// // listen to http requests
// httpServer.listen(config.httpPort,function(err){
//     log.info(' http-server listen on port : ' + config.httpPort);
// });

// // redirect the url to http service
// function redirectToHttps(host , url , res){
//     var location = 'https://'+ host + ':' + config.httpsPort +  url;
//     log.error('redirect to ' + location);
//     res.writeHead(301,{Location: 'https://'+ host + ':' + config.httpsPort +  url });
//     res.end();
// }

// listen to requests in express 
app.listen(config.httpPort,function(){
    console.log('SERVER LISTEN ON PORT : ' + config.httpPort);
});


