import { PrismaClient } from "../../prisma/node_modules/.prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
