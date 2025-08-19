<script setup lang="ts">
import { useRouter } from 'vue-router'
import LogoCCPP from '@/assets/icons/LogoCCPP.vue'
import AppTitle from '@/components/features/AppTitle.vue'
import AppCard from '@/components/features/AppCard.vue'
import { images } from '@/config/images.config'
import { homeConfig } from '@/config/home.config'

const router = useRouter()

function registrarVisita() {
    router.push('/registro')
}

function goToSection(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
    <section class="relative min-h-[calc(100vh-50px)] flex items-center justify-center px-4 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url('${images.registration.hero}')` }">
            <div class="absolute inset-0 bg-black/60"></div>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-12 items-center">

                <div class="text-center lg:text-left space-y-8">
                    <LogoCCPP :width="80" :height="80" class="hidden lg:block" />

                    <div class="space-y-4">
                        <AppTitle :title="homeConfig.hero.title" size="md" />
                        <h2 class="text-xl md:text-xl lg:text-2xl font-semibold text-gray-200">
                            {{ homeConfig.hero.subtitle }}
                        </h2>
                    </div>

                    <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        {{ homeConfig.hero.description }}
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-8">
                        <button @click="goToSection('quienes-somos')"
                            class="px-8 py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
                            Conoce Más
                        </button>
                        <button @click="goToSection('informacion')"
                            class="px-8 py-4 border-2 border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-gray-700/50 hover:border-gray-300 backdrop-blur-sm transition duration-300 ease-in-out">
                            Información
                        </button>
                    </div>
                </div>

                <div class="flex justify-center lg:justify-end">
                    <div class="w-full max-w-md">
                        <AppCard variant="elevated" padding="lg" rounded="2xl" class="bg-gray-900/90 backdrop-blur-sm">
                            <div class="text-center space-y-6">
                                <div
                                    class="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span class="icon-[lucide--user-plus] size-8 text-white" />
                                </div>

                                <div>
                                    <h3 class="text-2xl font-bold text-white mb-2">
                                        Registra tu Visita
                                    </h3>
                                    <p class="text-gray-300 text-sm leading-relaxed">
                                        Únete a nuestra comunidad y mantente informado sobre nuestras actividades y
                                        programas
                                    </p>
                                </div>

                                <button @click="registrarVisita"
                                    class="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out hover:from-red-600 hover:to-purple-700">
                                    Comenzar Registro
                                </button>
                            </div>
                        </AppCard>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
            <span class="icon-[lucide--arrow-down] size-6  text-gray-300" />
        </div>
    </section>
</template>

<style scoped>
.hero-bg {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

@media (max-width: 1024px) {
    .hero-bg {
        background-attachment: scroll;
    }
}
</style>
