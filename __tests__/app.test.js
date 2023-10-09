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

describe("get endpoints", () => {
  test("should return a 200 and the list of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsJSON);
      });
  });
});
