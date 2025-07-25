<template>
    <form @submit="onSubmit">
        <div>
            <label>Email</label>
            <input v-model="values.email" type="email" />
            <span class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>

        <div>
            <label>Senha</label>
            <input v-model="values.password" type="password" />
            <span class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <button type="submit">Entrar</button>
    </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()

const schema = yup.object({
    email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
    password: yup.string().min(6, 'Mínimo de 6 caracteres').required('Campo obrigatório'),
})

const { handleSubmit, values, errors } = useForm({
    validationSchema: schema,
})

const onSubmit = handleSubmit(async (form) => {
    await auth.login(form.email, form.password)
})
</script>
