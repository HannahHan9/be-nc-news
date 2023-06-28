const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200:should respond with the correct length of the topics array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3);
      });
  });
  test("200:should respond with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});
describe("GET /api", () => {
  test("200:should respond with the contents of endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(data);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200:should respond with an individual article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("title", expect.any(String));
        expect(body.article).toHaveProperty("topic", expect.any(String));
        expect(body.article).toHaveProperty("author", expect.any(String));
        expect(body.article).toHaveProperty("body", expect.any(String));
        expect(body.article).toHaveProperty("created_at", expect.any(String));
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  test("400:should respond with bad request for an invalid article id", () => {
    return request(app)
      .get("/api/articles/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404:should respond with Not Found when passed an id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200:should respond with the correct length of the comments array", () => {
    return request(app)
      .get("/api/articles/:article_id/comments")
      .expect(200)
      .then(({body}) => {
        const {comments} = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(body.topics.length).toBe(3);
      });
  });
  test("200:should respond with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        
        
    
        });
      });
  });
describe("All non-existent path", () => {
  test("404: should return a custom error message when the path is not found", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found");
      });
  });
});
