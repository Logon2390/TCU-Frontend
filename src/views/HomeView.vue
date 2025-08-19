<script setup lang="ts">
import { ref } from 'vue'
import AppHero from '@/components/features/AppHero.vue'
import AppCard from '@/components/features/AppCard.vue'

function scrollToContact() {
  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
}

// Datos de los programas (sujeto a cambios)
const programas = ref([
  {
    titulo: "Educación para la Paz",
    descripcion: "Talleres y capacitaciones para promover la cultura de paz en la comunidad.",
    icono: "📚"
  },
  {
    titulo: "Mediación Comunitaria",
    descripcion: "Resolución pacífica de conflictos entre vecinos y organizaciones.",
    icono: "🤝"
  },
  {
    titulo: "Desarrollo Social",
    descripcion: "Programas de fortalecimiento del tejido social y participación ciudadana.",
    icono: "🌱"
  },
  {
    titulo: "Actividades Culturales",
    descripcion: "Eventos y actividades que promueven la identidad y cohesión social.",
    icono: "🎭"
  }
])


</script>

<template>
  <div class="min-h-screen bg-background">

    <!-- Hero Section -->
    <AppHero />

    <!-- Quiénes Somos -->
    <section id="quienes-somos" class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-6">
            ¿Quiénes Somos?
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Somos una organización comunitaria comprometida con la promoción de la paz,
            la justicia social y el desarrollo integral de la comunidad de Pococi.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <AppCard variant="default">
              <h3 class="text-2xl font-semibold text-gray-200 mb-4">Nuestra Misión</h3>
              <p class="text-gray-300 leading-relaxed">
                Promover la cultura de paz, la participación ciudadana y el desarrollo
                sostenible en Pococi, fortaleciendo el tejido social y construyendo
                espacios de diálogo y convivencia.
              </p>
            </AppCard>

            <AppCard variant="default">
              <h3 class="text-2xl font-semibold text-gray-200 mb-4">Nuestra Visión</h3>
              <p class="text-gray-300 leading-relaxed">
                Ser el referente en la construcción de paz y desarrollo comunitario
                en Pococi, donde cada persona pueda vivir con dignidad, respeto y
                oportunidades de crecimiento.
              </p>
            </AppCard>
          </div>

          <AppCard variant="gradient" padding="lg">
            <h3 class="text-2xl font-semibold text-gray-200 mb-6">Nuestros Valores</h3>
            <ul class="space-y-4 text-gray-300">
              <li class="flex items-center">
                <span class="text-red-400 mr-3">✓</span>
                Respeto y dignidad humana
              </li>
              <li class="flex items-center">
                <span class="text-red-400 mr-3">✓</span>
                Participación democrática
              </li>
              <li class="flex items-center">
                <span class="text-red-400 mr-3">✓</span>
                Justicia social
              </li>
              <li class="flex items-center">
                <span class="text-red-400 mr-3">✓</span>
                Solidaridad comunitaria
              </li>
              <li class="flex items-center">
                <span class="text-red-400 mr-3">✓</span>
                Transparencia y honestidad
              </li>
            </ul>
          </AppCard>
        </div>
      </div>
    </section>

    <!-- Programas y Servicios -->
    <section class="py-20 px-4 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-6">
            Nuestros Programas
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Desarrollamos iniciativas que fortalecen la paz y el bienestar comunitario
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AppCard v-for="programa in programas" :key="programa.titulo" variant="default" :clickable="true">
            <div class="text-4xl mb-4">{{ programa.icono }}</div>
            <h3 class="text-xl font-semibold text-gray-200 mb-3">{{ programa.titulo }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ programa.descripcion }}</p>
          </AppCard>
        </div>
      </div>
    </section>

    <!-- Síguenos en Facebook -->
    <section class="py-20 px-4 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-6">
            Síguenos en Facebook
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Mantente conectado con nosotros y entérate de todas nuestras actividades, eventos y noticias de la comunidad
          </p>
        </div>
      </div>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2
          class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-8">
          Únete a Nosotros
        </h2>

        <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          ¿Quieres ser parte del cambio? Contáctanos y descubre cómo puedes
          contribuir a construir una comunidad más pacífica y próspera.
        </p>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <AppCard variant="elevated">
            <div class="text-center">
              <div class="text-3xl mb-4">📍</div>
              <h3 class="text-lg font-semibold text-gray-200 mb-2">Ubicación</h3>
              <p class="text-gray-400">Pococi, Limón<br>Costa Rica</p>
            </div>
          </AppCard>

          <AppCard variant="elevated">
            <div class="text-center">
              <div class="text-3xl mb-4">📞</div>
              <h3 class="text-lg font-semibold text-gray-200 mb-2">Teléfono</h3>
              <p class="text-gray-400">+506 XXXX-XXXX</p>
            </div>
          </AppCard>

          <AppCard variant="elevated">
            <div class="text-center">
              <div class="text-3xl mb-4">✉️</div>
              <h3 class="text-lg font-semibold text-gray-200 mb-2">Email</h3>
              <p class="text-gray-400">info@ccpp-pococi.org</p>
            </div>
          </AppCard>
        </div>

        <button @click="scrollToContact"
          class="px-8 py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
          Contáctanos Ahora
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Animaciones suaves para scroll */
html {
  scroll-behavior: smooth;
}

/* Efecto de parallax sutil */
.hero-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>