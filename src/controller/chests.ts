import { Elysia, t } from "elysia";
import { UserChestInteraction } from "../types";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { rollForPrize } from "../utils/rollForPrize";

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

            // Mocking a chest win threshold for now
            const mockChestWinThreshold = 5.75; // 0.0 - 100.0
            let prize = null;
            if (rollForPrize(mockChestWinThreshold)) {
              prize = await db.PrizeLog.create({
                data: {
                  userId,
                  wonAt: new Date(),
                  itemWon: "Test Prize",
                  sanityChestId: chestId,
                  rollValue: mockChestWinThreshold,
                  interactionId: interaction.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            }

            return {
              success: true,
              data: { interaction, prize },
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
        // @ts-ignore
        .get("/me/interactions", async ({ user, db, set }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Access denied. Please log in to proceed.",
            };
          }

          try {
            const interactions = await db.UserChestInteraction.findMany({
              where: {
                userId: user.id,
              },
              select: {
                id: true,
                sanityChestId: true, // as id to fetch chest details from sanity,
                openedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            });

            return {
              success: true,
              data: interactions,
              message: "Successfully fetched user interactions.",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message:
                "An error occurred while trying to fetch user interactions. Please try again later.",
            };
          }
        })
    );
  });
};
