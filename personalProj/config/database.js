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
    const createPath = path.join(__dirname, 'createDatabase.sql');
    const createScript = fs.readFileSync(createPath, 'utf-8');

    try {
        await query(createScript);
        console.log('Database created successfully');

    } catch (err) {
        console.error('Error creating database', err.stack);
    }

    // const insertPath = path.join(__dirname, 'createDatabase.sql');
    // const insertScript = fs.readFileSync(insertPath, 'utf-8');

    // try {
    //     if ((await query('SELECT * FROM specializations')).rows.length === 0) {
    //         await query(insertScript);
    //         console.log('Database data inserted successfully');
    //     }
    // } catch (err) {
    //     console.error('Error inserting data to database', err.stack);
    // }
}

createDatabase().catch(err => console.error('Unexpected error', err));

module.exports = { client, query };
