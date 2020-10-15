const { table } = require('console');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'adevaraz',
  port: 5432,
});

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

// Declare constant for CRUD table
const tableName = "article";

// Declare string for create table
const newTable = `CREATE TABLE IF NOT EXIST ${tableName} (
    id SERIAL NOT NULL,
    title VARCHAR(30) NOT NULL,
    content TEXT NOT NULL
);`;

async function createTable() {
    const client = await pool
    .connect()
    .catch(err => {
        console.log('pool .connect ->', err);
    });

    if(client != undefined) {
        await client.query(`DROP TABLE ${tableName};`, (err, res) => {
            console.log("nclient ready:", client.readyForQuery, "n");

            if (err) {
                console.log("DROP TABLE ->", err);
            }

            if (res) {
                console.log("DROP TABLE result:", res);
            }
        });
    }
}