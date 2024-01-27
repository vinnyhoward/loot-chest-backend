import { Elysia, t } from "elysia";
import { UserChestInteraction } from "../types";
import { isAuthenticated } from "../middleware/isAuthenticated";

export const chests = (app: Elysia) => {
  return app.group("/chests", (app) => {
    return (
      app
        .use(isAuthenticated)
        .get("/all", async ({ user, set }) => {
          // TODO: Fetch all chests from Sanity and return here
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
              message: "Unauthorized Credentials",
            };
          }
          return {
            message: "You are authenticated and are fetching chests!",
          };
        })
        // @ts-ignore
        .post("/:id/open", async ({ user, db, set, body, params }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Access denied. Please log in to proceed.",
            };
          }

          const { id: chestId } = params as { id: string };
          const { userId } = body as { userId: string };

          if (user.id !== userId) {
            set.status = 403;
            return {
              success: false,
              data: null,
              message:
                "Access forbidden. You cannot open a chest on behalf of another user.",
            };
          }

          try {
            const interaction = await db.UserChestInteraction.create({
              data: {
                userId,
                sanityChestId: chestId,
                openedAt: new Date(),
                updatedAt: new Date(),
              },
            });

            // Calculate the roll value
            // will add later

            return {
              success: true,
              data: interaction,
              message: "Chest opened successfully.",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message:
                "An error occurred while trying to open the chest. Please try again later.",
            };
          }
        })
    );
  });
};
