<script setup lang="ts">
import { ref } from 'vue'
import { requestPasswordReset } from '@/service/Admin.service'
import Card from '@/components/features/AppCard.vue'
import Input from '@/components/common/AppInput.vue'
import Button from '@/components/common/AppButton.vue'
import LogoCCPP from '@/assets/icons/LogoCCPP.vue'
import { images } from '@/config/images.config'
import { useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'

const email = ref('')
const isLoading = ref(false)
const router = useRouter()
const modal = useModal()

async function handleSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true

  try {
    const response = await requestPasswordReset(email.value)
    if (response?.success) {
      modal.showToast('success', 'Correo enviado con enlace para restablecer contraseña')
      router.push('/admin/Login')
    } else {
      modal.showToast('error', response?.message)
    }
  } catch (err: any) {
    modal.showToast('error', err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-bl from-background to-primary flex flex-row p-4 lg:p-0">
    <div class="w-1/2 hidden lg:block">
      <img :src="images.registration.hero" :alt="images.registration.alt" class="w-full h-full object-cover" />
    </div>
    <div class="w-full lg:w-1/2 flex items-center justify-center">
      <Card :variant="'elevated'" :padding="'lg'" :rounded="'xl'" v-motion :initial="{ opacity: 0, y: 16 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 300 } }">
        <template #header>
          <div class="flex items-center gap-3">
            <LogoCCPP class="w-10 h-10" />
            <div>
              <p class="text-sm text-text-secondary">Panel Administrativo</p>
              <h2 class="text-xl font-semibold text-white">Restablecer contraseña</h2>
            </div>
          </div>
        </template>

        <div class="items-center">
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <Input
              :labelProps="{ id: 'email', label: 'Correo electrónico', icon: 'icon-[lucide--mail]', class: 'text-white' }"
              :inputProps="{ type: 'email', placeholder: 'admin@dominio.com', required: true }" v-model="email" />

            <Button
              :buttonProps="{ variant: 'primary', type: 'submit', text: isLoading ? 'Enviando...' : 'Enviar enlace', loading: isLoading, icon: 'icon-[lucide--send] text-white' }" />

            <div class="text-center">
              <div class="text-sm font-medium text-success hover:underline cursor-pointer"
                @click="router.push('/admin/Login')">
                Volver al login
              </div>
            </div>
          </form>
        </div>

        <template #footer>
          <div class="mt-6 text-center text-sm text-text-secondary">
            <p>Centro Cívico por la Paz de Pococí, Limón, Costa Rica</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
