// sanity.js
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_SECRET_TOKEN || "",
  useCdn: true,
  apiVersion: "2023-05-03",
});
