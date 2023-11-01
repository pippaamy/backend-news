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
        expect(body.article).toEqual(
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
        expect(body.articles.length).toBe(10);
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

describe("PATCH /api/articles/:article_id", () => {
  test("should increment vote up by 1", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("should increment vote down by 1", () => {
    const vote = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 99,
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("should give 404 when non-existant id", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1000")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("should give 400 when invalid id", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/banana")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should give 400 when inc_votes is not a number", () => {
    const vote = { inc_votes: "hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should give 200 when missing fields", () => {
    const vote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 100,
            article_img_url: expect.any(String),
          })
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should return a 204 when delete successful", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("should return a 404 when id is non existant ", () => {
    return request(app)
      .delete("/api/comments/303030")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("should return a 400 when id is not valid ", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET users", () => {
  test("should return a 200 and return users ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles topic query", () => {
  test("returns articles within topic given", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should give a 200 when topic exists but no articles associated with it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        expect(body.articles).toEqual([]);
      });
  });
  test("should give a 404 when non existant topic", () => {
    return request(app)
      .get("/api/articles?topic=bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id should contain comment count", () => {
  test("should include comment count property ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          })
        );
      });
  });
});

describe("GET /api/articles sorting queries", () => {
  test("should order by asc when inputted ", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("should sort by votes when inputted ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("should sort by votes and order asc when inputted ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: false });
      });
  });
  test("should sort by votes and order asc  and topic when inputted  ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: false });
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("should return 404 when invalid sort_by ", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("should return 404 when invalid order ", () => {
    return request(app)
      .get("/api/articles?order=bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("should return a 200 & username, name and avatar_url ", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
  });
  test("should return 404 if non existant user ", () => {
    return request(app)
      .get("/api/users/pipsqueak")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should return a 200 & increment vote by 1", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: 17,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("should increment vote down by 1", () => {
    const vote = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: 15,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("should give 404 when non-existant id", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1000")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
  test("should give 400 when invalid id", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/banana")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should give 400 when inc_votes is not a number", () => {
    const vote = { inc_votes: "hello" };
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should give 200 when missing fields", () => {
    const vote = {};
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: 16,
            created_at: expect.any(String),
          })
        );
      });
  });
});

describe("POST /api/articles", () => {
  test("should return a 201 and the posted comment", () => {
    const newArticle = {
      author: "lurker",
      title: "cutest doggo",
      body: "cutest dog award goes to Evie Pom",
      topic: "paper",
      article_img_url:
        " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle).toEqual(
          expect.objectContaining({
            author: "lurker",
            title: "cutest doggo",
            body: "cutest dog award goes to Evie Pom",
            topic: "paper",
            votes: 0,
            article_img_url:
              " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
            article_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("should return a 201 ignore unneccesary properties ", () => {
    const newArticle = {
      cutestLevel: "1000",
      author: "lurker",
      title: "cutest doggo",
      body: "cutest dog award goes to Evie Pom",
      topic: "paper",
      article_img_url:
        " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle).toEqual(
          expect.objectContaining({
            author: "lurker",
            title: "cutest doggo",
            body: "cutest dog award goes to Evie Pom",
            topic: "paper",
            votes: 0,
            article_img_url:
              " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
            article_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("should return a 400 if missing field", () => {
    const newArticle = {
      author: "lurker",
      body: "cutest dog award goes to Evie Pom",
      topic: "paper",
      article_img_url:
        " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return a 404 if an invalid username used", () => {
    const newArticle = {
      author: "pippa",
      title: "cutest doggo",
      body: "cutest dog award goes to Evie Pom",
      topic: "paper",
      article_img_url:
        " https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTqL8dZFRCZrk31Jzz3ie-6IAVhlllKawlX5cwWdkdbuWH7KygHS_EWX0lqVS1s0oTggzXo4v0yV_pOQ2A",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET api/articles (Pagination)", () => {
  test("should return page 1 with 10 articles ", () => {
    return request(app)
      .get("/api/articles?p=1&limit=10")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
      });
  });
  test("should return page 2 with 3 articles ", () => {
    return request(app)
      .get("/api/articles?p=2&limit=10")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(3);
      });
  });
  test("should return page 1 with 2 articles when given limit of 2 ", () => {
    return request(app)
      .get("/api/articles?p=1&limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
      });
  });
  test("should return page 1 with 2 articles when given a topic ", () => {
    return request(app)
      .get("/api/articles?p=1&limit=2&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
      });
  });
  test("should return 400 when given an invalid page num ", () => {
    return request(app)
      .get("/api/articles?p=hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("should return 400 when given an invalid limit ", () => {
    return request(app)
      .get("/api/articles?limit=hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("should have property total_count ", () => {
    return request(app)
      .get("/api/articles?p=1&limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(2);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("total_count");
          expect(article.total_count).toBe(13);
        });
      });
  });
});
