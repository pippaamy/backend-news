const { off } = require("../app");
const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  WHERE articles.article_id =$1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectArticles = (
  topic,
  order = "desc",
  sort_by = "created_at",
  pageNum = 1,
  limit = 10
) => {
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
  let queryStr = "";
  let value = [];
  const orderValues = ["ASC", "DESC", "asc", "desc"];
  const sortValues = ["created_at", "votes", "article_id", "author", "title"];
  if (!orderValues.includes(order) || !sortValues.includes(sort_by)) {
    return Promise.reject({
      status: 404,
      msg: "Path not found",
    });
  }

  if (topic) {
    queryStr += "WHERE topic = $1";
    value.push(topic);
  }

  return db.query(" SELECT * FROM articles;").then(({ rows }) => {
    total = rows.length;
    return db
      .query(
        `SELECT articles.title,articles.article_id,articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON  comments.article_id = articles.article_id ${queryStr} GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset} `,
        value
      )
      .then(({ rows }) => {
        return (result = rows.map((obj) => {
          obj.total_count = total;
          return obj;
        }));
      });
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

exports.changeArticle = (article_id, vote = 0) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *;",
      [vote, article_id]
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

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE users.username = $1;", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return rows[0];
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

exports.createArticle = (author, title, body, topic, article_img_url) => {
  if (!author || !title || !body || !topic || !article_img_url) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db
    .query(
      "INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ( $1, $2, $3, $4, $5) RETURNING *;",
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
