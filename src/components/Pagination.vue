<template>
    <div class="mt-6 flex items-center justify-center gap-4">
        <button @click="$emit('prev')" :disabled="currentPage <= 1 || loading"
            class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Anterior
        </button>
        <span>Página {{ currentPage }}</span>
        <button @click="$emit('next')" :disabled="!hasMore || loading"
            class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Próxima
        </button>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    hasMore: {
        type: Boolean,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});
</script>
