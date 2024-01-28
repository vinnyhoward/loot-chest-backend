import { Elysia } from "elysia";

export const logs = (app: Elysia) => {
  return app.get("/health-check", async ({ set }) => {
    set.status = 200;
    return {
      success: true,
      data: null,
      message: "success!",
    };
  });
};
