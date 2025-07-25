export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  ownerId?: string;
}

export type TradeCardType = "OFFERING" | "RECEIVING";

export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: {
    id: string;
    type: TradeCardType;
    card: Card;
  }[];
}

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: "OFFERING" | "RECEIVING";
  card: Card;
}

export interface TradeResponse {
  id: string;
  userId: string;
  user?: {
    name: string;
  };
  tradeCards: TradeCard[];
  createdAt: string;
}
