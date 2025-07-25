<template>
    <div>
        <header class="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white p-6 shadow-md">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <RouterLink to="/">
                    <h1 class="text-xl font-bold">Cards Marketplace</h1>
                </RouterLink>

                <button @click="isMenuOpen = !isMenuOpen" class="md:hidden focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div class="hidden md:flex items-center gap-6">
                    <nav class="flex gap-4">
                        <RouterLink to="/" custom v-slot="{ isActive, navigate }">
                            <span @click="navigate" :class="navClass(isActive)">Início</span>
                        </RouterLink>

                        <RouterLink to="/my-cards" custom v-slot="{ isActive, navigate }">
                            <span @click="navigate" :class="navClass(isActive)">Minhas Cartas</span>
                        </RouterLink>

                        <RouterLink to="/create-trade" custom v-slot="{ isActive, navigate }">
                            <span @click="navigate" :class="navClass(isActive)">Criar troca</span>
                        </RouterLink>

                        <RouterLink to="/trades" custom v-slot="{ isActive, navigate }">
                            <span @click="navigate" :class="navClass(isActive)">Trocas</span>
                        </RouterLink>
                    </nav>

                    <button @click="logout" class="text-sm text-red-400 ml-4 hover:underline">Sair</button>
                </div>
            </div>

            <div v-if="isMenuOpen" class="md:hidden mt-4 px-2 space-y-2 transition-all">
                <RouterLink to="/" custom v-slot="{ isActive, navigate }">
                    <div @click="() => navigateAndClose(navigate)" :class="mobileNavClass(isActive)">Início</div>
                </RouterLink>

                <RouterLink to="/my-cards" custom v-slot="{ isActive, navigate }">
                    <div @click="() => navigateAndClose(navigate)" :class="mobileNavClass(isActive)">Minhas Cartas</div>
                </RouterLink>

                <RouterLink to="/create-trade" custom v-slot="{ isActive, navigate }">
                    <div @click="() => navigateAndClose(navigate)" :class="mobileNavClass(isActive)">Criar troca</div>
                </RouterLink>

                <RouterLink to="/trades" custom v-slot="{ isActive, navigate }">
                    <div @click="() => navigateAndClose(navigate)" :class="mobileNavClass(isActive)">Trocas</div>
                </RouterLink>

                <button @click="() => logout" class="block text-sm text-red-400 hover:underline px-2 mt-2">
                    Sair
                </button>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-24">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(false);

function logout() {
    authStore.logout();
    router.push("/login");
}

function navigateAndClose(navigate: () => void) {
    isMenuOpen.value = false;
    navigate();
}

function navClass(isActive: boolean) {
    return [
        "cursor-pointer hover:underline transition",
        isActive ? "text-green-400 font-semibold" : ""
    ];
}

function mobileNavClass(isActive: boolean) {
    return [
        "block px-2 py-1 text-sm rounded hover:bg-gray-800 transition",
        isActive ? "text-green-400 font-semibold" : "text-white"
    ];
}
</script>
