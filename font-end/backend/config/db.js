const pgConn = require('pg');

let config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
}

let connexionPool = new pgConn.Pool(config);

module.exports = connexionPool;