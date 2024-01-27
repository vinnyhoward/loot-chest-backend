export function rollForPrize(chestThreshold) {
  const roll = Math.random() * 100;
  console.log("current roll: ", roll);
  return roll < chestThreshold;
}
