<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { 
  streamChatCompletion, 
  addMessage, 
  getMessages
} from '../services/deepSeekService';
import jsPDF from 'jspdf';

// Note: Simplified implementation without Tailwind
const htmlContent = ref('<p style="color: blue; font-size: 1.25rem;">Commencez à éditer votre document ici...</p>');
const prompt = ref('');
const chatMessages = ref<Array<{role: string, content: string}>>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const isInitialized = ref(false); // Track if initialization has been done
const selectedFile = ref<File | null>(null);
const extractedFileText = ref<string>('');
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let currentStreamingMessageIndex = -1;

// Initialize Monaco editor
onMounted(async () => {
    // Check if a file was transferred from CreateView
    if (localStorage.getItem('hasSelectedFile') === 'true' && window.selectedFileTransfer) {
        selectedFile.value = window.selectedFileTransfer;
        // Clean up
        localStorage.removeItem('hasSelectedFile');
        delete window.selectedFileTransfer;
    }
    
    // Reset initialization state to ensure button visibility
    isInitialized.value = false;
    
    // Charger les messages existants de l'historique
    chatMessages.value = getMessages();
    
    // Only set initialized if there are valid chat messages
    if (chatMessages.value.length > 1) { // At least one exchange (user + assistant)
        isInitialized.value = true;
    }
    
    const editorContainer = document.getElementById('monaco-editor-container');
    if (editorContainer) {
        // Create a proper model with URI
        const modelUri = monaco.Uri.parse('file:///index.html');
        const model = monaco.editor.createModel(htmlContent.value, 'html', modelUri);

        editor = monaco.editor.create(editorContainer, {
            model: model,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: {
                enabled: false
            }
        });

        editor.onDidChangeModelContent(() => {
            if (editor) {
                htmlContent.value = editor.getValue();
            }
        });
    }

    // Initialize preview with simple HTML rendering
    updatePreview();
});

// Watch for changes in htmlContent to update the preview
watch(htmlContent, () => {
    updatePreview();
});

// Function to update the preview with simple HTML rendering
const updatePreview = () => {
    const previewElement = document.querySelector('.document-content') as HTMLDivElement;
    if (previewElement) {
        try {
            // Simple direct HTML rendering
            previewElement.innerHTML = htmlContent.value;
        } catch (error) {
            console.error('Error updating preview:', error);
            previewElement.innerHTML = '<p>Erreur d\'affichage du contenu HTML</p>';
        }
    }
};

// Clean up editor on component unmount
onUnmounted(() => {
    if (editor) {
        editor.dispose();
    }
});

// Fonction pour extraire le texte d'un PDF
async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.electron.ipcRenderer.invoke('extract-pdf-text', arrayBuffer);
        
        if (result.success) {
            return result.text;
        } else {
            throw new Error(result.error || 'Erreur lors de l\'extraction du texte');
        }
    } catch (error) {
        console.error('Erreur lors de l\'extraction du texte du fichier:', error);
        throw error;
    }
}

