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

function query(queryStr) {
    try {
        return client.query(queryStr);
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}
module.exports = { client, query };
