export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  chestInteractions: UserChestInteraction[];
  prizeLogs: PrizeLog[];
  prizeFulfillments: PrizeFulfillment[];
  userKeys: UserKey[];
}

export interface UserKey {
  id: string;
  userId: string;
  awardedAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  chestInteractions: UserChestInteraction[];
}

export interface UserChestInteraction {
  id: string;
  userId: string;
  userKeyId: string;
  sanityChestId?: string;
  openedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  userKey?: UserKey;
  prizeLogs: PrizeLog[];
}

export interface PrizeLog {
  id: string;
  userId: string;
  chestInteractionId: string;
  wonAt: Date;
  itemWon: string;
  sanityChestId: string;
  rollValue: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  chestInteraction: UserChestInteraction;
  prizeFulfillment?: PrizeFulfillment;
}

export interface PrizeFulfillment {
  id: string;
  sanityRewardId: string;
  prizeLogId: string;
  claimedAt: Date;
  claimed: boolean;
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  createdAt: Date;
  updatedAt: Date;
  cryptoWalletAddress?: string;
  user?: User;
  prizeLog?: PrizeLog;
}

export type ChestResponse = {
  chestDescription: string;
  rewardList: Reward[];
  _rev: string;
  _type: string;
  _createdAt: string;
  chestImage: ChestImage;
  _updatedAt: string;
  chestName: string;
  isHidden: boolean;
  chestModel: string;
  chestIcon: ChestIcon;
  createdBy: string;
  rarityList: {
    overallWinningPercentage: number;
  };
  _id: string;
};

export enum ItemRarity {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Legendary = "legendary",
  Divine = "divine",
}

export type Reward = {
  rewardImage: RewardImage;
  formFields: string[];
  _key: string;
  itemRarity: ItemRarity;
  rewardName: string;
  itemInventory: number;
  _type: string;
  rewardDescription: string;
};

export type RewardImage = {
  asset: AssetReference;
  _type: string;
};

export type ChestImage = {
  _type: string;
  asset: AssetReference;
};

export type ChestIcon = {
  _type: string;
  asset: AssetReference;
};

export type AssetReference = {
  _ref: string;
  _type: string;
};
