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
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
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
describe("GET /api/articles", () => {
  test("200:should respond with the correct length of the articles array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
      });
  });
  test("200:should respond with all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200:should respond with all comments for the passed article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(2);
      });
  });
  test("200:should respond with all comments with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test("200:should respond with all comments for the passed article_id, sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200:should respond with an empty array if there are no comments for the passed article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("400:should respond with bad request for an invalid article id", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404:should respond with Not Found when passed an id that is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment to the database and respond with newly added comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "I love owls",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("body", "I love owls");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("author", "butter_bridge");
        expect(comment).toHaveProperty("article_id", 9);
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("comment_id", 19);
      });
  });
  test("400:should respond with bad request for an invalid article id", () => {
    const testComment = {
      username: "butter_bridge",
      body: "I love owls",
    };
    return request(app)
      .post("/api/articles/NotAnId/comments")
      .expect(400)
      .send(testComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404:should respond with Not Found when passed an id that is valid but does not exist", () => {
    const testComment = {
      username: "butter_bridge",
      body: "I love owls",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .expect(404)
      .send(testComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400:should respond with Bad request when missing a required property", () => {
    const testComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .expect(400)
      .send(testComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404:should respond with Bad request when passed an username that is not a string", () => {
    const testComment = {
      username: 6,
      body: "I love owls",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .expect(404)
      .send(testComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("404:should respond with Bad request when passed an invalid username", () => {
    const testComment = {
      username: "H.Han",
      body: "I am not a registered user",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .expect(404)
      .send(testComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
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
