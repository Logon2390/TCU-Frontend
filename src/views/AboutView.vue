<script setup lang="ts">
import AppCard from '@/components/features/AppCard.vue'
import AppTitle from '@/components/features/AppTitle.vue'
import { aboutConfig } from '@/config/about.config'
</script>

<template>
    <section class="min-h-[calc(100vh-60px)] bg-background py-16 px-4">
        <div class="max-w-6xl mx-auto space-y-12">
            <div class="text-left space-y-4" v-motion :initial="{ opacity: 0, y: 16 }"
                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400 } }">
                <AppTitle :title="aboutConfig.title" size="md" />
                <p class="text-text-primary font-semibold">{{ aboutConfig.subtitle }}</p>
                <p class="text-text-secondary max-w-3xl">{{ aboutConfig.intro }}</p>
            </div>

            <AppCard variant="gradient" padding="lg" v-motion :initial="{ opacity: 0, y: 16 }"
                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400, delay: 150 } }">
                <h2 class="text-2xl font-semibold text-text-primary mb-4 text-left">Objetivos específicos</h2>
                <ul class="space-y-2 text-text-secondary">
                    <li v-for="(obj, i) in aboutConfig.objectives" :key="i" class="flex items-start gap-2">
                        <span class="icon-[lucide--circle-dot] text-primary mt-1"></span>
                        <span class="text-left">{{ obj }}</span>
                    </li>
                </ul>
            </AppCard>

            <AppCard variant="default" padding="lg" v-motion :initial="{ opacity: 0, y: 16 }"
                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400, delay: 180 } }">
                <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(feat, idx) in aboutConfig.features" :key="idx"
                        class="p-4 rounded-lg border border-text-secondary/20 bg-background text-left">
                        <div class="flex items-center gap-2 mb-2">
                            <span :class="feat.icon" class="text-primary text-xl"></span>
                            <h4 class="font-semibold text-text-primary">{{ feat.title }}</h4>
                        </div>
                        <p class="text-sm text-text-secondary">{{ feat.description }}</p>
                    </div>
                </div>
            </AppCard>

            <AppCard variant="default" padding="lg" v-motion :initial="{ opacity: 0, y: 16 }"
                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400, delay: 200 } }">
                <h2 class="text-2xl font-semibold text-white mb-4 text-left">{{ aboutConfig.techTitle }}</h2>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(t, i) in aboutConfig.tech" :key="i"
                        class="px-3 py-1 rounded-full bg-background-secondary/60 text-white text-sm">
                        {{ t }}
                    </span>
                </div>
            </AppCard>

            <AppCard variant="default" padding="lg" v-motion :initial="{ opacity: 0, y: 16 }"
                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 400, delay: 260 } }">
                <h2 class="text-2xl font-semibold text-white mb-4 text-left">{{ aboutConfig.contributorsTitle }}</h2>
                <p class="text-text-secondary mb-4 text-left">{{ aboutConfig.contributorsNote }}</p>
                <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <ul class="list-disc list-inside text-left">
                        <li v-for="(name, idx) in aboutConfig.contributors" :key="idx"
                            class="rounded-lg bg-background-secondary/40 text-white">
                            {{ name }}
                        </li>
                    </ul>
                </div>
            </AppCard>
        </div>
    </section>
</template>

<style scoped></style>
