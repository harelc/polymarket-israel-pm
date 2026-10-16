import { getStore } from "@netlify/blobs";
import { fetchAllBooks } from "./market.mjs";

export default async () => {
  const data = await fetchAllBooks();
  const store = getStore("polymarket");
  await store.setJSON("books", data);
  return new Response("saved " + data.fetchedAt);
};

export const config = {
  schedule: "*/10 * * * *"
};
