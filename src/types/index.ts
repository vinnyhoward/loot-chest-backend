export type User = {
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
};

export type UserChestInteraction = {
  id: string;
  userId: string;
  sanityChestId: string;
  openedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  User: User;
};

export type PrizeLog = {
  id: string;
  userId: string;
  prizeFulfillmentId?: string;
  wonAt: Date;
  itemWon: string;
  sanityChestId: string;
  rollValue: number;
  interactionId: string;
  createdAt: Date;
  updatedAt: Date;
  User: User;
  prizeFulfillment?: PrizeFulfillment;
};

export type PrizeFulfillment = {
  id: string;
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
  PrizeLog?: PrizeLog;
  User: User;
};
