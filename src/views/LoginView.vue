<script setup lang="ts">
import { ref } from 'vue';
import { login } from '@/service/auth/Auth.service';
import Input from '@/components/common/AppInput.vue';
import Button from '@/components/common/AppButton.vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);

async function handleLogin() {
    isLoading.value = true;

    try {
        await login(email.value, password.value);

        // Redirige al usuario si el login fue exitoso
        window.location.href = '/';
    } catch (error) {
        console.error('Inicio de sesión fallido:', error);
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-800 ">
        <div class="flex-grow flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="bg-gradient-to-r from-red-600 via-white to-blue-600 h-2 rounded-t"></div>
                <div class="bg-gray-800 p-8 rounded-b shadow-lg">
                    <h2 class="text-xl font-semibold text-center text-gray-300 mb-6">
                        Iniciar sesión
                    </h2>
                    <form @submit.prevent="handleLogin" class="space-y-5">
                        <Input :labelProps="{ id: 'email', label: 'Correo electrónico', icon: 'icon-[lucide--mail]' }"
                            :inputProps="{ type: 'email', placeholder: 'jast@gmail.com', required: true, }"
                            autocomplete="email" v-model="email" />

                        <Input :labelProps="{ id: 'password', label: 'Contraseña', icon: 'icon-[lucide--lock]' }"
                            :inputProps="{ type: 'password', placeholder: '******', required: true }"
                            autocomplete="current-password" v-model="password" />

                        <div class="flex items-center justify-between">
                            <div class="text-sm">
                                <!-- Esto es para después para cuando implementemos la recuperacion de contraseña (cajina) -->
                                <a href="#" class="font-medium text-green-400 hover:text-green-300">
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>
                        </div>
                        <Button
                            :buttonProps="{ variant: 'primary', text: 'Iniciar sesión', loading: isLoading, icon: 'icon-[lucide--user]', onClick: handleLogin }" />
                    </form>
                    <div class="mt-6 text-center text-sm text-gray-400">
                        <p>Centro Cívico por la Paz de Pococí, Limón, Costa Rica</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>