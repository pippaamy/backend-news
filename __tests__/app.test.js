const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});

describe("GET topics", () => {
  test("should return  a 200 and topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("Error handling for non-existant paths", () => {
  test("should return a 404 when given a non-existant path", () => {
    return request(app)
      .get("/api/tooopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET endpoints", () => {
  test("should return a 200 and the list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsJSON);
      });
  });
});

describe("GET api/articles/:article_id", () => {
  test("should return a 200 and an article list with all the correct properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        body.article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
  test("should return a 400 if invalid id used", () => {
    return request(app)
      .get("/api/articles/turtle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return a 404 if non-existant id used", () => {
    return request(app)
      .get("/api/articles/9090909")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("should return a 200 and list of the articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("should return the articles in descending order of created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should return a 200 with the correct properties in the comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("should return 200 when article exists but no comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("should return a 400 if invalid id used", () => {
    return request(app)
      .get("/api/articles/turtle/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return a 404 if non-existant id used", () => {
    return request(app)
      .get("/api/articles/9090909/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("POST /api/articles/article:id/comments", () => {
  test("should return a 201 and posted comment", () => {
    const newComment = { username: "butter_bridge", body: "let's goooooo!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "let's goooooo!",
            article_id: expect.any(Number),
          })
        );
      });
  });

  test("should return a 201 and posted comment ignoring unneeded properties", () => {
    const newComment = {
      username: "butter_bridge",
      body: "whoop!",
      date: "NOW!!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "whoop!",
            article_id: expect.any(Number),
          })
        );
      });
  });
  test("should return a 404 if non-existant id used", () => {
    const newComment = { username: "butter_bridge", body: "let's goooooo!" };
    return request(app)
      .post("/api/articles/9090909/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("should return a 400 if an invalid id used", () => {
    const newComment = { username: "butter_bridge", body: "let's goooooo!" };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return a 400 if missing field", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return a 404 if an invalid username used", () => {
    const newComment = { username: "pippa", body: "let's goooooo!" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
