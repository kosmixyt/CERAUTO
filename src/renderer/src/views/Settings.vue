<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { saveApiKey, getApiKey, saveStringArray, getStringArray } from '../services/settingsService'

const apiKey = ref('')
const apiKeyStatus = ref('') // Statut spécifique pour la clé API
const stringArrayStatus = ref('') // Statut spécifique pour le tableau de chaînes
const isLoading = ref(false)
const stringArray = ref<string[]>([])
const newString = ref('')

onMounted(async () => {
  const savedKey = await getApiKey()
  if (savedKey) {
    apiKey.value = savedKey
  }

  const savedArray = await getStringArray()
  if (savedArray) {
    stringArray.value = savedArray
  }
})

const saveSettings = async () => {
  isLoading.value = true
  try {
    await saveApiKey(apiKey.value)
    apiKeyStatus.value = 'Clé API sauvegardée avec succès!'
    setTimeout(() => {
      apiKeyStatus.value = ''
    }, 3000)
  } catch (error) {
    apiKeyStatus.value = 'Erreur lors de la sauvegarde'
  }
  isLoading.value = false
}

const clearApiKey = async () => {
  apiKey.value = ''
  await saveApiKey('')
  apiKeyStatus.value = 'Clé API effacée'
  setTimeout(() => {
    apiKeyStatus.value = ''
  }, 3000)
}

const addString = async () => {
  if (newString.value.trim()) {
    stringArray.value.push(newString.value.trim())
    await saveStringArray(stringArray.value)
    newString.value = ''
    stringArrayStatus.value = 'Liste mise à jour avec succès!'
    setTimeout(() => {
      stringArrayStatus.value = ''
    }, 3000)
  }
}

const removeString = async (index: number) => {
  stringArray.value.splice(index, 1)
  await saveStringArray(stringArray.value)
  stringArrayStatus.value = 'Élément supprimé avec succès!'
  setTimeout(() => {
    stringArrayStatus.value = ''
  }, 3000)
}
</script>

<template>
  <div class="settings-container">
    <div class="content-container">
      <h1 class="text-green-300 text-2xl font-bold mb-3">Paramètres</h1>

      <div class="api-key-section p-4 bg-green-800 rounded-lg shadow-md border border-green-700 mb-6">
        <h2 class="text-lg font-medium text-green-200">Configuration DeepSeek API</h2>

        <p class="text-green-200 mb-4">
          Entrez votre clé API DeepSeek pour activer les fonctionnalités d'IA.
        </p>

        <div class="mb-6">
          <label for="api-key" class="block text-green-200 mb-2 font-medium">Clé API DeepSeek</label>
          <input id="api-key" type="password" v-model="apiKey" placeholder="sk-..."
            class="w-full p-3 bg-green-700 border border-green-600 rounded text-green-100 font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div class="flex gap-4">
          <button @click="saveSettings" :disabled="isLoading"
            class="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {{ isLoading ? 'Sauvegarde en cours...' : 'Sauvegarder' }}
          </button>

          <button @click="clearApiKey" :disabled="!apiKey"
            class="px-4 py-2 bg-green-700 text-green-100 font-medium rounded hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            Effacer la clé
          </button>
        </div>

        <div v-if="apiKeyStatus" class="mt-4 p-3 bg-green-700 rounded border border-green-600 text-green-200">
          {{ apiKeyStatus }}
        </div>
      </div>

      <div class="string-array-section p-4 bg-green-800 rounded-lg shadow-md border border-green-700">
        <h2 class="text-lg font-medium text-green-200 mb-4">Liste de valeurs</h2>

        <div class="mb-4">
          <label for="new-string" class="block text-green-200 mb-2 font-medium">Ajouter un nouvel élément</label>
          <div class="flex gap-2">
            <input id="new-string" type="text" v-model="newString" placeholder="Nouvelle valeur..."
              class="flex-grow p-3 bg-green-700 border border-green-600 rounded text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button @click="addString" :disabled="!newString.trim()"
              class="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              Ajouter
            </button>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-green-200 mb-2 font-medium">Éléments enregistrés</h3>
          <div v-if="stringArray.length === 0" class="p-3 bg-green-700 rounded border border-green-600 text-green-200">
            Aucun élément enregistré
          </div>
          <ul v-else class="bg-green-700 rounded border border-green-600 divide-y divide-green-600">
            <li v-for="(item, index) in stringArray" :key="index" class="p-3 flex justify-between items-center">
              <span class="text-green-100">{{ item }}</span>
              <button @click="removeString(index)" class="p-1 text-green-300 hover:text-green-100 transition-colors"
                title="Supprimer">
                <span class="font-bold">×</span>
              </button>
            </li>
          </ul>
        </div>

        <div v-if="stringArrayStatus" class="mt-4 p-3 bg-green-700 rounded border border-green-600 text-green-200">
          {{ stringArrayStatus }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  min-height: calc(100vh - 64px);
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #1e3a2b;
  color: #e1f2e5;
  overflow-y: auto;
  position: relative;
  height: 100%;
  max-height: calc(100vh - 64px);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  padding-bottom: 2rem;
}

/* Ensure this matches with topbar background color */
.bg-green-900 {
  background-color: #1e3a2b;
}

/* Ensure proper color consistency with the topbar */
.bg-green-800 {
  background-color: #2a4c39;
}

/* Styles pour assurer une bonne gestion du défilement */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #152118;
  /* Couleur plus foncée pour le track */
}

::-webkit-scrollbar-thumb {
  background: #3a895a;
  /* Couleur plus vive pour la barre */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4ca36c;
  /* Couleur plus claire au survol */
}
</style>
