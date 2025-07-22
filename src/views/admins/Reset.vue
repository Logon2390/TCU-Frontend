<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

async function handleSubmit(event: Event) {
    event.preventDefault()
    if (newPassword.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden')
        return
    }
    isLoading.value = true

    try {
        console.log(route.query.token)
        const res = await fetch('http://localhost:3000/admins/resetPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: route.query.token,
                newPassword: newPassword.value
            })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Error al restablecer contraseña')

        alert('Contraseña restablecida correctamente')
        router.push('/user/Login')
    } catch (err: any) {
        alert(`Error: ${err.message}`)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-800">
        <div class="flex-grow flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="bg-gradient-to-r from-red-600 via-white to-blue-600 h-2 rounded-t"></div>

                <div class="bg-gray-800 p-8 rounded-b shadow-lg">
                    <h2 class="text-xl font-semibold text-center text-gray-300 mb-6">
                        Restablecer contraseña
                    </h2>

                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <div>
                            <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1">
                                Nueva contraseña
                            </label>
                            <input type="newPassword" id="newPassword" v-model="newPassword" required
                                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="******">
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
                                Confirmar contraseña
                            </label>
                            <input type="newPassword" id="confirmPassword" v-model="confirmPassword" required
                                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="******">
                        </div>

                        <button type="submit"
                            class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Restablecer contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