const sendPrompt = async () => {
    if (!prompt.value.trim() && !selectedFile.value) return;

    errorMessage.value = '';
    let userContent = prompt.value;

    // Extraire le texte du fichier s'il est sélectionné
    if (selectedFile.value) {
        isLoading.value = true;
        try {
            const fileText = await extractTextFromPDF(selectedFile.value);
            extractedFileText.value = fileText;
            userContent += `\n\nContenu du fichier ${selectedFile.value.name}:\n${fileText}`;
            // Reset selected file
            selectedFile.value = null;
        } catch (error) {
            console.error('Erreur lors de l\'extraction du texte du fichier:', error);
            errorMessage.value = `Erreur: Impossible d'extraire le texte du fichier. ${error.message || ''}`;
            isLoading.value = false;
            return;
        }
    }
    userContent = `
    tu répond de la forme json { "htmlContent": "le code html", "explication": "une explication de la structure du document (du html aussi !!)"
    à la question suivante: ${userContent}
    TOUT TES MESSAGES DOIVENT ÊTRE EN FRANÇAIS ET DANS CE FORMAT.
    Ne me donne pas d'autres informations, juste le json.
    et tu réécris le code html en entier si tu fais des modifications.
    `

    // Add user message to both display and session
    const userMessage = { role: 'user', content: userContent };
    chatMessages.value.push(userMessage);
    addMessage(userMessage);

    // Clear prompt input right after sending
    prompt.value = '';

    // Set loading state
    isLoading.value = true;

    try {
        // Add empty assistant message to display (only for UI purposes)
        chatMessages.value.push({ role: 'assistant', content: '' });
        currentStreamingMessageIndex = chatMessages.value.length - 1;

        // Start streaming response
        const streamGenerator = streamChatCompletion();

        for await (const textChunk of streamGenerator) {
            // Append each new chunk to the assistant's message in UI
            chatMessages.value[currentStreamingMessageIndex].content += textChunk;
            // Scroll the chat area to show new content
            scrollToLatestMessage();
        }
        // try to parse the JSON response
        try {
            // Extract JSON from the response, which might be wrapped in text
            const jsonMatch = chatMessages.value[currentStreamingMessageIndex].content.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
                const parsedResponse = JSON.parse(jsonMatch[0]);
                // Insert the parsed response into the editor
                insertTextToEditor(parsedResponse);
            } else {
                console.error('No JSON found in response');
                errorMessage.value = 'Erreur: Format de réponse invalide. Aucun JSON trouvé.';
            }
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            errorMessage.value = `Erreur: Impossible de parser la réponse JSON. ${parseError.message || ''}`;
        }
        // Set as initialized after successful response
    } catch (error) {
        console.error('Erreur lors du chat:', error);
        // Handle error - modify the message to show error
        if (currentStreamingMessageIndex >= 0) {
            if (chatMessages.value[currentStreamingMessageIndex].content === '') {
                chatMessages.value[currentStreamingMessageIndex].content =
                    `Erreur: Impossible de communiquer avec DeepSeek. ${error.message || 'Vérifiez votre clé API.'}`;
            }
        } else {
            errorMessage.value = `Erreur: ${error.message || 'Échec de connexion à l\'API.'}`;
        }
    } finally {
        isLoading.value = false;
        currentStreamingMessageIndex = -1;
    }
};

type InitializationResponse = {
    htmlContent: string;
    explication: string;
}

