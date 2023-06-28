const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

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

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles FULL JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else return rows;
    });
};
