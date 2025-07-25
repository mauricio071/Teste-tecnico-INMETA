<template>
    <BaseLayout>
        <div class="flex justify-between mb-8">
            <h1 class="text-2xl font-bold">Criar solicitação de troca</h1>
            <button @click="handleCreateTrade" class="px-4 py-2 rounded transition text-white" :class="[
                creating || !offered.length || !requested.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
            ]" :disabled="creating || !offered.length || !requested.length">
                {{ creating ? "Criando..." : "Criar troca" }}
            </button>
        </div>
        <h2 class="font-semibold text-lg my-8">Escolha as cartas que quer oferecer:</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="card in paginatedUserCards" :key="card.id" @click="toggleOffered(card.id)" :class="[
                'border p-4 rounded cursor-pointer',
                offered.includes(card.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
            ]">
                <img :src="card.imageUrl" alt="" class="mt-2 rounded" />
                <p class="text-center font-semibold mt-2">{{ card.name }}</p>
            </div>
        </div>

        <Pagination :currentPage="userPage" :hasMore="userCards.length > userPage * rpp" :loading="false"
            @prev="userPage--" @next="userPage++" />

        <img src="@/assets/trade.svg" alt="Ícone de troca" class="w-40 h-40 mx-auto mt-10" />

        <h2 class="font-semibold text-lg my-8">Escolha as cartas que deseja receber:</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="card in cardsStore.allCards" :key="card.id" @click="toggleRequested(card.id)" :class="[
                'border p-3 rounded cursor-pointer',
                requested.includes(card.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300'
            ]">
                <img :src="card.imageUrl" alt="" class="mt-2 rounded" />
                <p class="text-center font-semibold mt-2">{{ card.name }}</p>
            </div>
        </div>

        <Pagination :currentPage="allPage" :hasMore="cardsStore.allCards.length === rpp"
            :loading="cardsStore.loadingAll" @prev="allPage--" @next="allPage++" />
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useCardsStore } from "@/store/cards";
import { useTradesStore } from "@/store/trades";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Pagination from "@/components/Pagination.vue";
import type { Card } from "@/types";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const cardsStore = useCardsStore();
const tradesStore = useTradesStore();
const router = useRouter();

const userCards = ref<Card[]>([]);
const offered = ref<string[]>([]);
const requested = ref<string[]>([]);
const creating = ref(false);

const userPage = ref(1);
const allPage = ref(1);
const rpp = 8;

const paginatedUserCards = computed(() => {
    const start = (userPage.value - 1) * rpp;
    return userCards.value.slice(start, start + rpp);
});

function toggleOffered(id: string) {
    const index = offered.value.indexOf(id);
    if (index >= 0) offered.value.splice(index, 1);
    else offered.value.push(id);
}

function toggleRequested(id: string) {
    const index = requested.value.indexOf(id);
    if (index >= 0) requested.value.splice(index, 1);
    else requested.value.push(id);
}

async function handleCreateTrade() {
    if (!offered.value.length || !requested.value.length) return;

    const uniqueOffered = Array.from(new Set(offered.value));
    const uniqueRequested = Array.from(new Set(requested.value));
    const intersection = uniqueOffered.filter((id) => uniqueRequested.includes(id));
    if (intersection.length > 0) {
        toast.warn('Uma carta não pode estar nas listas de oferecidas e pedidas ao mesmo tempo.');
        return;
    }

    creating.value = true;
    await tradesStore.createNewTrade(uniqueOffered, uniqueRequested);
    creating.value = false;

    offered.value = [];
    requested.value = [];
    router.push('/trades').then(() => {
        toast.success('Troca criada com sucesso!');
    })
}

onMounted(async () => {
    await cardsStore.loadUserCards();
    await cardsStore.loadAllCards(allPage.value, rpp);
    userCards.value = cardsStore.userCards;
});

watch(allPage, async (newPage) => {
    await cardsStore.loadAllCards(newPage, rpp);
});
</script>
