<script setup lang="ts">
import Logo from '@/assets/icons/LogoCCPP.vue'
import { footerConfig } from '@/config/footer.config'
import { useRouter } from 'vue-router'

const currentYear = new Date().getFullYear()
const router = useRouter()
</script>

<template>
    <footer class="bg-background-secondary">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col lg:flex-row justify-between items-start space-y-8 lg:space-y-0 lg:space-x-8 mb-8">
                <div class="flex items-center space-x-3">
                    <Logo :width="40" :height="40" />
                    <div>
                        <h3 class="text-white font-semibold text-lg">{{ footerConfig.organization.name }}</h3>
                        <p class="text-text-secondary text-sm">Centro de servicios comunitarios</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2">
                            <span class="icon-[lucide--phone] text-primary size-4"></span>
                            <span class="text-text-secondary text-sm">{{ footerConfig.contact.phone }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="icon-[lucide--mail] text-primary size-4"></span>
                            <span class="text-text-secondary text-sm">{{ footerConfig.contact.email }}</span>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2">
                            <span class="icon-[lucide--map-pin] text-primary size-4"></span>
                            <span class="text-text-secondary text-sm">{{ footerConfig.contact.address }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="icon-[lucide--clock] text-primary size-4"></span>
                            <span class="text-text-secondary text-sm">{{ footerConfig.contact.schedule }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 border-t border-gray-700 pt-8">
                <div class="flex flex-wrap gap-6">
                    <div v-for="link in footerConfig.links" :key="link.label" @click="router.push(link.url)"
                        class="text-text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full cursor-pointer">
                        {{ link.label }}
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <a v-for="social in footerConfig.socialMedia" :key="social.name" :href="social.url"
                        :title="social.name" target="_blank" rel="noopener noreferrer"
                        class="text-text-secondary hover:text-primary transition-colors p-2 duration-200">
                        <span :class="`${social.icon} size-5`"></span>
                    </a>
                </div>
            </div>

            <div
                class="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div class="text-text-secondary text-sm">
                    © {{ currentYear }} {{ footerConfig.organization.name }}. Todos los derechos reservados.
                </div>

                <div @click="router.push('/about')"
                    class="text-text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium cursor-pointer">
                    Desarrollado por el TCU-663
                </div>
            </div>
        </div>
    </footer>
</template>
