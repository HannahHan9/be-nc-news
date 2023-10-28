const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");
const format = require("pg-format");
const fs = require("fs/promises");

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics`);
};

exports.selectArticleById = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "ID Not Found" });
            } else return rows[0];
        });
};

exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
    const queryValues = [];
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

    const validSortByOptions = [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "article_img_url",
        "votes",
        "article_id",
        "comment_count",
    ];
    const validOrderOptions = ["ASC", "DESC", "asc", "desc"];
    if (!validSortByOptions.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
    }
    if (!validOrderOptions.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
    if (topic) {
        queryValues.push(topic);
        queryStr += ` WHERE articles.topic = $1`;
    }
    if (sort_by) {
        queryStr += ` GROUP BY articles.article_id`;
        queryStr += ` ORDER BY ${sort_by} ${order};`;
    }
    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
            [article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertComment = (comment, article_id) => {
    const { username, body } = comment;
    return db
        .query(
            `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
            [username, body, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateArticle = (article_id, body) => {
    const { inc_votes } = body;
    return db
        .query(
            `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
        comment_id,
    ]);
};

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`);
};
