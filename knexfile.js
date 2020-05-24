// Update with your config settings.
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/appdb.db'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'mssql',
    connection: {
      host: config.db_server,
      user: config.db_username,
      password: config.db_password,
      database: config.db_database
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
