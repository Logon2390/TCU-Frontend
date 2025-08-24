<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/service/Admin.service'
import Card from '@/components/features/AppCard.vue'
import Input from '@/components/common/AppInput.vue'
import Button from '@/components/common/AppButton.vue'
import LogoCCPP from '@/assets/icons/LogoCCPP.vue'
import { images } from '@/config/images.config'
import { useModal } from '@/composables/useModal'

const modal = useModal()
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

async function handleSubmit(event: Event) {
    event.preventDefault()
    if (newPassword.value !== confirmPassword.value) {
        modal.showToast('error', 'Las contraseñas no coinciden')
        return
    }
    isLoading.value = true

    try {
        const response = await resetPassword(route.query.token as string, newPassword.value)
        if (response?.success) {
            modal.showToast('success', 'Contraseña restablecida correctamente')
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
            <Card :variant="'elevated'" :padding="'lg'" :rounded="'xl'">
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
                    <div>
                        <form @submit.prevent="handleSubmit" class="space-y-5">
                            <Input
                                :labelProps="{ id: 'newPassword', label: 'Nueva contraseña', icon: 'icon-[lucide--lock]', class: 'text-white' }"
                                :inputProps="{ type: 'password', required: true }" v-model="newPassword" />

                            <Input
                                :labelProps="{ id: 'confirmPassword', label: 'Confirmar contraseña', icon: 'icon-[lucide--lock]', class: 'text-white' }"
                                :inputProps="{ type: 'password', required: true }" v-model="confirmPassword" />

                            <div class="flex items-center justify-between">
                                <p class="text-xs text-warning/90">Asegúrese de usar una contraseña segura.</p>
                            </div>
                            <Button
                                :buttonProps="{ variant: 'primary', type: 'submit', text: isLoading ? 'Restableciendo...' : 'Restablecer contraseña', loading: isLoading, icon: 'icon-[lucide--key-round] text-white' }" />
                        </form>
                    </div>
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
