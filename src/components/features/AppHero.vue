<script setup lang="ts">
import { useRouter } from 'vue-router'
import LogoCCPP from '@/assets/icons/LogoCCPP.vue'
import AppTitle from '@/components/features/AppTitle.vue'
import AppCard from '@/components/features/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import { images } from '@/config/images.config'
import { homeConfig } from '@/config/home.config'

const router = useRouter()

function registrarVisita() {
    router.push('/registro')
}
</script>

<template>
    <section class="relative min-h-[calc(100vh)] flex items-center justify-center px-4 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url('${homeConfig.hero.image}')` }">
            <div class="absolute inset-0 bg-black/60"></div>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-2 gap-12 items-end">

                <div class="text-center lg:text-left space-y-2" v-motion :initial="{ opacity: 0, y: 24 }"
                    :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }">
                    <LogoCCPP :width="20" :height="20" class="hidden lg:block" />

                    <div class="space-y-2">
                        <AppTitle :title="homeConfig.hero.title" size="md" />
                        <h2 class="text-xl md:text-xl lg:text-2xl font-semibold text-white">
                            {{ homeConfig.hero.subtitle }}
                        </h2>
                    </div>

                    <p class="text-lg md:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        {{ homeConfig.hero.description }}
                    </p>
                </div>

                <div class="flex justify-center items-end lg:justify-end">
                    <div class="w-full max-w-md mb-20 lg:mb-0" v-motion :initial="{ opacity: 0, y: 24 }"
                        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600, delay: 150 } }">
                        <AppCard variant="elevated" padding="lg" rounded="2xl"
                            class="bg-background-secondary/90 backdrop-blur-sm">
                            <div class="text-center space-y-6">
                                <div
                                    class="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                    <span class="icon-[lucide--user-plus] size-8 text-white" />
                                </div>

                                <div>
                                    <h3 class="text-2xl font-bold text-white mb-2">
                                        {{ homeConfig.hero.ctaCard.title }}
                                    </h3>
                                </div>

                                <AppButton
                                    :buttonProps="{ text: homeConfig.hero.ctaCard.buttonText, variant: 'primary', icon: 'icon-[lucide--user-plus] size-5 text-white', onClick: registrarVisita }" />
                            </div>
                        </AppCard>
                    </div>
                </div>
            </div>
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
