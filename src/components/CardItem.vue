<template>
    <div class="border rounded p-4 shadow hover:shadow-md transition duration-200 space-y-2 cursor-pointer"
        @click="$emit('click')">
        <img :src="card.imageUrl" alt="Imagem da carta" class="w-full object-cover mb-2 rounded" />
        <h2 class="font-bold">{{ card.name }}</h2>
        <p class="text-sm text-gray-600 line-clamp-description">
            {{ card.description }}
        </p>
    </div>
</template>

<script setup lang="ts">
import type { Card } from "@/types";

defineProps<{ card: Card }>();
defineEmits(["click"]);
</script>

<style scoped>
.line-clamp-description {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>