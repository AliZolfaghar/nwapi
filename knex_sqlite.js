// read config.json 
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));

// create mssql-knex-client
module.exports = require('knex')({
    "client": "sqlite",
    connection: {
        filename: './db/appdb.db'
    },  
    useNullAsDefault: true,
    "migrations": {
        "tableName": "knex_migrations"
    }
});