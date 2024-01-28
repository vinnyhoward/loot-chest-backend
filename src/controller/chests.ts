import { Elysia, t } from "elysia";
import { UserChestInteraction, ChestResponse, Reward } from "../types";
import { rollForPrize } from "../utils/rollForPrize";

export const chests = (app: Elysia) => {
  return app.group("/chests", (app) => {
    return (
      app
        // @ts-ignore
        .get("/all", async ({ user, set, cms }) => {
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

          let chests: ChestResponse[] = [];
          try {
            chests = await cms.fetch('*[_type == "lootchest"]');
          } catch {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "An error occurred while fetching chests.",
            };
          }

          return {
            success: true,
            data: chests,
            message: "You are authenticated and are fetching chests!",
          };
        })
        .post(
          "/:id/open",
          // @ts-ignore
          async ({ user, db, cms, set, body, params }) => {
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

              const chest: ChestResponse | null = await cms.fetch(
                `*[_type == "lootchest" && _id == "${chestId}"][0]`
              );

              if (!chest) {
                set.status = 404;
                return {
                  success: false,
                  data: null,
                  message: "Chest not found.",
                };
              }

              const selectedReward: Reward =
                chest.rewardList[
                  Math.floor(Math.random() * chest.rewardList.length)
                ];

              let prize: UserChestInteraction[] = [];
              const winPercentage = selectedReward.winPercentage * 100;
              const [isWinner, rollValue] = rollForPrize(winPercentage);

              if (isWinner) {
                prize = await db.PrizeLog.create({
                  data: {
                    userId,
                    wonAt: new Date(),
                    itemWon: selectedReward.rewardName,
                    sanityChestId: chestId,
                    rollValue,
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
          },
          {
            body: t.Object({
              userId: t.String(),
            }),
            params: t.Object({
              id: t.String(),
            }),
          }
        )
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
