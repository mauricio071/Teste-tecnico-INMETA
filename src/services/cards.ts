import type { Card } from "@/types";
import api from "./api";

export async function fetchUserCards(): Promise<Card[]> {
  try {
    const response = await api.get("/me/cards");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cartas do usuário:", error);
    throw error;
  }
}

export async function addCardToUser(cardIds: string[]): Promise<void> {
  try {
    await api.post("/me/cards", { cardIds });
  } catch (error) {
    console.error("Erro ao adicionar carta ao usuário:", error);
    throw error;
  }
}

export async function fetchAllCards(page = 1, rpp = 10): Promise<Card[]> {
  try {
    const response = await api.get("/cards", {
      params: { page, rpp },
    });
    return response.data.list;
  } catch (error) {
    console.error("Erro ao buscar todas as cartas:", error);
    throw error;
  }
}
