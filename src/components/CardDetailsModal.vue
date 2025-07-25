<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="$emit('close')">
        <div class="bg-white p-6 rounded w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">{{ card.name }}</h2>
            <img :src="card.imageUrl" alt="Imagem da carta" class="w-full rounded mb-4" />
            <p class="text-gray-700 whitespace-pre-line">{{ card.description }}</p>

            <div class="flex justify-end mt-6">
                <button @click="$emit('close')" class="text-gray-500 hover:text-black">
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types'

defineProps<{
    card: Card
}>()

defineEmits(['close'])
</script>
