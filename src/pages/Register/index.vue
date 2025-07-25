<template>
    <AuthLayout>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-y-4">
            <h2 class="text-3xl font-bold text-center">Registrar</h2>

            <p v-if="registerError" class="text-center text-red-500 text-sm">
                {{ registerError }}
            </p>

            <div>
                <label class="block mb-1">Nome</label>
                <input v-model="name" type="text" autocomplete="name" :aria-invalid="!!nameError"
                    class="w-full border border-gray-300 rounded px-3 py-2" />
                <span class="text-red-500 text-sm">{{ nameError }}</span>
            </div>

            <div>
                <label class="block mb-1">Email</label>
                <input v-model="email" type="email" autocomplete="email" :aria-invalid="!!emailError"
                    class="w-full border border-gray-300 rounded px-3 py-2" />
                <span class="text-red-500 text-sm">{{ emailError }}</span>
            </div>

            <div>
                <label class="block mb-1">Senha</label>
                <input v-model="password" type="password" autocomplete="new-password" :aria-invalid="!!passwordError"
                    class="w-full border border-gray-300 rounded px-3 py-2" />
                <span class="text-red-500 text-sm">{{ passwordError }}</span>
            </div>

            <button :disabled="loading" type="submit"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50">
                {{ loading ? 'Registrando...' : 'Registrar' }}
            </button>

            <p class="text-center mt-4 text-sm">
                Já tem uma conta?
                <router-link to="/login" class="text-blue-600 hover:underline">Fazer login</router-link>
            </p>
        </form>
    </AuthLayout>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const registerError = ref('')

const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    password: yup.string().min(6, 'Mínimo de 6 caracteres').required('Campo obrigatório'),
})

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    registerError.value = ''
    try {
        await auth.register(values.name, values.email, values.password)
        router.push('/login').then(() => {
            toast.success('Registro realizado com sucesso!')
        })
    } catch (err) {
        const error = err as { response?: { data?: { message?: string } } }
        registerError.value = error.response?.data?.message || 'Erro ao registrar. Tente novamente mais tarde.'
        toast.error(registerError.value)
    } finally {
        loading.value = false
    }
})
</script>
