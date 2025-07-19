<script setup lang="ts">

import { ref } from 'vue';

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

function handleSubmit(event: Event) {
    event.preventDefault();
    isLoading.value = true;

    if (password.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        return;
    }

    setTimeout(() => {
        isLoading.value = false;
    }, 2000);
    console.log(password.value, confirmPassword.value);

}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-800">
        <div class="flex-grow flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="bg-gradient-to-r from-red-600 via-white to-blue-600 h-2 rounded-t"></div>

                <div class="bg-gray-800 p-8 rounded-b shadow-lg">
                    <h2 class="text-xl font-semibold text-center text-gray-300 mb-6">
                        Restablecer contraseña
                    </h2>

                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
                                Nueva contraseña
                            </label>
                            <input type="password" id="password" v-model="password" required
                                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="******">
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
                                Confirmar contraseña
                            </label>
                            <input type="password" id="confirmPassword" v-model="confirmPassword" required
                                class="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="******">
                        </div>

                        <button type="submit"
                            class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Restablecer contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
