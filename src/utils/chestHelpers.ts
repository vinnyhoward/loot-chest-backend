import { Reward, ItemRarity } from "../types";

export function calculateTierChances(
  overallWinningPercentage: number
): Record<ItemRarity, number> {
  return {
    [ItemRarity.Common]: overallWinningPercentage * 0.5,
    [ItemRarity.Uncommon]: overallWinningPercentage * 0.25,
    [ItemRarity.Rare]: overallWinningPercentage * 0.125,
    [ItemRarity.Legendary]: overallWinningPercentage * 0.0625,
    [ItemRarity.Divine]: overallWinningPercentage * 0.03125,
  };
}

export function determineWinningTier(
  tierChances: Record<ItemRarity, number>
): [ItemRarity | null, number] {
  const roll = Math.random();
  console.log("tier chances", tierChances);

  for (const tierKey of Object.keys(tierChances) as ItemRarity[]) {
    const chance = tierChances[tierKey];

    if (roll >= chance) {
      return [tierKey, roll];
    }
  }

  return [null, roll];
}

export function selectRewardFromTier(
  rewardList: Reward[],
  winningTier: ItemRarity
): Reward | null {
  const rewardsInTier = rewardList.filter((reward) => {
    console.log("reward", reward);
    console.log("winning tier", winningTier);
    return reward.itemRarity === winningTier;
  });
  console.log("rewards in tier", rewardsInTier);

  if (rewardsInTier.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * rewardsInTier.length);
  return rewardsInTier[randomIndex];
}
