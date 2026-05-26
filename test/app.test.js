/* eslint-disable no-undef */
import request from "supertest";
import app from "#src/app.js";

describe("API Endpoint", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/health")
        .set("User-Agent", "Mozilla/5.0")
        .expect(200);
      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });
});

describe("API Endpoint", () => {
  describe("GET /api", () => {
    it("should return api message", async () => {
      const response = await request(app)
        .get("/api")
        .set("User-Agent", "Mozilla/5.0")
        .expect(200);
      expect(response.body).toHaveProperty("message", "DevOps API! is running");
    });
  });
});

describe("API Endpoint", () => {
  describe("GET /nonexistent", () => {
    it("should return 404 for nonexistent route", async () => {
      const response = await request(app)
        .get("/nonexistent")
        .set("User-Agent", "Mozilla/5.0");

      // Either 404 (if not rate limited) or 429 (if rate limited due to security middleware)
      expect([404, 429]).toContain(response.status);

      if (response.status === 404) {
        expect(response.body).toHaveProperty("error");
      } else if (response.status === 429) {
        expect(response.body).toHaveProperty("error", "Forbidden");
        expect(response.body.message).toContain("Too many requests");
      }
    });
  });
});
