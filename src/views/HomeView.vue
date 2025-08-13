<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoCCPP from '@/assets/icons/LogoCCPP.vue'

const router = useRouter()

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

function contactanos() {
  // Scroll hacia la sección de contacto
  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
}

function conoceMas() {
  // Scroll hacia la sección quiénes somos
  document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-background">

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4">
      <div class="text-center space-y-8 max-w-4xl mx-auto">

        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="relative">
            <div
              class="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-full blur-xl opacity-30 scale-110">
            </div>
            <div class="relative bg-gray-900 rounded-full p-6">
              <LogoCCPP :width="120" :height="120" />
            </div>
          </div>
        </div>

        <!-- Título Principal -->
        <h1
          class="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 leading-tight">
          Centro Cívico por la Paz
        </h1>

        <h2 class="text-2xl md:text-3xl font-semibold text-gray-200">
          Pococi, Costa Rica
        </h2>

        <!-- Mensaje Principal -->
        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Construyendo puentes hacia una comunidad más unida, pacífica y próspera.
          Trabajamos juntos por el desarrollo social y la convivencia armoniosa en Pococi.
        </p>

        <!-- Botones de Acción -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button @click="conoceMas"
            class="px-8 py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out">
            Conoce Más
          </button>
          <button @click="contactanos"
            class="px-8 py-4 border-2 border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 hover:border-gray-300 transition duration-300 ease-in-out">
            Contáctanos
          </button>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>

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
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 class="text-2xl font-semibold text-gray-200 mb-4">Nuestra Misión</h3>
              <p class="text-gray-300 leading-relaxed">
                Promover la cultura de paz, la participación ciudadana y el desarrollo
                sostenible en Pococi, fortaleciendo el tejido social y construyendo
                espacios de diálogo y convivencia.
              </p>
            </div>

            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 class="text-2xl font-semibold text-gray-200 mb-4">Nuestra Visión</h3>
              <p class="text-gray-300 leading-relaxed">
                Ser el referente en la construcción de paz y desarrollo comunitario
                en Pococi, donde cada persona pueda vivir con dignidad, respeto y
                oportunidades de crecimiento.
              </p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500/20 to-purple-600/20 rounded-lg p-8 border border-gray-600">
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
          </div>
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
          <div v-for="programa in programas" :key="programa.titulo"
            class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition duration-300 hover:transform hover:-translate-y-2">
            <div class="text-4xl mb-4">{{ programa.icono }}</div>
            <h3 class="text-xl font-semibold text-gray-200 mb-3">{{ programa.titulo }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ programa.descripcion }}</p>
          </div>
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
          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="text-3xl mb-4">📍</div>
            <h3 class="text-lg font-semibold text-gray-200 mb-2">Ubicación</h3>
            <p class="text-gray-400">Pococi, Limón<br>Costa Rica</p>
          </div>

          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="text-3xl mb-4">📞</div>
            <h3 class="text-lg font-semibold text-gray-200 mb-2">Teléfono</h3>
            <p class="text-gray-400">+506 XXXX-XXXX</p>
          </div>

          <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="text-3xl mb-4">✉️</div>
            <h3 class="text-lg font-semibold text-gray-200 mb-2">Email</h3>
            <p class="text-gray-400">info@ccpp-pococi.org</p>
          </div>
        </div>

        <button @click="contactanos"
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