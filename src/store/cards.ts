import { defineStore } from "pinia";
import type { Card } from "@/types";
import { fetchUserCards, addCardToUser, fetchAllCards } from "@/services/cards";

export const useCardsStore = defineStore("cards", {
  state: () => ({
    userCards: [] as Card[],
    allCards: [] as Card[],
    loadingAll: false,
  }),
  actions: {
    async loadUserCards() {
      this.userCards = await fetchUserCards();
    },
    async loadAllCards(page: number, rpp: number) {
      this.loadingAll = true;
      const all = await fetchAllCards(page, rpp);
      this.allCards = all;
      this.loadingAll = false;
    },
    async addCardsToUser(cardIds: string[]) {
      await addCardToUser(cardIds);
      await this.loadUserCards();
    },
  },
});
