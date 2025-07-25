<template>
    <BaseLayout>
        <h1 class="text-2xl font-bold mb-8">Cartas disponíveis</h1>

        <div v-if="loading" class="text-center">Carregando...</div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <CardItem v-for="card in cards" :key="card.id" :card="card" @click="openCardModal(card)" />
        </div>

        <Pagination :currentPage="page" :hasMore="cards.length === rpp" :loading="loading" @prev="prevPage"
            @next="nextPage" />

        <CardDetailsModal v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />
    </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchAllCards } from '@/services/cards'
import type { Card } from '@/types'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import Pagination from '@/components/Pagination.vue'
import CardItem from '@/components/CardItem.vue'
import CardDetailsModal from '@/components/CardDetailsModal.vue'

const cards = ref<Card[]>([])
const loading = ref(true)
const page = ref(1)
const rpp = 12
const selectedCard = ref<Card | null>(null)

function openCardModal(card: Card) {
    selectedCard.value = card
}

async function loadCards() {
    loading.value = true
    try {
        cards.value = await fetchAllCards(page.value, rpp)
    } catch (err) {
        console.error('Erro ao carregar cartas', err)
    } finally {
        loading.value = false
    }
}

function nextPage() {
    if (loading.value) return
    page.value++
    loadCards()
}

function prevPage() {
    if (loading.value || page.value === 1) return
    page.value--
    loadCards()
}

onMounted(() => {
    loadCards()
})
</script>
