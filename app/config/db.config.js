const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'adevaraz',
  port: 5432,
});

module.exports = pool;

// Declare constant for CRUD table
const tableName = 'article';

// Declare string for create table
const newTable = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
    id      SERIAL NOT NULL,
    title   VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY(id)
);`;

async function createTable() {
    const client = await pool
        .connect()
        .catch(err => {
            console.log('pool .connect ->', err);
    });

    if(client != undefined) {
        await client.query(newTable, (err, res) => {
            if (err) {
                console.log("nCREATE TABLE ->", err);
            }
    
            if (res) {
                console.log("nCREATE TABLE result:", res);
            }
    
            client.release();
            console.log("Client is released");
        });
    }
}

createTable();