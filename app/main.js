const express = require('express');
const db = require('./config/db.config.js');
const app = express();

// Declare constants for PostgreSQL Pool connection
const postgresUser = "postgres";
const postgresDb = "postgres";
const postgresPass = "adevaraz";

app.use(express.json());

app.use(express.static('app/public'));

const createArticle = async(article) => {
    await db
    .query(`
        INSERT INTO article(title, content)
        VALUES ($1, $2)
        RETURNING id;`,
        [article.title, article.content])
    .then(res => console.log("Successfully created " + article.title))
    .catch(err => console.log("Error creating article", err.stack));
}

app.post('/article', (req, res) => {
    console.log(req.body);
    createArticle(req.body);
});

const readArticle = async() => {
    return await db.query(`
        SELECT *
        FROM article;`)
    .then(res => {
        console.log(res.rows);
        return res.rows;
    })
    .catch(err => console.error("Error reading article", err.stack));
}

app.get('/article', async(req, res) => {
    res.json(await readArticle());
});

const updateArticle = async(id, newArticle) => {
    await db
    .query(`
        UPDATE article
        SET title = $2,
            content = $3
        WHERE id = $1
        RETURNING id;`,
        [id, newArticle.title, newArticle.content])
    .then(res => console.log("Successfully updated " + newArticle.title + "::" + newArticle.content))
    .catch(err => console.error("Cannot update article", err.stack));
}

app.put('/article/:id', (req, res) => {
    updateArticle(req.params.id, req.body);
});

const deleteArticle = async(id) => {
    return await db
    .query(`
        DELETE FROM article
        WHERE id = $1
        RETURNING *;`,
        [id])
    .then(res => console.log("Successfully deleted " + id))
    .catch(err => console.error("Cannot delete article", err.stack));
}

app.delete('/article/:id', (req, res) => {
    deleteArticle(req.params.id).then(() => {
        res.status(200).end();
    });
});

const port = 3000;
const server = app.listen(port, () => console.log('Server ready'));

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});