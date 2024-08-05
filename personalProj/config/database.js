const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // user: 'postgres',
    // host: 'localhost',
    // database: 'postgres',
    // password: 'postgres',
    // port: 5432,
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

async function createDatabase() {
    const filePath = path.join(__dirname, 'createDatabase.sql');
    const sqlScript = fs.readFileSync(filePath, 'utf-8');

    try {
        await query(sqlScript);
        console.log('Database created successfully');
    } catch (err) {
        console.error('Error creating database', err.stack);
    }
}

createDatabase().catch(err => console.error('Unexpected error', err));

module.exports = { client, query };
