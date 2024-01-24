import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "./services/prisma";
import { jwtConfig } from "./services/jwt-config";

const app = new Elysia()
  .decorate("db", prisma)
  .state("version", 1.0)
  .use(jwt(jwtConfig))
  .use(cookie())
  .post("/users/signup", ({ db, body }) => {
    return console.log(body);
  })
  .get("/users", ({ db }) => {
    return db.user.findMany();
  })
  .listen(process.env.API_PORT || 8020);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
