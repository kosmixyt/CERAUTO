<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getApiKey } from '../services/settingsService'; // Importer le service

const router = useRouter();
const hasApiKey = ref(false);
const remainingBalance = ref(null);
const isLoading = ref(true);

// Check if API key exists and get remaining balance
onMounted(async () => {
    try {
        // Utiliser le même service que Settings.vue pour la cohérence
        const apiKey = await getApiKey();

        if (apiKey) {
            hasApiKey.value = true;
            // Replace with actual API call to get remaining balance
            const response = await fetchRemainingBalance(apiKey);
            remainingBalance.value = response.balance;
        }
    } catch (error) {
        console.error('Error fetching API key balance:', error);
    } finally {
        isLoading.value = false;
    }
});

// Replace this with your actual balance fetching logic
const fetchRemainingBalance = async (apiKey: string) => {
    // Simulate API call - replace with actual implementation
    return new Promise<{ balance: string }>(resolve => {
        fetch("https://api.deepseek.com/user/balance", {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        }).then((res) => res.json())
            .then(data => {
                // console.log(data.balance_infos[0].total_balance);
                resolve({ balance: `${data.balance_infos[0].total_balance} ${data.balance_infos[0].currency}` });
            })
    });
};

const goToSettings = () => {
    router.push('/settings');
};
</script>

<template>
    <div class="home-container">
        <div class="content-container">
            <h1 class="text-green-300 text-2xl font-bold mb-3">Page d'accueil</h1>
            <p class="text-green-200 mb-4">Bienvenue sur la page d'accueil de l'application.</p>

            <!-- API Key Balance Section -->
            <div class="api-key-section p-4 bg-green-800 rounded-lg shadow-md border border-green-700">
                <h2 class="text-lg font-medium text-green-200">Statut de votre API Key</h2>

                <div v-if="isLoading" class="mt-2 py-2">
                    <p class="text-green-400">Chargement...</p>
                </div>

                <div v-else-if="hasApiKey" class="mt-2 py-2">
                    <div class="flex items-center">
                        <div class="mr-2 h-3 w-3 rounded-full bg-green-400"></div>
                        <span class="text-green-200">API Key active</span>
                    </div>
                    <div class="mt-2 bg-green-700 p-3 rounded border border-green-600">
                        <p class="text-green-300">Crédit restant :</p>
                        <p class="text-xl font-bold text-green-200">{{ remainingBalance }}</p>
                    </div>
                </div>

                <div v-else class="mt-2 py-2">
                    <div class="flex items-center mb-2">
                        <div class="mr-2 h-3 w-3 rounded-full bg-red-400"></div>
                        <span class="text-green-200">Aucune API Key configurée</span>
                    </div>
                    <button @click="goToSettings"
                        class="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-500 transition-colors">
                        Configurer votre API Key
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-container {
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
