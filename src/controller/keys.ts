import { Elysia, t } from "elysia";

export const keys = (app: Elysia) => {
  return app.group(
    "/keys",
    // @ts-ignore
    (app) => {
      return (
        app
          // @ts-ignore
          .get("/award", async ({ user, set, db }) => {
            if (!user) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Access denied. Please log in to proceed.",
              };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const keysAwardedToday = await db.userKey.findMany({
              where: {
                userId: user.id,
                awardedAt: {
                  gte: today,
                },
              },
            });

            if (keysAwardedToday.length === 0) {
              for (let i = 0; i < 3; i++) {
                await db.userKey.create({
                  data: {
                    userId: user.id,
                    awardedAt: new Date(),
                  },
                });
              }

              set.status = 200;
              return {
                success: true,
                data: null,
                message: "3 keys have been successfully awarded.",
              };
            } else {
              set.status = 200;
              return {
                success: false,
                data: null,
                message: "Keys have already been awarded today.",
              };
            }
          })
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
};
