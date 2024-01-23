import { Elysia } from "elysia";
import { db } from "./services/db";

const app = new Elysia()
  .decorate("db", async () => db)
  .state("version", 1.0)
  .post("/", async ({ db, body }) => {
    // testing elysia and pg
    const { username, password } = body;
    const result = await db(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
      [username, password]
    );
    console.log("result1:", await result);
    return body;
  })
  .get("/get-user", async ({ db }) => {
    const result = await db(`SELECT * FROM users`);
    console.log("result2:", await result);
    return result;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
