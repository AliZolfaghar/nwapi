// read config.json 
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));

// create mssql-knex-client
module.exports = require('knex')({
    "client": "mssql",
    "connection": {
        "host": "localhost\\SqlExpress",
        "user": "sa",
        "password": "sa@2014",
        "database": "DWTDB",
    },
    // "charset": "utf8_general_ci",
    "pool": {
        "min": 0,
        "max": 10,
        // "charset": "utf8_general_ci",
        "idleTimeoutMillis": 30000
    },
    "migrations": {
        "tableName": "knex_migrations"
    }
});

// production: {
//     client: 'mssql',
//     connection: {
//       host: config.db_server,
//       user: config.db_username,
//       password: config.db_password,
//       database: config.db_database
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// var mssql = require('knex')({
//     client: 'mssql',
//     connection: {
//         host : config.mssql_config.host,
//         user : config.mssql_config.user,
//         password : config.mssql_config.password,
//         database : config.mssql_config.database
//     }
// });