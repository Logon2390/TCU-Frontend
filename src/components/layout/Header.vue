<template>
    <header class="bg-gray-800 sticky top-0 z-50 shadow-md">
        <div class="container mx-auto flex justify-between items-center h-16 px-4">
            <div class="flex items-center">
                <button @click="handleToggleSidebar"
                    class="mr-4 text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    title="Abrir menú">
                    <span class="icon-[lucide--menu] text-2xl"></span>
                </button>

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
import { useSidebar } from '../../composables/useSidebar'
import { headerConfig } from '../../config/header.config'

const { toggleSidebar } = useSidebar()

const handleToggleSidebar = () => {
    toggleSidebar()
}
</script>
