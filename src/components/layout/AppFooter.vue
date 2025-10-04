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
                    <Logo :width="10" :height="10" />
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
                class="flex flex-col md:flex-row justify-between items-start md:items-center md:space-y-0">

                <div class="flex items-center   ">
                    <a v-for="social in footerConfig.socialMedia" :key="social.name" :href="social.url"
                        :title="social.name" target="_blank" rel="noopener noreferrer"
                        class="text-text-secondary hover:text-primary transition-colors p-2 duration-200">
                        <span :class="`${social.icon} size-5`"></span>
                    </a>
                </div>
            </div>

            <div
                class="mt-4 pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div class="text-text-secondary text-sm">
                    © {{ currentYear }} {{ footerConfig.organization.name }}. Todos los derechos reservados.
                </div>

                <div
                    class="text-text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium cursor-pointer">
                    Desarrollado por el TCU-663
                </div>
            </div>
        </div>
    </footer>
</template>
