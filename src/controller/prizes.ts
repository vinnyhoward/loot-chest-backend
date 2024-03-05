import { Elysia, t } from "elysia";
import { PrizeLog, PrizeFulfillment, ChestResponse } from "../types";

export const prizes = (app: Elysia) => {
  return app.group("/prizes", (app) => {
    return (
      app
        // @ts-ignore
        .get("/me", async ({ user, set, db }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Access denied. Please log in to proceed.",
            };
          }

          let prizes: PrizeLog[] = [];
          try {
            prizes = await db.prizeLog.findMany({
              where: {
                userId: user.id,
              },
              select: {
                id: true,
                wonAt: true,
                itemWon: true,
                sanityChestId: true,
                chestInteractionId: true,
                rewardImageRef: true,
                createdAt: true,
                updatedAt: true,
                prizeFulfillment: {
                  select: {
                    id: true,
                    claimed: true,
                    claimedAt: true,
                    sanityRewardId: true,
                  },
                },
              },
            });

            set.status = 200;
            return {
              success: true,
              data: prizes,
              message: "Successfully fetched user's prizes",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "An error occurred while fetching user's prizes.",
            };
          }
        })
        .get(
          "user/:id",
          // @ts-ignore
          async ({ user, set, db, params }) => {
            if (!user) {
              set.status = 401;
              return {
                success: false,
                data: null,
                message: "Access denied. Please log in to proceed.",
              };
            }

            if (!user.isAdmin) {
              set.status = 403;
              return {
                success: false,
                data: null,
                message: "Access denied. You are not an admin.",
              };
            }

            const { id: userId } = params;

            let prize: PrizeLog[] = [];
            try {
              prize = await db.PrizeLog.findMany({
                where: {
                  userId,
                },
                select: {
                  id: true,
                  prizeFulfillmentId: true,
                  wonAt: true,
                  itemWon: true,
                  sanityChestId: true,
                  interactionId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              });

              if (!prize || Object.keys(prize).length === 0) {
                set.status = 404;
                return {
                  success: false,
                  data: null,
                  message: "Prize not found.",
                };
              }

              set.status = 200;
              return {
                success: true,
                data: prize,
                message: "Successfully fetched prize",
              };
            } catch (error) {
              set.status = 500;
              return {
                success: false,
                data: null,
                message: "An error occurred while fetching the user's prize.",
              };
            }
          },
          {
            params: t.Object({
              id: t.String(),
            }),
          }
        )
        // @ts-ignore
        .post("/fulfillment", async ({ user, set, db, body }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Access denied. Please log in to proceed.",
            };
          }

          const {
            prizeLogId,
            sanityRewardId,
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            country,
            state,
            city,
            zip,
            createdAt,
            updatedAt,
            cryptoWalletAddress,
          } = body as PrizeFulfillment;

          let prizeFulfillment: PrizeFulfillment | null = null;
          try {
            const doesPrizeIdExist = await db.prizeFulfillment.findUnique({
              where: {
                sanityRewardId: sanityRewardId,
                userId: user.id,
                claimed: false,
                prizeLogId,
              },
              select: {
                id: true,
                claimed: true,
                claimedAt: true,
                sanityRewardId: true,
                prizeLogId: true,
              },
            });

            if (!doesPrizeIdExist) {
              set.status = 404;
              return {
                success: false,
                data: null,
                message: "Prize does not exist.",
              };
            }

            if (doesPrizeIdExist && doesPrizeIdExist.claimed) {
              set.status = 404;
              return {
                success: false,
                data: null,
                message: "Prize has already been claimed.",
              };
            }

            if (doesPrizeIdExist.sanityRewardId !== sanityRewardId) {
              set.status = 404;
              return {
                success: false,
                data: null,
                message: "Prize does not exist.",
              };
            }

            if (doesPrizeIdExist.prizeLogId !== prizeLogId) {
              set.status = 404;
              return {
                success: false,
                data: null,
                message: "Prize log does not exist.",
              };
            }
            const today = new Date();
            prizeFulfillment = await db.prizeFulfillment.update({
              where: {
                id: doesPrizeIdExist.id,
              },
              data: {
                sanityRewardId,
                claimedAt: today,
                claimed: true,
                user: {
                  connect: { id: user.id },
                },
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                country,
                state,
                city,
                zip,
                createdAt,
                updatedAt,
                cryptoWalletAddress,
              },
            });

            set.status = 200;
            return {
              success: true,
              data: prizeFulfillment,
              message: "Successfully updated created prize fulfillment",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "An error occurred while fetching the user's prize.",
            };
          }
        })
        // @ts-ignore
        .get("/:id/fulfillment", async ({ user, params, set, db }) => {
          if (!user) {
            set.status = 401;
            return {
              success: false,
              data: null,
              message: "Access denied. Please log in to proceed.",
            };
          }

          const { id: prizeFulfillmentId } = params;

          let prizeFulfillment: PrizeFulfillment | null = null;
          try {
            prizeFulfillment = await db.PrizeFulfillment.findUnique({
              where: {
                id: prizeFulfillmentId,
              },
              select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true,
                address: true,
                country: true,
                state: true,
                city: true,
                zip: true,
                createdAt: true,
                updatedAt: true,
                cryptoWalletAddress: true,
              },
            });

            if (!prizeFulfillment) {
              set.status = 404;
              return {
                success: false,
                data: null,
                message: "Prize fulfillment not found.",
              };
            }

            set.status = 200;
            return {
              success: true,
              data: prizeFulfillment,
              message: "Successfully fetched prize",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "An error occurred while fetching the user's prize.",
            };
          }
        })
        // @ts-ignore
        .get("/all", async ({ set, db, query }) => {
          const page: number = parseInt(query.page as string) || 1;
          const limit: number = parseInt(query.limit as string) || 10;
          const skip: number = (page - 1) * limit;

          let prizes: PrizeLog[] = [];
          try {
            prizes = await db.prizeLog.findMany({
              select: {
                id: true,
                wonAt: true,
                itemWon: true,
                createdAt: true,
                updatedAt: true,
                sanityChestId: true,
                rewardImageRef: true,
                user: {
                  select: {
                    username: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: limit,
              skip: skip,
            });

            const totalCount = await db.prizeLog.count();
            const totalPages = Math.ceil(totalCount / limit);

            set.status = 200;
            return {
              success: true,
              data: prizes,
              message: "Successfully fetched all prizes",
              pagination: {
                currentPage: page,
                limit,
                totalPages,
                totalCount,
              },
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              data: null,
              message: "An error occurred while fetching all prizes.",
            };
          }
        })
    );
  });
};
