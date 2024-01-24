import { Elysia } from "elysia";
import { prisma } from "./services/prisma";

const app = new Elysia()
  .decorate("db", prisma)
  .state("version", 1.0)
  .get("/users", ({ db }) => {
    return db.user.findMany();
  })
  .listen(process.env.API_PORT || 8020);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
