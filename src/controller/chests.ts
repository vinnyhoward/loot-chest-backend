import { Elysia, t } from "elysia";
import { ChestResponse, Reward, UserKey, PrizeFulfillment } from "../types";
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

            try {
              const interaction = await db.userChestInteraction.create({
                data: {
                  user: {
                    connect: { id: userId },
                  },
                  userKey: {
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
              let prize: PrizeFulfillment | null = null;
              let prizeFulfillment: PrizeFulfillment | null = null;
              let keys: UserKey[] = [];

              if (winningTier) {
                const selectedReward = selectRewardFromTier(
                  chest.rewardList,
                  winningTier
                );

                if (selectedReward) {
                  prize = await db.prizeLog.create({
                    data: {
                      user: {
                        connect: { id: userId },
                      },
                      wonAt: new Date(),
                      itemWon: selectedReward.rewardName,
                      sanityChestId: chestId,
                      rewardImageRef: selectedReward.rewardImage.asset._ref,
                      chestInteraction: {
                        connect: { id: interaction.id },
                      },
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      rollValue,
                    },
                  });

                  prizeFulfillment = await db.prizeFulfillment.create({
                    data: {
                      user: {
                        connect: { id: userId },
                      },
                      prizeLog: {
                        connect: { id: prize!.id },
                      },
                      sanityRewardId: selectedReward._key,
                      claimed: false,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  });

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

              await db.userKey.update({
                where: {
                  id: keyId,
                },
                data: {
                  usedAt: new Date(),
                },
              });

              keys = await db.userKey.findMany({
                where: {
                  userId: userId,
                  usedAt: null,
                },
                select: {
                  id: true,
                },
              });

              set.status = 200;
              return {
                success: true,
                isWinner: !!prize,
                data: { interaction, prize, keys, prizeFulfillment },
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
