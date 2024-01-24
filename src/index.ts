import { Elysia, t } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "./services/prisma";
import { User } from "./types";
import { jwtConfig } from "./services/jwt-config";

const app = new Elysia()
  .decorate("db", prisma)
  .state("version", 1.0)
  .use(jwt(jwtConfig))
  .use(cookie())
  .post(
    "/users/signup",
    async ({ body, set, db, jwt }) => {
      const { username, email, password } = body as User;
      const hashedPassword = await Bun.password.hash(password);
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (emailExists) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "Email address already in use.",
        };
      }

      const usernameExists = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });

      if (usernameExists) {
        set.status = 400;
        return {
          success: false,
          data: null,
          message: "Someone already taken this username.",
        };
      }

      const user = await db.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
        },
      });

      return {
        token: jwt.sign({ id: user.id }),
      };
    },
    {
      body: t.Object({
        username: t.String(),
        email: t.String(),
        password: t.String({
          minLength: 8,
        }),
      }),
    }
  )
  .get("/users", ({ db }) => {
    return db.user.findMany();
  })
  .listen(process.env.API_PORT || 8020);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
