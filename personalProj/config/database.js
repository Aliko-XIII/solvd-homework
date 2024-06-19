const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'hospitalTest',
    password: 'postgres',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to the PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = { client };
