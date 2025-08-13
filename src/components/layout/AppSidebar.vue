<template>
    <div class="sidebar-container">
        <div v-if="isSidebarOpen" class="fixed inset-0 bg-background/80 z-40" @click="closeSidebar"></div>

        <aside :class="[
            'fixed top-0 mt-15 left-0 h-full bg-background text-white shadow-lg shadow-black/50 transition-transform duration-300 ease-in-out z-50',
            'w-64 lg:w-72',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <div class="p-6 border-b border-secondary">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-text-primary">{{ config.title }}</h2>
                    <button @click="closeSidebar"
                        class="text-text-secondary rounded-md flex items-center justify-center transition-colors"
                        title="Cerrar menú">
                        <span class="icon-[lucide--x] text-2xl hover:text-text-primary"></span>
                    </button>
                </div>
            </div>

            <nav class="flex-1 px-4 py-6">
                <ul class="space-y-2">
                    <li v-for="item in config.items" :key="item.id">
                        <RouterLink :to="item.route" :class="[
                            'flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
                            'hover:bg-secondary focus:bg-secondary focus:outline-none',
                            'text-text-secondary hover:text-white',
                            isActiveRoute(item.route) ? 'bg-secondary/80 text-white border-l-4 border-primary' : ''
                        ]" @click="closeSidebar">
                            <div class="flex items-center justify-center size-8 mr-3">
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
