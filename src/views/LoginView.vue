<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/service/Auth.service';
import Input from '@/components/common/AppInput.vue';
import Button from '@/components/common/AppButton.vue';
import Card from '@/components/features/AppCard.vue';
import LogoCCPP from '@/assets/icons/LogoCCPP.vue';
import { useRouter } from 'vue-router';
import { images } from '@/config/images.config';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);

async function handleLogin() {
    isLoading.value = true;

    try {
        await AuthService.login(email.value, password.value);
        router.push('/admin/overview');
    } catch (error) {
        console.error('Inicio de sesión fallido:', error);
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
        isLoading.value = false;
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
                            <h2 class="text-xl font-semibold text-white">Iniciar sesión</h2>
                        </div>
                    </div>
                </template>

                <div class="     items-center">
                    <div>
                        <form @submit.prevent="handleLogin" class="space-y-5">
                            <Input
                                :labelProps="{ id: 'email', label: 'Correo electrónico', icon: 'icon-[lucide--mail]', class: 'text-white' }"
                                :inputProps="{ type: 'email', placeholder: 'admin@dominio.com', required: true }"
                                autocomplete="email" v-model="email" />

                            <Input
                                :labelProps="{ id: 'password', label: 'Contraseña', icon: 'icon-[lucide--lock]', class: 'text-white' }"
                                :inputProps="{ type: 'password', placeholder: '••••••••', required: true }"
                                autocomplete="current-password" v-model="password" />

                            <div class="flex flex-col items-start justify-between">
                                <p class="text-xs text-warning/90">Acceso restringido solo a personal autorizado</p>
                                <a href="/admin/forgot" class="text-sm font-medium text-success hover:underline">
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>
                            <Button
                                :buttonProps="{ variant: 'primary', text: 'Iniciar sesión', loading: isLoading, icon: 'icon-[lucide--user] text-white', onClick: handleLogin }" />
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