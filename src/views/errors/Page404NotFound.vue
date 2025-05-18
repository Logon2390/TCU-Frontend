<script setup lang="ts">
import { useRoute } from 'vue-router'
import router from '@/router';
import { ref, onMounted } from 'vue';
import LogoCCPP from '@/assets/icons/LogoCCPP.vue';
// Función para navegar al inicio
function goHome() {
  router.push('/');
}

// Animación de contador
const count = ref(0);
const maxCount = 404;
const animationSpeed = 2;

onMounted(() => {
  const interval = setInterval(() => {
    count.value += animationSpeed;
    if (count.value >= maxCount) {
      count.value = maxCount;
      clearInterval(interval);
    }
  }, 1);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-800 p-4">
    <div class="max-w-md w-full text-center space-y-8">
      <!-- Ilustración de error con logo centrado -->
      <div class="relative mx-auto w-64 h-64 flex items-center justify-center">
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-full h-full text-gray-900" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>
        <div class="relative z-10 flex items-center justify-center">

          <LogoCCPP :width="140" :height="140" />

        </div>
      </div>

      <!-- Número de error animado -->
      <h1 class="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
        {{ count }}
      </h1>

      <!-- Mensaje de error -->
      <div class="space-y-2">
        <p class="text-2xl font-semibold text-gray-200">¡Página no encontrada!</p>
        <p class="text-gray-500">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      </div>

      <!-- Botón para volver al inicio -->
      <div class="pt-6">
        <button @click="goHome"
          class="px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            Volver al inicio
          </span>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>