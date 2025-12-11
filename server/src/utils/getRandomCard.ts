const cards = ["0", "1", "2", "3", "5", "8", "13", "21", "?", "☕"];

export const getRandomCard = (): string => {
  const possible = cards.filter((c) => c !== "?" && c !== "☕");
  const index = Math.floor(Math.random() * possible.length);
  const picked = possible[index];
  return picked;
};
