import { Elysia, t } from "elysia";
import { User } from "../types";

export const auth = (app: Elysia) =>
  app.group("/users", (app) => {
    return app
      .post(
        "/signup",
        // @ts-ignore
        async ({ body, set, db, jwt }) => {
          const { username, email, password } = body as User;

          try {
            const hashedPassword = await Bun.password.hash(password);
            const emailExists = await db.user.findUnique({
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

            const usernameExists = await db.user.findUnique({
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

            const token = await jwt.sign({
              userId: user.id,
            });

            return {
              success: true,
              token,
              message: "Account created",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "Something went wrong.",
            };
          }
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
      .post(
        "/login",
        // @ts-ignore
        async ({ body, set, db, jwt }) => {
          const { email, password } = body as User;

          const user = await db.user.findFirst({
            where: {
              email,
            },
            select: {
              id: true,
              password: true,
              username: true,
              email: true,
            },
          });

          if (!user) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Invalid credentials",
            };
          }

          const match = await Bun.password.verify(password, user.password);
          if (!match) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Invalid credentials",
            };
          }

          const token = await jwt.sign({
            userId: user.id,
          });

          return {
            success: true,
            data: {
              username: user.username,
              email: user.email,
            },
            token,
            message: "Account login successfully",
          };
        },
        {
          body: t.Object({
            email: t.String(),
            password: t.String(),
          }),
        }
      );
  });
