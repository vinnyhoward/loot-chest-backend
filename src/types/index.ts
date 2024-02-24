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
  UserKey: UserKey[];
}

export interface UserKey {
  id: string;
  userId: string;
  awardedAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  User: User;
  chestInteractions: UserChestInteraction[];
}

export interface SanityChest {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  chestInteractions: UserChestInteraction[];
  prizeLogs: PrizeLog[];
}

export interface UserChestInteraction {
  id: string;
  userId: string;
  userKeyId: string;
  sanityChestId: string;
  openedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  User: User;
  SanityChest: SanityChest;
  UserKey: UserKey | null;
}

export interface PrizeLog {
  id: string;
  userId: string;
  prizeFulfillmentId: string | null;
  wonAt: Date;
  itemWon: string;
  sanityChestId: string;
  rollValue: number;
  interactionId: string;
  createdAt: Date;
  updatedAt: Date;
  User: User;
  prizeFulfillment: PrizeFulfillment | null;
  SanityChest: SanityChest;
}

export interface PrizeFulfillment {
  id: string;
  sanityRewardId: string;
  claimedAt: Date | null;
  claimed: boolean;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
  createdAt: Date;
  updatedAt: Date;
  cryptoWalletAddress: string | null;
  PrizeLog: PrizeLog | null;
  User: User;
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
