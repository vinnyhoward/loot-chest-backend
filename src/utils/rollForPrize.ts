export function rollForPrize(chestThreshold: number) {
  const rollValue = Math.random() * 100;
  const isWinner = rollValue < chestThreshold;

  return [isWinner, rollValue];
}
