import { Elysia, t } from "elysia";
import { User } from "../types";

export const auth = (app: Elysia) =>
  app.group("/users", (app) => {
    return (
      app
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

              set.status = 200;
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

            set.status = 200;
            return {
              success: true,
              data: {
                id: user.id,
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
        )
        .get(
          "/me",
          // @ts-ignore
          async ({ db, user, headers, set }) => {
            const { userid: userId } = headers;

            if (!user) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Authentication failed: User credentials not provided or invalid.",
              };
            }

            if (!userId) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Bad request: User ID is missing in the request headers.",
              };
            }

            if (user.id !== userId) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Forbidden: You do not have permission to access this user's data.",
              };
            }

            const userExists = await db.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                id: true,
                username: true,
                email: true,
              },
            });

            if (!userExists) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Unauthorized Access",
              };
            }

            set.status = 200;
            return {
              success: true,
              data: userExists,
              message: "User fetched successfully",
            };
          },
          {
            headers: t.Object({
              userid: t.String(),
            }),
          }
        )
        .put(
          "/me",
          // @ts-ignore
          async ({ db, user, headers, set, body }) => {
            const { userid: userId } = headers;
            const { username, email } = body as User;
            if (!username || !email) {
              set.status = 400;
              return {
                success: false,
                data: null,
                message: "Bad request: Username or email is missing.",
              };
            }

            if (!user) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Authentication failed: User credentials not provided or invalid.",
              };
            }

            if (!userId) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Bad request: User ID is missing in the request headers.",
              };
            }

            if (user.id !== userId) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message:
                  "Forbidden: You do not have permission to access this user's data.",
              };
            }

            const userExists = await db.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                id: true,
                username: true,
                email: true,
              },
            });

            if (!userExists) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Unauthorized Access",
              };
            }

            try {
              const updatedUser = await db.user.update({
                where: {
                  id: userId,
                },
                data: {
                  username,
                  email,
                },
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              });

              set.status = 200;
              return {
                success: true,
                data: updatedUser,
                message: "User updated successfully",
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
            headers: t.Object({
              userid: t.String(),
            }),
            body: t.Object({
              username: t.String(),
              email: t.String(),
            }),
          }
        )
        // @ts-ignore
        .get("/all", async ({ db, set, user }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Unauthorized",
            };
          }

          if (!user.isAdmin) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Unauthorized Access",
            };
          }

          try {
            const users = await db.user.findMany({
              select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
              },
            });

            set.status = 200;
            return {
              success: true,
              data: users,
              message: "Users fetched successfully",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "Something went wrong.",
            };
          }
        })
        .get(
          "/:id",
          // @ts-ignore
          async ({ db, set, user, params }) => {
            const { id } = params as { id: string };
            if (!user) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Unauthorized",
              };
            }

            if (!user.isAdmin) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Unauthorized Access",
              };
            }

            try {
              const user = await db.user.findUnique({
                where: {
                  id,
                },
                select: {
                  id: true,
                  username: true,
                  email: true,
                  isAdmin: true,
                  createdAt: true,
                  updatedAt: true,
                },
              });

              if (!user) {
                set.status = 404;
                return {
                  success: false,
                  data: null,
                  message: "User not found",
                };
              }

              set.status = 200;
              return {
                success: true,
                data: user,
                message: "User fetched successfully",
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
            params: t.Object({
              id: t.String(),
            }),
          }
        )
    );
  });
