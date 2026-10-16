import { getStore } from "@netlify/blobs";
import { fetchAllBooks } from "./market.mjs";

const MAX_AGE_MS = 10 * 60 * 1000;

export default async () => {
  const store = getStore("polymarket");
  let data = await store.get("books", { type: "json" });
  const age = data ? Date.now() - Date.parse(data.fetchedAt) : Infinity;
  if (!data || age > MAX_AGE_MS) {
    data = await fetchAllBooks();
    await store.setJSON("books", data);
  }
  return Response.json(data, {
    headers: {
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*"
    }
  });
};
