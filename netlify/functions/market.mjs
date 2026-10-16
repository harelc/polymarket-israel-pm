import people from "../../report/candidates.json" with { type: "json" };

export const PEOPLE = people;

function slim(book) {
  const keep = (rows) => (rows || []).map((row) => ({ price: row.price, size: row.size }));
  return { bids: keep(book.bids), asks: keep(book.asks) };
}

async function book(token) {
  const response = await fetch("https://clob.polymarket.com/book?token_id=" + token);
  if (!response.ok) throw new Error("Polymarket book " + response.status);
  return slim(await response.json());
}

export async function fetchAllBooks() {
  const books = {};
  await Promise.all(PEOPLE.map(async (person) => {
    const [yes, no] = await Promise.all([book(person.yes), book(person.no)]);
    books[person.name] = { yes, no };
  }));
  return { fetchedAt: new Date().toISOString(), books };
}
