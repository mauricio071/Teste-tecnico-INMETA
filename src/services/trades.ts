import api from "./api";

interface TradeCard {
  cardId: string;
  type: "OFFERING" | "RECEIVING";
}

interface CreateTradePayload {
  cards: TradeCard[];
}

export async function createTradeAPI(
  offeredIds: string[],
  requestedIds: string[]
) {
  const cards: TradeCard[] = [
    ...offeredIds.map((id) => ({ cardId: id, type: "OFFERING" as const })),
    ...requestedIds.map((id) => ({ cardId: id, type: "RECEIVING" as const })),
  ];

  const payload: CreateTradePayload = { cards };
  const response = await api.post("/trades", payload);
  return response.data;
}

export async function fetchAllTradesAPI(page = 1, rpp = 10) {
  const response = await api.get("/trades", { params: { page, rpp } });
  return response.data;
}

export async function deleteTradeAPI(tradeId: string) {
  await api.delete(`/trades/${tradeId}`);
}
