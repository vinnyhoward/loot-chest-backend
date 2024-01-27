export function rollForPrize(chestThreshold) {
  const roll = Math.random() * 100;
  return roll < chestThreshold;
}
