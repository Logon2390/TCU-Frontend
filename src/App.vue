<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-gray-800 sticky top-0 z-50 shadow-md">
      <div class="container mx-auto flex justify-between items-center h-16 px-4">
        <div class="flex items-center">
          <RouterLink to="/">
            <img src="@/assets/logoCCPP.svg" alt="Centro Cívico por la Paz Pococi" class="h-12" />
          </RouterLink>
        </div>
        <nav class="flex gap-6">
          <RouterLink to="/" class="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full">
            Home
          </RouterLink>
          <RouterLink to="/user/Login" class="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full">
            Iniciar sesión
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>