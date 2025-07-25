<template>
    <AuthLayout>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-y-4">
            <h2 class="text-3xl font-bold text-center">Bem vindo!</h2>
            <p class="text-center text-gray-600 text-sm mb-2">
                Marketplace de troca e venda de cartas colecionáveis
            </p>

            <p v-if="authError" class="text-center text-red-500 text-sm">
                {{ authError }}
            </p>

            <div>
                <label class="block mb-1">Email</label>
                <input v-model="email" type="email" autocomplete="email" :aria-invalid="!!emailError"
                    class="w-full border border-gray-300 rounded px-3 py-2" />
                <span class="text-red-500 text-sm">{{ emailError }}</span>
            </div>

            <div>
                <label class="block mb-1">Senha</label>
                <input v-model="password" type="password" autocomplete="current-password"
                    :aria-invalid="!!passwordError" class="w-full border border-gray-300 rounded px-3 py-2" />
                <span class="text-red-500 text-sm">{{ passwordError }}</span>
            </div>

            <button :disabled="loading" type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50">
                {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>

            <p class="text-center mt-4 text-sm">
                Não tem conta?
                <router-link to="/register" class="text-blue-600 hover:underline">Cadastre-se</router-link>
            </p>
        </form>
    </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/layouts/AuthLayout.vue'

const auth = useAuthStore()
const router = useRouter()

const schema = yup.object({
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    password: yup.string().min(6, 'Mínimo de 6 caracteres').required('Campo obrigatório'),
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const loading = ref(false)
const authError = ref('')

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    authError.value = ''
    try {
        await auth.login(values.email, values.password)
        router.push('/')
    } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        authError.value = error.response?.data?.message || 'Erro ao registrar. Tente novamente.'
    } finally {
        loading.value = false
    }
})
</script>
