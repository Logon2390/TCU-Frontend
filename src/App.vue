<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Sidebar />

    <main class="flex-1">
      <Header />
      <RouterView />
    </main>
  </div>
</template>