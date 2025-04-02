<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const route = useRoute();
function handleLogin() {
    console.log('Correo:', email.value);
    console.log('Contraseña:', password.value);
}

</script>
<template>

    <div class="login">
        <h1 class="green">Login</h1>


        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Correo:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Iniciar sesión</button>
        </form>


    </div>

</template>