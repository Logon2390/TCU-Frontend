<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="navbar">
      <div class="container">
        <div class="logo">
          <RouterLink to="/">
            <img 
              src="@/assets/logoCCPP.svg" 
              alt="Centro Cívico por la Paz Pococi" 
              class="logo-image"
            />
          </RouterLink>
        </div>
        <nav>
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/user/Login" class="nav-link">Iniciar sesión</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  position: sticky;
  width:50vw; 
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
  height: 80%;
}

.logo-image {
  height: 70px;
  width: auto;
  margin-left: 10px;
}

nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: white;
}

.nav-link::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-exact-active {
  color: white !important;
}

.router-link-exact-active::after {
  width: 100%;
}

main {
  flex: 1;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }

  .logo {
    margin-bottom: 1rem;
  }

  nav {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: center;
  }
}
</style>