<template>
    <header
        class="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background shadow-sm transition-shadow"
        :class="{ 'shadow-md': elevated }">
        <div class="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
            <div class="flex items-center">
                <div v-if="isAuthenticated" @click="handleToggleSidebar"
                    class="mr-4 text-text-primary hover:text-primary p-2 rounded-md transition-colors duration-200"
                    title="Abrir menú">
                    <span class="icon-[lucide--menu] text-2xl"></span>
                </div>

                <RouterLink to="/" class="cursor-pointer flex items-center gap-2 group">
                    <LogoCCPP :width="40" :height="40" />
                    <span
                        class="hidden md:block text-text-primary text-base font-bold group-hover:text-primary transition-colors">
                        Centro Cívico por la Paz - Pococi
                    </span>
                </RouterLink>
            </div>
            <nav class="flex items-center gap-2 lg:gap-4">
                <div v-for="item in headerConfig.items" :key="item.title">
                    <RouterLink :to="item.route"
                        :class="[baseStyles, { 'text-primary after:w-full': isActive(item.route) }]">
                        <span :class="item.icon" class="text-xl"></span>
                        {{ item.title }}
                    </RouterLink>
                </div>
                <div v-if="isAuthenticated" @click="handleLogout"
                    :class="[baseStyles, { 'text-primary after:w-full': isActive('/') }]" title="Cerrar sesión">
                    <span class="icon-[lucide--log-out] text-xl"></span>
                    Cerrar sesión
                </div>
                <div v-else @click="router.push('/login')"
                    :class="[baseStyles, { 'text-primary after:w-full': isActive('/login') }]" title="Iniciar sesión">
                    <span class="icon-[lucide--log-in] text-xl"></span>
                    Iniciar sesión

                </div>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
import LogoCCPP from '../../assets/icons/LogoCCPP.vue'
import { RouterLink } from 'vue-router'
import { useSidebar } from '../../composables/useSidebar'
import { headerConfig } from '../../config/header.config'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout: authLogout } = useAuth()
const { toggleSidebar } = useSidebar()
const router = useRouter()
const modal = useModal()
const baseStyles = 'flex items-center gap-2 cursor-pointer text-sm lg:text-base text-text-primary hover:text-primary font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full px-2 py-1 rounded-md'
const handleToggleSidebar = () => {
    toggleSidebar()
}

const handleLogout = () => {
    modal.showConfirmation('¿Estás seguro de querer cerrar sesión?', 'Esta acción cerrará tu sesión y no podrás acceder a la plataforma.', {
        confirmButtonText: 'Cerrar sesión',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            authLogout()
            router.push('/')
        }
    })
}

const elevated = ref(false)
const onScroll = () => {
    elevated.value = window.scrollY > 4
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
})

const route = useRoute()
const isActive = (path: string) => route.path === path
</script>
