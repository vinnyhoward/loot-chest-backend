import { Elysia, t } from "elysia";
import { UserChestInteraction, ChestResponse, Reward, UserKey } from "../types";
import {
  calculateTierChances,
  determineWinningTier,
  selectRewardFromTier,
} from "../utils/chestHelpers";

export const chests = (app: Elysia) => {
  return app.group("/chests", (app) => {
    return (
      app
        // @ts-ignore
        .get("/all", async ({ user, set, cms }) => {
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

          set.status = 200;
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

            const { id: chestId } = params;
            const { userId, keyId } = body;

            if (!userId || !keyId) {
              set.status = 400;
              return {
                success: false,
                data: null,
                message: "userId and keyId are required.",
              };
            }

            if (user.id !== userId) {
              set.status = 403;
              return {
                success: false,
                data: null,
                message:
                  "Access forbidden. You cannot open a chest on behalf of another user.",
              };
            }
            console.log("1", {
              userId,
              keyId,
              chestId,
            });
            try {
              const interaction = await db.userChestInteraction.create({
                data: {
                  User: {
                    connect: { id: userId },
                  },
                  UserKey: {
                    connect: { id: keyId },
                  },
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

              const tierChances = calculateTierChances(
                chest.rarityList.overallWinningPercentage
              );

              if (!tierChances) {
                set.status = 500;
                return {
                  success: false,
                  data: null,
                  message:
                    "An error occurred while trying to calculate tier chances. Please try again later.",
                };
              }
              const [winningTier, rollValue] =
                determineWinningTier(tierChances);
              let prize: UserChestInteraction[] = [];
              let keys: UserKey[] = [];

              console.log("winning tier", winningTier);
              console.log("roll:", rollValue);

              if (winningTier) {
                const selectedReward = selectRewardFromTier(
                  chest.rewardList,
                  winningTier
                );

                if (selectedReward) {
                  console.log("2");
                  prize = await db.PrizeLog.create({
                    data: {
                      userId,
                      wonAt: new Date(),
                      itemWon: selectedReward.rewardName,
                      sanityChestId: chestId,
                      interactionId: interaction.id,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      rollValue,
                    },
                  });
                  console.log("3");
                  const userKey = await db.userKey.findFirst({
                    where: {
                      id: keyId,
                      userId: userId,
                      usedAt: null,
                    },
                  });

                  if (!userKey) {
                    set.status = 400;
                    return {
                      success: false,
                      data: null,
                      message: "Invalid or already used key.",
                    };
                  }

                  console.log("4");
                  keys = await db.userKey.update({
                    where: {
                      id: keyId,
                    },
                    data: {
                      usedAt: new Date(),
                    },
                  });

                  const lootChestKey = selectedReward._key;
                  const sanityRewardListKey = `rewardList[_key == "${lootChestKey}"].itemInventory`;
                  await cms
                    .transaction([
                      {
                        patch: {
                          id: chestId,
                          dec: {
                            [sanityRewardListKey]: 1,
                          },
                        },
                      },
                    ])
                    .commit();
                }
              }

              set.status = 200;
              return {
                success: true,
                data: { interaction, prize, keys },
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
              keyId: t.String(),
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
            const interactions = await db.userChestInteraction.findMany({
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

            set.status = 200;
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
