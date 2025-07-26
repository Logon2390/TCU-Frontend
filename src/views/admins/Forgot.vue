<script setup lang="ts">
import { ref } from 'vue'
import { requestPasswordReset } from '@/service/admin/Admin.service'

const email = ref('')
const isLoading = ref(false)

async function handleSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true

  try {
    await requestPasswordReset(email.value)
    alert('Correo enviado con enlace para restablecer contraseña')
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
              <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input type="email" id="email" v-model="email" required
                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jast@gmail.com" />
            </div>

            <div>
              <button type="submit"
                class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                :disabled="isLoading">
                {{ isLoading ? 'Enviando...' : 'Enviar enlace' }}
              </button>
            </div>

            <div class="text-center">
              <a href="/admin/Login" class="text-sm font-medium text-green-400 hover:text-green-300">
                Volver al login
              </a>
            </div>
          </form>

          <div class="mt-6 text-center text-sm text-gray-400">
            <p>Centro Cívico por la Paz de Pococí, Limón, Costa Rica</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
