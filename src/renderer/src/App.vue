<script setup lang="ts">
import { RouterView } from 'vue-router'


// Fonctions pour contrôler la fenêtre Electron
const minimizeWindow = () => {
  window.electron.ipcRenderer.send('minimize-window')
}

const maximizeWindow = () => {
  window.electron.ipcRenderer.send('maximize-window')
}

const closeWindow = () => {
  window.electron.ipcRenderer.send('close-window')
}
</script>

<template>
  <div class="app-container">
    <!-- Barre de titre personnalisée pour Electron -->
    <div class="title-bar">
      <div class="title-bar-text">CerAuto</div>
      <div class="window-controls">
        <button class="window-control minimize" @click="minimizeWindow">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <rect x="1" y="6" width="10" height="1" fill="currentColor" />
          </svg>
        </button>
        <button class="window-control maximize" @click="maximizeWindow">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </button>
        <button class="window-control close" @click="closeWindow">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.4" />
            <line x1="1" y1="11" x2="11" y2="1" stroke="currentColor" stroke-width="1.4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation existante -->
    <header class="top-bar">
      <nav>
        <div class="nav-left">
          <router-link to="/" class="nav-button">Home</router-link>
          <router-link to="/create" class="nav-button">Creer</router-link>
        </div>
        <div class="nav-right">
          <router-link to="/settings" class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
              </path>
            </svg>
            Paramètres
          </router-link>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
/* Style pour la frame Electron */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #1a2e23;
}

.title-bar {
  height: 32px;
  background-color: #162218;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-app-region: drag;
  /* Rend la barre de titre draggable */
  user-select: none;
}

.title-bar-text {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag;
  /* Les boutons ne sont pas draggable */
}

.window-control {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.window-control:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.window-control.minimize:hover {
  background-color: #3f4f3a;
}

.window-control.maximize:hover {
  background-color: #3f4f3a;
}

.window-control.close:hover {
  background-color: #c42b1c;
}

.content {
  flex: 1;
  overflow-y: auto;
}

/* Styles existants */
.top-bar {
  background-color: #1e3a2b;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

nav {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  -webkit-app-region: no-drag;
  /* Les boutons ne sont pas draggable */
}

.nav-button:hover {
  background-color: #2c5842;
}

.nav-button.router-link-active {
  background-color: #39734f;
}

main {
  padding: 1rem;
}
</style>
