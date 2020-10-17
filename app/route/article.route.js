const express = require('express');
const db = require('./app/config/db.config.js');
const app = express();

// Declare constants for PostgreSQL Pool connection
const postgresUser = "postgres";
const postgresDb = "postgres";
const postgresPass = "adevaraz";

const readArticle = async() => {
    await db
    .query(`
        SELECT *
        FROM article;`)
    .then(res => console.log(res.rows))
    .catch(err => console.error("Error reading article", err.stack));
}

app.get('/article', (req, res) => {
    readArticle();
});

const createArticle = async(article) => {
    await db
    .query(`
        INSERT INTO article (title, content)
        VALUES ($1, $2)
        RETURNING id;`,
        [article.title, article.content])
    .then(res => console.log("Successfully inserted " + article.title + "::" + article.content))
    .catch(err => console.error("Error inserting new article", err.stack));
}

app.post('/article', (req, res) => {
    createArticle(req.body);
});

const updateArticle = async(id, newArticle) => {
    await db
    .query(`
        UPDATE article
        SET title = $2,
            content = $3
        WHERE id = $1;`,
        [id, newArticle.title, newArticle.content])
    .then(res => console.log("Successfully updated " + newArticle.title + "::" + newArticle.content))
    .catch(err => console.error("Cannot update article", err.stack));
}

app.put('/article/:id', (req, res) => {
    updateArticle(req.param.id, req.body);
});

const deleteArticle = async(id) => {
    await db
    .query(`
        DELETE FROM article
        WHERE id = $1
        RETURNING *;`,
        [id])
    .then(res => console.log("Successfully deleted " + id))
    .catch(err => console.error("Cannot delete article", err.stack));
}

app.delete('/article/:id', (req, res) => {
    deleteArticle(req.param.id);
});

const port = 3000;
const server = app.listen(port, () => console.log('Server ready'));

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});