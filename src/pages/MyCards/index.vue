<template>
    <BaseLayout>
        <div class="flex justify-between mb-8">
            <h1 class="text-2xl font-bold mb-4">Minhas Cartas</h1>
            <button @click="showAddModal = true" class="mb-4 bg-green-500 text-white px-4 py-2 rounded">
                Adicionar cartas
            </button>
        </div>

        <div v-if="userCards.length === 0" class="text-gray-500">Nenhuma carta encontrada.</div>

        <div v-else>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <CardItem v-for="card in paginatedUserCards" :key="card.id" @click="openCardModal(card)" :card="card" />
            </div>

            <Pagination :currentPage="pageUserCards" :hasMore="hasMoreUserCards" :loading="false" @prev="prevUserPage"
                @next="nextUserPage" />
        </div>

        <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">Adicionar cartas à sua conta</h2>

                <form @submit.prevent="handleAddCards" class="flex flex-col gap-3">
                    <label class="font-semibold">Selecione cartas disponíveis</label>

                    <select v-model="selectedCards" multiple class="border p-2 rounded h-40" size="8">
                        <option v-for="card in availableCards" :key="card.id" :value="card.id">
                            {{ card.name }}
                        </option>
                    </select>

                    <Pagination :currentPage="page" :hasMore="availableCards.length === rpp" :loading="loading"
                        @prev="prevPage" @next="nextPage" />

                    <div class="flex justify-end gap-2 mt-4">
                        <button type="button" @click="showAddModal = false" class="text-gray-500">Cancelar</button>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded"
                            :disabled="adding || selectedCards.length === 0">
                            {{ adding ? "Adicionando..." : "Adicionar" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <CardDetailsModal v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useCardsStore } from "@/store/cards";
import { storeToRefs } from "pinia";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Pagination from "@/components/Pagination.vue";
import type { Card } from "@/types";
import { fetchAllCards } from "@/services/cards";
import CardItem from "@/components/CardItem.vue";
import CardDetailsModal from "@/components/CardDetailsModal.vue";
import { toast } from "vue3-toastify";

const cardsStore = useCardsStore();
const { userCards } = storeToRefs(cardsStore);

const showAddModal = ref(false);
const adding = ref(false);
const loading = ref(false);
const selectedCards = ref<string[]>([]);
const availableCards = ref<Card[]>([]);
const selectedCard = ref<Card | null>(null);

const page = ref(1);
const rpp = 10;

function openCardModal(card: Card) {
    selectedCard.value = card
}

async function loadAvailableCards(pageNum = 1) {
    loading.value = true;
    try {
        if (fetchAllCards) {
            availableCards.value = await fetchAllCards(pageNum, rpp);
        }
    } finally {
        loading.value = false;
    }
}

watch(showAddModal, async (val) => {
    if (val) {
        page.value = 1;
        await loadAvailableCards(page.value);
    } else {
        selectedCards.value = [];
    }
});

onMounted(async () => {
    await cardsStore.loadUserCards();
});

async function handleAddCards() {
    if (selectedCards.value.length === 0) return;

    adding.value = true;
    try {
        await cardsStore.addCardsToUser(selectedCards.value);
        toast.success('Carta adicionada com sucesso!');
        showAddModal.value = false;
    } catch (err) {
        toast.error("Erro ao adicionar. Tente novamente mais tarde.");
        console.error(err);
    } finally {
        adding.value = false;
    }
}

function prevPage() {
    if (page.value > 1 && !loading.value) {
        page.value--;
        loadAvailableCards(page.value);
    }
}

function nextPage() {
    if (availableCards.value.length === rpp && !loading.value) {
        page.value++;
        loadAvailableCards(page.value);
    }
}

const pageUserCards = ref(1);
const rppUserCards = 8;

const paginatedUserCards = computed(() => {
    const start = (pageUserCards.value - 1) * rppUserCards;
    const end = start + rppUserCards;
    return userCards.value.slice(start, end);
});

const hasMoreUserCards = computed(() => {
    return pageUserCards.value * rppUserCards < userCards.value.length;
});

function prevUserPage() {
    if (pageUserCards.value > 1) pageUserCards.value--;
}

function nextUserPage() {
    if (hasMoreUserCards.value) pageUserCards.value++;
}
</script>
