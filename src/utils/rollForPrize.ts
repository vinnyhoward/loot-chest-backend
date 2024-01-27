export function rollForPrize(chestThreshold: number) {
  const roll = Math.random() * 100;
  console.log("current roll: ", roll);
  return roll < chestThreshold;
}
