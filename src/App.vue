<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/AppHeader.vue'
import Footer from './components/layout/AppFooter.vue'
import Sidebar from './components/layout/AppSidebar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Sidebar />

    <main class="flex-1">
      <Header />
      <RouterView />
      <Footer />
    </main>
  </div>
</template>