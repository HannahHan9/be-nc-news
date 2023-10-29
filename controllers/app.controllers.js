const {
        selectAllTopics,
        selectArticleById,
        selectAllArticles,
        selectCommentsByArticleId,
        insertComment,
        updateArticle,
        removeComment,
        selectAllUsers,
} = require("../models/app.models");

const data = require("../endpoints.json");
const { checkExists } = require("../db/seeds/utils");
const fs = require("fs/promises");

exports.getApiTopics = (req, res, next) => {
        selectAllTopics().then(({ rows }) => {
                res.status(200).send({ topics: rows });
        });
};

exports.getApis = (req, res) => {
        res.status(200).send(data);
};

exports.getArticleById = (req, res, next) => {
        const { article_id } = req.params;
        selectArticleById(article_id)
                .then((article) => {
                        res.status(200).send({ article });
                })
                .catch(next);
};

exports.getAllArticles = (req, res, next) => {
        const { topic, sort_by, order } = req.query;
        const promises = [selectAllArticles(topic, sort_by, order)];
        if (topic) {
                promises.push(checkExists("topics", "slug", topic));
        }
        Promise.all(promises)
                .then((resolvedPromises) => {
                        const articles = resolvedPromises[0];
                        res.status(200).send({ articles });
                })
                .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
        const { article_id } = req.params;
        const promises = [
                selectCommentsByArticleId(article_id),
                checkExists("articles", "article_id", article_id),
        ];
        Promise.all(promises)
                .then((resolvedPromises) => {
                        const comments = resolvedPromises[0];
                        res.status(200).send({ comments });
                })
                .catch(next);
};

exports.postComment = (req, res, next) => {
        const { article_id } = req.params;
        const newComment = req.body;
        insertComment(newComment, article_id)
                .then((comment) => {
                        res.status(201).send({ comment });
                })
                .catch((err) => {
                        next(err);
                });
};

exports.patchArticleById = (req, res, next) => {
        const { article_id } = req.params;
        const body = req.body;
        const promises = [
                updateArticle(article_id, body),
                checkExists("articles", "article_id", article_id),
        ];
        Promise.all(promises)
                .then((resolvedPromises) => {
                        const article = resolvedPromises[0];
                        res.status(200).send({ article });
                })
                .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
        const { comment_id } = req.params;
        const promises = [
                removeComment(comment_id),
                checkExists("comments", "comment_id", comment_id),
        ];
        Promise.all(promises)
                .then(() => {
                        res.status(204).send();
                })
                .catch(next);
};

exports.getAllusers = (req, res, next) => {
        selectAllUsers()
                .then(({ rows }) => {
                        res.status(200).send({ users: rows });
                })
                .catch(next);
};

exports.getUser = async (req, res, next) => {
        const { username } = req.params;
        try {
                const data = await selectUser(username);
                res.status(200).send({ user: data });
        } catch (err) {
                return next(err);
        }
};
