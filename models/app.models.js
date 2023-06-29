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
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Not Found" });
      } else return rows[0];
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
