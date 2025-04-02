<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const htmlContent = ref('');
const selectedFileName = ref<string | null>(null);
const selectedFile = ref<File | null>(null); // Store the actual File object

const startCreation = () => {
    isLoading.value = true;

    // Send request to main process
    window.electron.ipcRenderer.send('request-html');

    // Listen for response from main process
    const onres = (html, data) => {
        htmlContent.value = data;
        isLoading.value = false;
        // Remove the listener after receiving the response
        window.electron.ipcRenderer.removeListener('response-html', onres);
    }
    window.electron.ipcRenderer.once('response-html', onres);
};

const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        selectedFileName.value = file.name;
        selectedFile.value = file; // Store the File object
        console.log('Fichier sélectionné :', file.name);
        // Ajoutez ici le traitement du fichier si nécessaire
    }
};

const resetFileSelection = () => {
    selectedFileName.value = null;
    selectedFile.value = null; // Reset file object
};

const validateAndContinue = () => {
    // Store the file in localStorage (will be retrieved in DocumentEditorView)
    if (selectedFile.value) {
        // We can't directly store File objects in localStorage, so we'll use a flag
        localStorage.setItem('hasSelectedFile', 'true');
        
        // Store the file in a global variable that can be accessed by DocumentEditorView
        window.selectedFileTransfer = selectedFile.value;
    }
    
    // Pass the HTML content to the document editor view
    router.push({
        path: '/document-editor',
        query: { 
            htmlContent: encodeURIComponent(htmlContent.value)
        }
    });
};
</script>

<template>
    <div class="create-container">
        <div class="content-container mb-6">
            <h1 class="text-green-300 text-2xl font-bold mb-3">Création de certificat</h1>
            <p class="text-green-200 mb-4">Utilisez cet outil pour générer votre certificat.</p>

            <!-- Create Button Section -->
            <div class="create-section p-4 bg-green-800 rounded-lg shadow-md border border-green-700"
                v-if="!htmlContent">
                <h2 class="text-lg font-medium text-green-200 mb-4">Commencez la création</h2>

                <button @click="startCreation"
                    class="px-6 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-500 transition-colors">
                    Commencer à créer
                </button>
            </div>

            <!-- HTML Content Display Section -->
            <div class="html-content-container pb-6 p-4 bg-green-800 rounded-lg shadow-md border border-green-700 mt-4"
                v-if="htmlContent">
                <div class="html-content-wrapper">
                    <div class="html-content" v-html="htmlContent"></div>
                </div>

                <!-- File Upload Section -->
                <div class="file-upload mt-4 mb-2">
                    <label for="file-upload" class="block text-green-200 mb-2">Veuillez uploader un fichier texte (doc
                        ou docx) :</label>
                    <input v-if="!selectedFileName" id="file-upload" type="file" accept=".pdf,.odt,.doc,.docx,.txt"
                        @change="handleFileUpload"
                        class="block w-full text-green-900 bg-green-100 border border-green-700 rounded-lg p-2" />

                    <div v-if="selectedFileName"
                        class="file-info bg-green-700 text-green-100 p-3 rounded-lg flex items-center justify-between">
                        <span class="file-name font-medium">{{ selectedFileName }}</span>
                        <button @click="resetFileSelection"
                            class="ml-4 px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-500 transition-colors">
                            Changer de fichier
                        </button>
                    </div>
                </div>

                <!-- Validation Button - Only appears when a file is selected -->
                <div v-if="selectedFileName" class="validation-section mt-6 flex justify-center">
                    <button @click="validateAndContinue"
                        class="px-6 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-500 transition-colors w-full md:w-auto">
                        Valider et continuer
                    </button>
                </div>
            </div>
        </div>

        <!-- Full Screen Loading Overlay -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-container">
                <div class="spinner"></div>
                <p class="mt-4 text-green-200">Chargement en cours...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.create-container {
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

/* Loading overlay styles */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(30, 58, 43, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spinner {
    border: 5px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top: 5px solid #4ade80;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Ensure this matches with HomeView.vue background colors */
.bg-green-900 {
    background-color: #1e3a2b;
}

.bg-green-800 {
    background-color: #2a4c39;
}

/* HTML content display styles */
.html-content-container {
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
}

.html-content-wrapper {
    overflow-y: auto;
    max-height: 65vh;
    scrollbar-width: thin;
    scrollbar-color: #3a895a #152118;
    /* Mise à jour des couleurs ici aussi */
}

.html-content {
    min-height: 100px;
}

:deep(.html-content img) {
    max-width: 100%;
    height: auto;
}

:deep(.html-content table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
}

:deep(.html-content td, .html-content th) {
    border: 1px solid #ddd;
    padding: 8px;
}

.file-upload input {
    cursor: pointer;
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80%;
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

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #1a2e23;
}

::-webkit-scrollbar-thumb {
    background: #2a4c39;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #3a5c49;
}

.validation-section button {
    min-width: 200px;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