// Function to start initialization
const startInitialization = async () => {
    
    if (!selectedFile.value) {
        throw new Error('Aucun fichier sélectionné pour l\'initialisation.');
    }
    isLoading.value = true;
    let initialMessage = `
    Bonjour analyse le fichier joint et le code HTML ci-dessous.
    Ensuite rend moi uniquement un json de la structure suivante { "htmlContent": "le code html", "explication": "une explication de la structure du document (du html aussi !!)" }.
    TOUT TES MESSAGES DOIVENT ÊTRE EN FRANÇAIS ET DANS CE FORMAT.
    Ne me donne pas d'autres informations, juste le json.
    je veux que tu extraies les éléments suivants du fichier joint:
    Mots clés,
    Mots à définir,
    Contexte,
    Problématique,
    Containtes,
    Livrables,
    Généralisation,
    Pistes de solutions,
    Plan d'action
    
    Puis met fait moi une sorte de compte rendu avec les éléments suivants (en html bien sûr et met le style dans le html (attribut style)):
    Page 1:
    - Page de garde 
    en haut à gauche Mon prénom et mon nom Marine Boulanger
    fait en sorte que sur cette page le logo de cesi ne chevauche pas le nom
    Au milieu Le titre du prosit que tu as déduit du html
    Une image au milieu de la page (image de mon choix)
    - Page de sommaire
    Une table des matières avec un lien vers (Mots clés ... Plan d'action)
    Puis tu ajoutes chaque élément à la suite que tu as extrait du fichier joint (Mots clés ... Plan d'action) tu met une grande marge entre chaque element, tu fait en sorte que ca ne chevauche pas le logo de cesi
    Pour chaque "Mots à définir" tu ajoutera une définition.
    Ensuite tu expliquera en détaille (au moin 1,2 pages) les ressources lié dans le html. que tu appelera "Etude des ressources" (ajoute le à la table des matières)
    Puis tu ajoutera un titre résolution du problème mais ne met pas de contenu.
    Ensuite tu ajoutera un titre "Conclusion" mais ne met pas de contenu.
    Puis tu ajoutera un titre "Bilan personnel" et tu mettra un bilan personnel de 5-10 lignes.
    tu met une pagination en bas de chaque page (numéro de page au milieu et le nom du projet à gauche et mon prénom et nom à droite
    en haut de chaque page tu met le logo de l'école /logo.png (tu met une opacité de 0.5 sur le logo)
    FIN DU DOCUMENT.
    met un padding top de 60px pour le contenu de chaque page.
    Fais en sorte que le document soit bien structuré et lisible.
    met les titres en gras et en plus gros.
    fait pas 1 page par élément mais met les éléments à la suite.
    fait en sorte que les elements ne se chevauchent pas en bas de page (avec la pagination).
    Détaille moi les étapes que tu as suivi pour réaliser dans le json "explication" et met moi le tout dans un tableau avec une ligne par étape.
    fait en sorte que le style du document soit similaire à un document Word.
    Voici le code HTML:
    ${htmlContent.value}
    
    `;
    // Extraire le texte du fichier PDF si disponible
    if (selectedFile.value) {
        try {
            const fileText = await extractTextFromPDF(selectedFile.value);
            extractedFileText.value = fileText;
            initialMessage += `\n\nContenu du fichier ${selectedFile.value.name}:\n${fileText}`;
            // Reset selected file
            selectedFile.value = null;
        } catch (error) {
            console.error('Erreur lors de l\'extraction du texte du fichier:', error);
            errorMessage.value = `Erreur: Impossible d'extraire le texte du fichier. ${error.message || ''}`;
            isLoading.value = false;
            return;
        }
    }

    // Add user message to both display and session
    const userMessage = { role: 'user', content: initialMessage };
    chatMessages.value.push(userMessage);
    addMessage(userMessage);

    try {
        // Add empty assistant message to display (only for UI purposes)
        chatMessages.value.push({ role: 'assistant', content: '' });
        currentStreamingMessageIndex = chatMessages.value.length - 1;

        // Start streaming response
        const streamGenerator = streamChatCompletion();
        let fullResponse = ''; // Store the complete response

        for await (const textChunk of streamGenerator) {
            // Store the complete response
            fullResponse += textChunk;
            
            // Append each new chunk to the assistant's message in UI
            chatMessages.value[currentStreamingMessageIndex].content += textChunk;
            
            // Scroll the chat area to show new content
            scrollToLatestMessage();
        }

        // After streaming is complete, try to parse the JSON response
        try {
            // Extract JSON from the response, which might be wrapped in text
            const jsonMatch = fullResponse.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
                const parsedResponse: InitializationResponse = JSON.parse(jsonMatch[0]);
                
                // Update the editor with the HTML content
                if (editor && parsedResponse.htmlContent) {
                    editor.setValue(parsedResponse.htmlContent);
                    htmlContent.value = parsedResponse.htmlContent;
                    updatePreview();
                }
                
                // Replace the chat message with just the explanation
                if (parsedResponse.explication) {
                    chatMessages.value[currentStreamingMessageIndex].content = parsedResponse.explication;
                }
            } else {
                console.error('No JSON found in response');
                errorMessage.value = 'Erreur: Format de réponse invalide. Aucun JSON trouvé.';
            }
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            errorMessage.value = `Erreur: Impossible de parser la réponse JSON. ${parseError.message || ''}`;
        }

        // Set as initialized after successful response
        isInitialized.value = true;
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        if (currentStreamingMessageIndex >= 0) {
            if (chatMessages.value[currentStreamingMessageIndex].content === '') {
                chatMessages.value[currentStreamingMessageIndex].content =
                    `Erreur: Impossible de communiquer avec DeepSeek. ${error.message || 'Vérifiez votre clé API.'}`;
            }
        } else {
            errorMessage.value = `Erreur: ${error.message || 'Échec de connexion à l\'API.'}`;
        }
    } finally {
        isLoading.value = false;
        currentStreamingMessageIndex = -1;
    }
};

// Helper function to scroll chat to the latest message
const scrollToLatestMessage = () => {
    setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, 10);
};

const insertTextToEditor = (text: string) => {
    // Insert text at cursor position in Monaco editor
    if (editor) {
        const position = editor.getPosition();
        if (position) {
            const range = new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            );
            const operation = {
                range: range,
                text: `
<p>${text}</p>`,
                forceMoveMarkers: true
            };
            editor.executeEdits('insert-text', [operation]);
        } else {
            // Fallback if no cursor position
            const currentContent = editor.getValue();
            editor.setValue(currentContent + `
<p>${text}</p>`);
        }

        // Focus back on the editor
        editor.focus();
    }
};

// Handle file selection
const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
    }
};

// Remove selected file
const removeSelectedFile = () => {
    selectedFile.value = null;
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
};

