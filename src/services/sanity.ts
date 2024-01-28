// sanity.js
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pvz738ry",
  dataset: "development",
  token:
    "skqysugtrEeFgXBbze8TLQ8I7hbPio4xVFdg2Ev7HgEN8cLM0Ve6LGLNskKjlK3MjlGn5NmOwPKawsZI9u4WBLowVLbqZdFrZxuZHPC08QDF1jt8yYTKAabD0XdHvYqzSdVOFX8KLE4gUyDT38uMBNhqpp1HV4mOzORpjmEy9AfBpOfvkTFn",
  useCdn: true,
  apiVersion: "2023-05-03",
});
