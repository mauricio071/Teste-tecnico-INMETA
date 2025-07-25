import { defineStore } from "pinia";
import {
  createTradeAPI,
  deleteTradeAPI,
  fetchAllTradesAPI,
} from "@/services/trades";

export const useTradesStore = defineStore("trades", {
  state: () => ({
    trades: [] as any[],
    page: 1,
    rpp: 10,
    more: false,
    loading: false,
  }),
  actions: {
    async loadTrades(page = 1) {
      this.loading = true;
      const res = await fetchAllTradesAPI(page, this.rpp);
      this.trades = res.list;
      this.page = res.page;
      this.more = res.more;
      this.loading = false;
    },
    async createNewTrade(offeredIds: string[], requestedIds: string[]) {
      return await createTradeAPI(offeredIds, requestedIds);
    },
    async deleteTrade(tradeId: string) {
      await deleteTradeAPI(tradeId);
    },
  },
});
