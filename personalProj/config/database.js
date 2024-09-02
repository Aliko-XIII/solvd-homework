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
    await insertTestData();
}

async function insertTestData() {
    const tables = [
        {
            name: 'specializations',
            pk: 'specialization_id',
            script: 'insertSpecializations.sql'
        },
        {
            name: 'organs',
            pk: 'organ_id',
            script: 'insertOrgans.sql'
        },
        {
            name: 'specializations_to_organs',
            pk: 'record_id',
            script: 'insertSpToOr.sql'
        },
        {
            name: 'symptoms',
            pk: 'symptom_id',
            script: 'insertSymptoms.sql'
        },
        {
            name: 'specializations_to_symptoms',
            pk: 'record_id',
            script: 'insertSpToSt.sql'
        },
        {
            name: 'users',
            pk: 'user_id',
            script: 'insertUsers.sql'
        }
    ];
    for (let table of tables) {
        try {
            if ((await query(`SELECT * FROM ${table.name};`)).rows.length !== 0) {
                continue;
            }
            await query('BEGIN');
            await query(`TRUNCATE TABLE ${table.name} RESTART IDENTITY CASCADE;`);
            await query('COMMIT');

            const insertPath = path.join(__dirname, table.script);
            const insertScript = fs.readFileSync(insertPath, 'utf-8');
            await query(insertScript);
            const res = await query(insertScript);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error inserting data to database', err.stack);
        }
    }
}

createDatabase().catch(err => console.error('Unexpected error', err));

module.exports = { client, query };