// Add debugging function
const checkInitializationState = () => {
    console.log('Initialization state:', isInitialized.value);
    console.log('Chat messages:', chatMessages.value.length);
    return isInitialized.value ? 'Initialized' : 'Not Initialized';
};

// Function to print the HTML preview
const printHTMLPreview = () => {
    const previewElement = document.querySelector('.document-content') as HTMLDivElement;
    if (previewElement) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Preview</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        ${previewElement.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }
};

// Function to download the HTML preview as a PDF
const downloadPDF = () => {
    const previewElement = document.querySelector('.document-content') as HTMLDivElement;
    if (previewElement) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.html(previewElement, {
            callback: (doc) => {
                doc.save('document-preview.pdf');
            },
            x: 10,
            y: 10,
            width: 190 // Adjust width to fit A4 size
        });
    }
};
</script>

<template>
    <div class="editor-container">
        <!-- HTML Preview Section (Left) -->
        <div class="document-preview">
            <div class="toolbar bg-white p-2 border-b flex justify-between items-center">
                <h2 class="text-gray-800 font-bold">Aperçu HTML</h2>
                <!-- Download PDF Button -->
                <button @click="downloadPDF" class="px-4 py-2 bg-blue-600 text-white rounded">
                    Télécharger PDF
                </button>
            </div>
            <!-- Document Content - Read-only preview -->
            <div class="document-content p-4">
                <!-- Content will be injected here by updatePreview() -->
            </div>
        </div>

        <!-- Monaco Editor Section (Middle) -->
        <div class="code-editor-section">
            <div class="toolbar bg-gray-800 p-2 border-b">
                <h2 class="text-white font-bold">Éditeur HTML</h2>
            </div>
            <div id="monaco-editor-container" class="monaco-container"></div>
        </div>

        <!-- ChatGPT Prompter (Right) -->
        <div class="chat-section">
            <div class="toolbar bg-green-800 p-2 border-b flex justify-between items-center">
                <h2 class="text-white font-bold">Assistant IA</h2>
                <!-- Debug info - can be removed after fixing -->
                <small class="text-white opacity-70">{{ checkInitializationState() }}</small>
            </div>
            <div class="chat-messages" :class="{ 'blur-bg': !isInitialized }">
                <!-- Overlay message when not initialized -->
                <div v-if="!isInitialized" class="init-overlay">
                    <div class="init-overlay-content">
                        <h3>Initialiser le CER pour commencer à chater</h3>
                        <p>L'assistant IA analysera d'abord votre document avant de pouvoir vous aider</p>
                    </div>
                </div>
                
                <div v-for="(message, index) in chatMessages" :key="index" class="message p-3 rounded mb-2"
                    :class="message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'">
                    <p>{{ message.content }}</p>
                    <div v-if="index === chatMessages.length - 1 && isLoading && message.role === 'assistant'" 
                         class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <button v-if="message.role === 'assistant' && message.content" @click="insertTextToEditor(message.content)"
                        class="insert-btn px-2 py-1 text-xs bg-green-600 text-white rounded">
                        Insérer
                    </button>
                </div>
                <div v-if="errorMessage" class="error-message p-3 rounded mb-2 bg-red-100">
                    {{ errorMessage }}
                </div>
            </div>
            
            <!-- Conditional input areas -->
            <div class="prompt-area" v-if="isInitialized">
                <!-- File attachment preview -->
                <div v-if="selectedFile" class="file-preview">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <button @click="removeSelectedFile" class="remove-file-btn">
                        &times;
                    </button>
                </div>
                
                <div class="prompt-input p-2 bg-white border-t flex">
                    <!-- File upload button -->
                    <label for="file-upload" class="file-upload-btn">
                        <i class="icon-paperclip">📎</i>
                    </label>
                    <input 
                        id="file-upload" 
                        type="file" 
                        @change="handleFileSelect" 
                        style="display: none;"
                    />
                    
                    <input v-model="prompt" @keyup.enter="sendPrompt" type="text" 
                           placeholder="Posez une question à l'IA..." 
                           class="flex-1 p-2 border rounded" 
                           :disabled="isLoading" />
                    <button @click="sendPrompt" :disabled="isLoading" 
                            class="ml-2 px-4 bg-green-600 text-white rounded"
                            :class="{ 'opacity-50': isLoading }">
                        {{ isLoading ? 'Envoi...' : 'Envoyer' }}
                    </button>
                </div>
            </div>
            
            <!-- Initialization button in the input area -->
            <div class="prompt-input p-2 bg-white border-t" v-else>
                <!-- File upload button -->
                <label for="file-upload" class="file-upload-btn">
                    <i class="icon-paperclip">📎</i>
                </label>
                <input 
                    id="file-upload" 
                    type="file" 
                    @change="handleFileSelect" 
                    style="display: none;"
                />
                <button @click="startInitialization" 
                        :disabled="isLoading" 
                        class="init-btn-bottom">
                    {{ isLoading ? 'Initialisation en cours...' : "COMMENCER L'INITIALISATION" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.editor-container {
    display: flex;
    height: calc(100vh - 64px);
    width: 100%;
    background-color: #f0f4f1;
}

.document-preview {
    width: 33%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-right: 1px solid #ddd;
}

.document-content {
    flex: 1;
    overflow-y: auto;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    min-height: 100%;
    position: relative; /* Ajout du contexte de positionnement */
}

/* Ajout de styles pour permettre à la prévisualisation de gérer les positions absolues correctement */
:deep(.document-content) {
    background-color: white;
    position: relative;
    height: 100%;
    min-height: 800px; /* Assure une hauteur minimale pour les positionnements absolus */
}

/* Assure que les éléments positionnés en absolu dans le contenu sont correctement contenus */
:deep(.document-content > *) {
    max-width: 100%;
    box-sizing: border-box;
}

/* Permet aux éléments en position absolue de respecter les dimensions du conteneur */
:deep(.document-content div[style*="position: absolute"]),
:deep(.document-content div[style*="position:absolute"]) {
    max-width: 100%;
    max-height: 100%;
}

.code-editor-section {
    width: 34%;
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    border-right: 1px solid #444;
}

.monaco-container {
    flex: 1;
    overflow: hidden;
}

.chat-section {
    width: 33%;
    max-height: calc(100vh - 72px);
    display: flex;
    overflow-y: auto;
    flex-direction: column;
    background-color: #f8f9fa;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
}

.message {
    position: relative;
}

.insert-btn {
    position: absolute;
    bottom: -5px;
    right: 5px;
    opacity: 0;
    transition: opacity 0.2s;
}

.message:hover .insert-btn {
    opacity: 1;
}

.prompt-input {
    border-top: 1px solid #ddd;
}

/* Remove Tailwind-specific styles */
:deep(.document-content) {
    background-color: white;
}

.error-message {
    color: #e53e3e;
    font-size: 0.9rem;
}

/* Typing indicator animation */
.typing-indicator {
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
}

.typing-indicator span {
    height: 6px;
    width: 6px;
    margin: 0 2px;
    background-color: #606060;
    border-radius: 50%;
    display: inline-block;
    opacity: 0.4;
    animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.3s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes typing {
    0% {
        transform: scale(1);
        opacity: 0.4;
    }
    50% {
        transform: scale(1.4);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0.4;
    }
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reset-btn {
    transition: background-color 0.2s;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.init-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    padding: 2rem;
    text-align: center;
}

.init-message {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #4a5568;
}

.init-btn {
    padding: 0.75rem 1.5rem;
    background-color: #2f855a;
    color: white;
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 0.5rem;
    transition: background-color 0.3s;
    cursor: pointer;
}

.init-btn:hover {
    background-color: #276749;
}

.init-btn:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.init-btn-bottom {
    background-color: #2f855a;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 0.375rem;
    transition: background-color 0.3s;
    cursor: pointer;
    width: 100%;
    padding: 12px;
    text-transform: uppercase;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid #276749;
}

.init-btn-bottom:hover {
    background-color: #276749;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.init-btn-bottom:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    border-color: #9ca3af;
}

.blur-bg {
    position: relative;
}

.init-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    z-index: 10;
}

.init-overlay-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
    max-width: 80%;
}

.init-overlay-content h3 {
    color: #2f855a;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.init-overlay-content p {
    color: #4b5563;
    font-size: 1rem;
}

.prompt-area {
    display: flex;
    flex-direction: column;
}

.file-preview {
    padding: 0.5rem 1rem;
    background-color: #f7fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.file-name {
    font-size: 0.875rem;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 85%;
}

.remove-file-btn {
    background-color: #e53e3e;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    border: none;
}

.file-upload-btn {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4a5568;
    transition: color 0.2s;
}

.file-upload-btn:hover {
    color: #2f855a;
}
</style>
