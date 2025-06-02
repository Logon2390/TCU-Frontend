<template>
    <div class="sidebar-container">
        <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/80 z-40" @click="closeSidebar"></div>

        <aside :class="[
            'fixed top-0 mt-15 left-0 h-full bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out z-50',
            'w-64 lg:w-72',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div class="p-6 border-b border-gray-700">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-white">{{ config.title }}</h2>
                    <button @click="closeSidebar"
                        class="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 transition-colors"
                        title="Cerrar menú">
                        <span class="icon-[lucide--x] text-2xl"></span>
                    </button>
                </div>
            </div>

            <nav class="flex-1 px-4 py-6">
                <ul class="space-y-2">
                    <li v-for="item in config.items" :key="item.id">
                        <RouterLink :to="item.route" :class="[
                            'flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
                            'hover:bg-gray-700 focus:bg-gray-700 focus:outline-none',
                            'text-gray-300 hover:text-white',
                            isActiveRoute(item.route) ? 'bg-gray-700 text-white border-l-4 border-blue-500' : ''
                        ]" @click="closeSidebar">
                            <div class="flex items-center justify-center w-8 h-8 mr-3">
                                <span :class="item.icon" class="text-2xl"></span>
                            </div>
                            <span class="font-medium">{{ item.title }}</span>
                        </RouterLink>
                    </li>
                </ul>
            </nav>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { sidebarConfig } from '../../config/sidebar.config'
import { useSidebar } from '../../composables/useSidebar'

const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar()
const route = useRoute()
const config = sidebarConfig

const isActiveRoute = (itemRoute: string) => {
    return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}

defineExpose({
    toggleSidebar,
    closeSidebar
})
</script>

<style scoped>
.sidebar-container {
    position: relative;
}

@media (min-width: 1024px) {
    .sidebar-container {
        position: static;
    }
}
</style>
