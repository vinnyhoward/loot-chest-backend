export type User = {
  id: string;
  email: string;
  fullName: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  chestInteractions: UserChestInteraction[];
  prizeLogs: PrizeLog[];
};

export type UserChestInteraction = {
  id: string;
  userId: string;
  sanityChestId: string;
  openedAt: Date;
  User: User;
};

export type PrizeLog = {
  id: string;
  userId: string;
  prizeFulfillmentId?: string;
  wonAt: Date;
  sanityChestId: string;
  rollValue: number;
  User: User;
  prizeFulfillment?: PrizeFulfillment;
};

export type PrizeFulfillment = {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  cryptoWalletAddress?: string;
  PrizeLog?: PrizeLog;
};
