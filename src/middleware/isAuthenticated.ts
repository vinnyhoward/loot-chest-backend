import { Elysia, t } from "elysia";

export const isAuthenticated = (app: Elysia) =>
  // @ts-ignore
  app.derive(async ({ headers, set, db, jwt }) => {
    const { authorization } = headers;
    if (!authorization) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message:
          "Authorization header is missing. Please include an authorization header to access this resource.",
      };
    }

    if (!authorization.startsWith("Bearer ")) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message:
          "Authorization header format is invalid. Expected format: 'Bearer [token]'.",
      };
    }

    try {
      const token = authorization.split(" ")[1];
      const { userId } = await jwt.verify(token);

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
        },
      });

      if (!user) {
        set.status = 401;
        return {
          success: false,
          data: null,
          message: "The token provided does not correspond to a valid user.",
        };
      }

      return { user };
    } catch (error) {
      set.status = 401;
      return {
        success: false,
        data: null,
        message: "Failed to authenticate token. Please provide a valid token.",
      };
    }
  });
