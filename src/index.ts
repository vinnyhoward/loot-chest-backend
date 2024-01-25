import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { auth } from "./controller/auth";
import { sanityClient } from "./services/sanity";
import { jwtConfig } from "./services/jwt";
import { prisma } from "./services/prisma";

const app = new Elysia()
  .use(cors())
  .decorate("db", prisma)
  .decorate("sanity", sanityClient)
  .state("version", 1.0)
  .use(jwt(jwtConfig))
  .use(auth)
  .listen(process.env.API_PORT || 8020);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
