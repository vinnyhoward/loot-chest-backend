import { Elysia, t } from "elysia";
import { Pool } from "pg";
// import { db } from "./services/db";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const app = new Elysia()
  .state("version", 1.0)
  .post("/", () => "Hello World!", {
    body: t.Object({
      name: t.String(),
    }),
  })
  .get("/get-user", async () => {
    return {};
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
