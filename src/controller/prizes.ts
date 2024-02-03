import { Elysia, t } from "elysia";
import { PrizeLog, PrizeFulfillment } from "../types";

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
            prizes = await db.PrizeLog.findMany({
              where: {
                userId: user.id,
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
            prizeFulfillment = await db.PrizeFulfillment.create({
              data: {
                userId: user.id,
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
    );
  });
};
