<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const route = useRoute();
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);

function handleLogin() {
    isLoading.value = true;

    setTimeout(() => {
        console.log('Correo:', email.value);
        console.log('Contraseña:', password.value);
        console.log('Recordarme:', rememberMe.value);
        isLoading.value = false;
    }, 1000);
}

function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
}

</script>

<template>
    <div class="min-h-screen bg-gray-900 flex flex-col">


        <div class="flex-grow flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="bg-gradient-to-r from-red-600 via-white to-blue-600 h-2 rounded-t"></div>
                
                <div class="bg-gray-800 p-8 rounded-b shadow-lg">
                    <h1 class="text-2xl font-bold text-center text-gray-100 mb-2">
                        Centro Cívico Por La Paz
                    </h1>
                    
                    <h2 class="text-xl font-semibold text-center text-gray-300 mb-6">
                        Iniciar sesión
                    </h2>
                    
                    <form @submit.prevent="handleLogin" class="space-y-5">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Correo electrónico</label>
                            <input type="email" id="email" v-model="email" required
                                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="ejemplo@correo.com" />
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
                                    class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="******" />
                                <button type="button" @click="togglePasswordVisibility" 
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none">
                                    <span class="text-xs">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="remember-me" v-model="rememberMe" type="checkbox"
                                    class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded">
                                <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                                    Recordarme
                                </label>
                            </div>
                            
                            <div class="text-sm">
                                <!-- Esto es para después para cuando implementemos la recuperacion de contraseña (cajina) -->
                                <a href="#" class="font-medium text-green-400 hover:text-green-300">
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>
                        </div>
                        
                        <div>
                             <!-- gracias copilot -->
                            <button type="submit"
                            
                                class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                                :disabled="isLoading">
                                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                            </button>
                        </div>
                    </form>
                    
                    <div class="mt-6 text-center text-sm text-gray-400">
                        <p>Centro Cívico por la Paz de Pococí, Limón, Costa Rica</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>