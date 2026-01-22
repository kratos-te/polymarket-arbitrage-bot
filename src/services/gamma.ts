export const getEvent = async (slug: string) => {
  const response = await fetch(
    `https://gamma-api.polymarket.com/events/slug/${slug}`
  );
  const event = await response.json();
  return event;
}

export const getMarket = async (slug: string) => {
  const response = await fetch(
    `https://gamma-api.polymarket.com/markets/slug/${slug}`
  );
  const market = await response.json();
  return market;
}