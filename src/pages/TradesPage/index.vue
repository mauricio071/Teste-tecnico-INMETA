<template>
    <BaseLayout>
        <div class="max-w-5xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Trocas abertas</h1>

            <div v-if="loading" class="text-gray-500">Carregando trocas...</div>
            <div v-else-if="!trades.length" class="text-gray-500">Nenhuma troca disponível.</div>

            <div v-else class="space-y-6">
                <div v-for="trade in trades" :key="trade.id" class="border rounded-lg p-4 shadow-sm relative">
                    <p class="text-sm text-gray-600 mb-2">
                        Criada por: {{ trade.user?.name || "Usuário desconhecido" }}
                    </p>

                    <button v-if="trade.userId === currentUserId" @click="confirmDeleteTrade(trade.id)"
                        class="absolute top-2 right-2 text-red-600 hover:text-red-800" title="Excluir troca">
                        🗑️
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                            <h2 class="font-semibold text-blue-600 mb-2">Oferecendo</h2>
                            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div v-for="card in trade.tradeCards.filter((c: TradeCard) => c.type === 'OFFERING')"
                                    :key="card.id" class="w-28 border rounded p-2 text-center">
                                    <img :src="card.card.imageUrl" alt="" class="w-full h-32 object-cover rounded" />
                                    <p class="text-sm font-medium mt-1">{{ card.card.name }}</p>
                                </div>
                            </div>
                        </div>

                        <img src="@/assets/trade.svg" alt="Ícone de troca"
                            class="w-32 h-32 mx-auto md:m-0 md:rotate-[90deg]" />

                        <div>
                            <h2 class="font-semibold text-green-600 mb-2">Desejando</h2>
                            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div v-for="card in trade.tradeCards.filter((c: TradeCard) => c.type === 'RECEIVING')"
                                    :key="card.id" class="w-28 border rounded p-2 text-center">
                                    <img :src="card.card.imageUrl" alt="" class="w-full h-32 object-cover rounded" />
                                    <p class="text-sm font-medium mt-1">{{ card.card.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination :currentPage="page" :hasMore="more" :loading="loading" @next="nextPage" @prev="prevPage" />
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded w-full max-w-md">
                <h2 class="text-lg font-semibold mb-4">Excluir troca</h2>
                <p class="mb-6 text-gray-700">Tem certeza que deseja excluir esta troca?</p>
                <div class="flex justify-end gap-3">
                    <button @click="cancelDelete" class="text-gray-500">Cancelar</button>
                    <button @click="handleConfirmDelete"
                        class="bg-red-600 text-white px-4 py-2 rounded">Confirmar</button>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTradesStore } from "@/store/trades";
import { useAuthStore } from "@/store/auth";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import type { TradeCard } from "@/types";
import Pagination from "@/components/Pagination.vue";
import { toast } from "vue3-toastify";

const tradesStore = useTradesStore();
const authStore = useAuthStore();

const trades = computed(() => tradesStore.trades);
const page = computed(() => tradesStore.page);
const more = computed(() => tradesStore.more);
const loading = computed(() => tradesStore.loading);
const currentUserId = computed(() => authStore.user?.id || "");

const showConfirmModal = ref(false);
const tradeIdToDelete = ref<string | null>(null);


function confirmDeleteTrade(id: string) {
    tradeIdToDelete.value = id;
    showConfirmModal.value = true;
}

function cancelDelete() {
    showConfirmModal.value = false;
    tradeIdToDelete.value = null;
}

async function handleConfirmDelete() {
    if (!tradeIdToDelete.value) return;

    try {
        await tradesStore.deleteTrade(tradeIdToDelete.value);
        await tradesStore.loadTrades(page.value);
        toast.success('Troca excluída com sucesso!');
    } catch (error) {
        toast.error("Erro ao excluir a troca");
        console.error("Erro ao excluir a troca", error);
    } finally {
        showConfirmModal.value = false;
        tradeIdToDelete.value = null;
    }
}

function nextPage() {
    if (more.value && !loading.value) {
        tradesStore.loadTrades(page.value + 1);
    }
}

function prevPage() {
    if (page.value > 1 && !loading.value) {
        tradesStore.loadTrades(page.value - 1);
    }
}

onMounted(() => {
    tradesStore.loadTrades();
});
</script>
