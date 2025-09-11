<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Accessibility, type IAccessibilityIconPositionOptions } from 'accessibility';
import Header from './components/layout/AppHeader.vue'
import Footer from './components/layout/AppFooter.vue'
import Sidebar from './components/layout/AppSidebar.vue'
import { onMounted } from 'vue';

onMounted(() => {
  let accessibility = new Accessibility({
    labels: {
      resetTitle: "Reiniciar",
      closeTitle: "Cerrar",
      increaseText: "Aumentar texto",
      decreaseText: "Disminuir texto",
      increaseTextSpacing: "Aumentar espaciado",
      decreaseTextSpacing: "Disminuir espaciado",
      invertColors: "Invertir colores",
      grayHues: "Grises",
      menuTitle: "Menú",
      textToSpeech: "Texto a voz",
      bigCursor: "Cursor grande",
      readingGuide: "Guía de lectura",
      underlineLinks: "Subrayar enlaces",
      speechToText: "Texto a voz",
      disableAnimations: "Deshabilitar animaciones",
      increaseLineHeight: "Aumentar altura",
      decreaseLineHeight: "Disminuir altura",
      hotkeyPrefix: "Prefijo de teclado",
    },
    modules: {
      increaseText: true,
      decreaseText: true,
      increaseTextSpacing: true,
      decreaseTextSpacing: true,
      increaseLineHeight: false,
      decreaseLineHeight: false,
      readingGuide: false,
      underlineLinks: true,
      speechToText: true,
      disableAnimations: true,
      textToSpeech: true,
      bigCursor: false,
      invertColors: true,
      grayHues: true,
    },
    textToSpeechLang: 'es-ES',
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Sidebar />

    <main class="flex-1">
      <Header />
      <RouterView />
      <Footer />
    </main>
  </div>
</template>