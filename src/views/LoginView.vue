<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/service/Auth.service';
import Input from '@/components/common/AppInput.vue';
import Button from '@/components/common/AppButton.vue';
import Card from '@/components/features/AppCard.vue';
import LogoCCPP from '@/assets/icons/LogoCCPP.vue';
import { useRouter } from 'vue-router';
import useFetching from '@/composables/useFetching';
import { images } from '@/config/images.config';
import { useModal } from '@/composables/useModal';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login: authLogin } = useAuth();
const email = ref('');
const password = ref('');
const verificationPhase = ref(false);
const LoginError = ref(false);
const verificationError = ref(false);
const verificationCode = ref('');
const modal = useModal();
const { isLoading: isLoginLoading, execute: executeLogin } = useFetching(AuthService.login);
const { isLoading: isVerificationLoading, execute: executeVerification } = useFetching(AuthService.verifyCode);

async function handleLogin() {
    try {
        const response = await executeLogin(email.value, password.value);
        if (response.success) {
            LoginError.value = false;
            verificationPhase.value = true;
            modal.showToast('info', 'Se ha enviado un código de verificación a tu correo electrónico.');

            return;
        } else {
            LoginError.value = true;
            verificationPhase.value = false;
        }
    } catch (error) {
        modal.showToast('error', 'Error al iniciar sesión.');
    }
}

async function handleVerification() {
    const response = await executeVerification(email.value, verificationCode.value);
    if (response.success) {
        verificationPhase.value = false;
        verificationCode.value = '';

        authLogin(response.data)
        router.push('/admin/stats');
    } else {
        verificationError.value = true;
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-bl from-background to-primary/40 flex flex-row p-4 lg:p-0">
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
                            <h2 class="text-xl font-semibold text-white">Iniciar sesión</h2>
                        </div>
                    </div>
                </template>

                <div class="items-center">
                    <div>
                        <form v-if="!verificationPhase" @submit.prevent="handleLogin" class="space-y-5">
                            <Input
                                :labelProps="{ id: 'email', label: 'Correo electrónico', icon: 'icon-[lucide--mail]', class: 'text-white' }"
                                :inputProps="{ type: 'email', placeholder: 'admin@dominio.com', required: true }"
                                :errorProps="{ onError: LoginError }" autocomplete="email" v-model="email" />

                            <Input
                                :labelProps="{ id: 'password', label: 'Contraseña', icon: 'icon-[lucide--lock]', class: 'text-white' }"
                                :inputProps="{ type: 'password', placeholder: '••••••••', required: true }"
                                :errorProps="{ onError: LoginError, message: 'El correo electrónico o la contraseña son incorrectos.' }"
                                autocomplete="current-password" v-model="password" />

                            <div class="flex flex-col items-start justify-between">
                                <p class="text-xs text-warning/90">Acceso restringido solo a personal autorizado</p>
                                <div class="text-sm font-medium text-success hover:underline cursor-pointer"
                                    @click="router.push('/forgot')">
                                    ¿Olvidó su contraseña?
                                </div>
                            </div>
                            <Button
                                :buttonProps="{ variant: 'primary', text: 'Iniciar sesión', loading: isLoginLoading, icon: 'icon-[lucide--user] text-white', onClick: handleLogin }" />
                        </form>
                        <div v-if="verificationPhase">
                            <div class="space-y-5" v-motion :initial="{ opacity: 0, y: 16 }"
                                :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 300 } }">
                                <Input
                                    :labelProps="{ id: 'code', label: 'Código de verificación', icon: 'icon-[lucide--shield-check]', class: 'text-white' }"
                                    :inputProps="{ type: 'number', placeholder: '123456', required: true }"
                                    :errorProps="{ onError: verificationError, message: 'El código de verificación es incorrecto.' }"
                                    v-model="verificationCode" />
                                <Button
                                    :buttonProps="{ variant: 'primary', text: 'Verificar', loading: isVerificationLoading, icon: 'icon-[lucide--user] text-white', onClick: handleVerification }" />
                                <div class="text-sm font-medium text-success hover:underline cursor-pointer"
                                    @click="verificationPhase = false">
                                    Volver al login
                                </div>
                            </div>
                        </div>
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