const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id =$1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      } else {
        return rows;
      }
    });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.title,articles.article_id,articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url,CAST(COUNT(comment_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON  comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.createComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;",
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
