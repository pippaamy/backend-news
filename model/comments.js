const db = require("../db/connection");

exports.selectComments = (article_id, pageNum = 1, limit = 10) => {
  if (pageNum % 1 !== 0 || limit % 1 !== 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  let offset = 0;

  if (pageNum > 1) {
    offset = limit * pageNum - limit;
  }
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 LIMIT ${limit} OFFSET ${offset};`,
      [article_id]
    )
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

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id =$1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
    });
};

exports.changeComment = (comment_id, vote = 0) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comments.comment_id = $2 RETURNING *;",
      [vote, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      } else {
        return rows[0];
      }
    });
};
