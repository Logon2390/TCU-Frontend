<template>
    <header class="bg-gray-800 sticky top-0 z-50 shadow-md">
        <div class="container mx-auto flex justify-between items-center h-16 px-4">
            <div class="flex items-center">
                <RouterLink to="/">
                    <LogoCCPP :width="50" :height="50" />
                </RouterLink>
            </div>
            <nav class="flex gap-6">
                <RouterLink to="/"
                    class="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full">
                    Inicio
                </RouterLink>
                <RouterLink to="/user/Login"
                    class="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full">
                    Administración
                </RouterLink>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import LogoCCPP from '../../assets/icons/LogoCCPP.vue'
import { RouterLink } from 'vue-router'
</script>
