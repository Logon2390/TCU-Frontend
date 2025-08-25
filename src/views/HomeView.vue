<script setup lang="ts">
import AppHero from '@/components/features/AppHero.vue'
import AppCard from '@/components/features/AppCard.vue'
import AppTitle from '@/components/features/AppTitle.vue'
import AppButton from '@/components/common/AppButton.vue'
import { homeConfig } from '@/config/home.config'

function scrollToContact() {
  document.getElementById(homeConfig.contact.id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppHero />

    <section :id="homeConfig.about.id" class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16" v-motion :initial="{ opacity: 0, y: 16 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }">
          <AppTitle :title="homeConfig.about.title" size="xl" />
          <p class="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mt-4">
            {{ homeConfig.hero.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6" v-motion :initial="{ opacity: 0, y: 24 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }">
            <AppCard variant="default">
              <h3 class="text-2xl font-semibold text-white mb-4">{{ homeConfig.about.missionTitle }}</h3>
              <p class="text-text-secondary leading-relaxed">
                {{ homeConfig.about.mission }}
              </p>
            </AppCard>

            <AppCard variant="default">
              <h3 class="text-2xl font-semibold text-white mb-4">{{ homeConfig.about.visionTitle }}</h3>
              <p class="text-text-secondary leading-relaxed">
                {{ homeConfig.about.vision }}
              </p>
            </AppCard>
          </div>

          <AppCard variant="gradient" padding="lg" v-motion :initial="{ opacity: 0, y: 24 }"
            class=" flex items-center h-full"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500, delay: 100 } }">
            <h3 class="text-2xl font-semibold text-text-primary mb-6">{{ homeConfig.about.valuesTitle }}</h3>
            <ul class="space-y-4 text-text-secondary">
              <li v-for="value in homeConfig.about.values" :key="value" class="flex items-center">
                <span class="text-primary mr-3">•</span>
                {{ value }}
              </li>
            </ul>
          </AppCard>
        </div>
      </div>
    </section>

    <section :id="homeConfig.programs.id" class="py-20 px-4 bg-primary/20">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <AppTitle :title="homeConfig.programs.title" size="md" />
          <p class="text-xl text-text-secondary max-w-3xl mx-auto">
            {{ homeConfig.programs.subtitle }}
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AppCard v-for="programa in homeConfig.programs.items" :key="programa.title" variant="default"
            :clickable="true" v-motion :initial="{ opacity: 0, y: 24 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 500 } }">
            <div class="text-4xl mb-4">{{ programa.icon }}</div>
            <h3 class="text-xl font-semibold text-white mb-3">{{ programa.title }}</h3>
            <p class="text-text-secondary leading-relaxed">{{ programa.description }}</p>
          </AppCard>
        </div>
      </div>
    </section>

    <section :id="homeConfig.contact.id" class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <AppTitle :title="homeConfig.contact.title" size="md" />

        <p class="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
          {{ homeConfig.contact.description }}
        </p>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <AppCard v-for="card in homeConfig.contact.cards" :key="card.title" variant="elevated">
            <div class="text-center">
              <div class="text-3xl mb-4">
                <span :class="card.icon" class="text-primary" />
              </div>
              <h3 class="text-lg font-semibold text-white mb-2">{{ card.title }}</h3>
              <p class="text-text-secondary" v-html="card.content.replace(/\n/g, '<br>')"></p>
            </div>
          </AppCard>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped></style>