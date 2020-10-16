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
        await client.query(`DROP TABLE ${tableName};`, (err, res) => {
            console.log("nclient ready:", client.readyForQuery, "n");

            if (err) {
                console.log("DROP TABLE ->", err);
            }

            if (res) {
                console.log("DROP TABLE result:", res);
            }
        });

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

const { Client } = require("pg");

// Declare constants for PostgreSQL Pool connection
const postgresUser = "postgres";
const postgresDb = "postgres";
const postgresPass = "adevaraz";

var connectionString = `postgres://${postgresUser}:${postgresPass}@localhost:5432/${postgresDb}`;

const client = new Client({
    connectionString: connectionString
});
client.connect();

const createArticle = async(article) => {
    await client
    .query(`
        INSERT INTO article
        VALUES ($1, $2)
        RETURNING id;`,
        [article.body.title, article.body.content]
    )
    .then(res => console.log(article.body.title + " " + article.body.content))
    .catch(err => console.error('Failed inserting new article', err.stack));
}