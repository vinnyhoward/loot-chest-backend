import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
// import { rateLimit } from "elysia-rate-limit";
import { isAuthenticated } from "./middleware/isAuthenticated";
import { logs } from "./controller/logs";
import { auth } from "./controller/auth";
import { chests } from "./controller/chests";
import { prizes } from "./controller/prizes";
import { keys } from "./controller/keys";
import { sanityClient } from "./services/sanity";
import { jwtConfig } from "./services/jwt";
import { prisma } from "./services/prisma";

const app = new Elysia()
  .use(cors())
  // .use(rateLimit())
  .decorate("db", prisma)
  .decorate("cms", sanityClient)
  .state("version", 1.0)
  .use(jwt(jwtConfig))
  .use(logs)
  .use(isAuthenticated)
  .use(auth)
  .use(prizes)
  .use(chests)
  .use(keys)
  .listen(process.env.PORT || 3001, () => {
    console.log("Server is running.", process.env.PORT || 3001);
  });

console.log("Port number:", process.env.PORT || 3001);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
