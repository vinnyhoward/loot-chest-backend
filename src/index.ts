import { Elysia } from "elysia";
import { auth } from "./controller/auth";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "./services/jwt";
import { prisma } from "./services/prisma";

const app = new Elysia()
  .decorate("db", prisma)
  .state("version", 1.0)
  .use(jwt(jwtConfig))
  .use(auth)
  .listen(process.env.API_PORT || 8020);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
