<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as monaco from 'monaco-editor';

// Note: Tailwind needs to be properly imported and installed as a dependency
// This is a simplified implementation for demonstration purposes
const htmlContent = ref('<p class="text-blue-500 text-xl">Commencez à éditer votre document ici...</p>');
const prompt = ref('');
const chatMessages = ref([
    { role: 'system', content: 'Bonjour, je suis votre assistant pour la création de documents. Comment puis-je vous aider ?' }
]);
const isLoading = ref(false);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// Initialize Monaco editor
onMounted(async () => {
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

    // Initialize preview with Tailwind support
    updatePreview();
});

// Watch for changes in htmlContent to update the preview
watch(htmlContent, () => {
    updatePreview();
});

// Function to update the preview with Tailwind CSS
const updatePreview = () => {
    const previewElement = document.querySelector('.document-content') as HTMLDivElement;
    if (previewElement) {
        try {
            // For demonstration purposes - in a real app, you would use the actual tailwind compilation
            // const css = tailwind.compile(htmlContent.value);
            const css = '/* Tailwind CSS would be generated here */';

            // Create a full HTML document with the compiled CSS and content
            const fullHtml = `
                <style>
                    /* Tailwind CDN for demo purposes */
                    @import 'https://cdn.tailwindcss.com';
                    ${css}
                </style>
                ${htmlContent.value}
            `;

            // Set the HTML content
            previewElement.innerHTML = fullHtml;
        } catch (error) {
            console.error('Error processing Tailwind CSS:', error);
            previewElement.innerHTML = htmlContent.value;
        }
    }
};

// Clean up editor on component unmount
onUnmounted(() => {
    if (editor) {
        editor.dispose();
    }
});

const sendPrompt = () => {
    if (!prompt.value.trim()) return;

    // Add user message to chat
    chatMessages.value.push({ role: 'user', content: prompt.value });

    // Set loading state
    isLoading.value = true;

    // In a real application, you would send the prompt to an API endpoint
    window.electron?.ipcRenderer.send('send-prompt', prompt.value);

    // Simulate AI response (in a real app, you would use the actual API response)
    setTimeout(() => {
        chatMessages.value.push({
            role: 'assistant',
            content: `J'ai traité votre demande: "${prompt.value}". Voici un exemple de réponse que l'assistant fournirait.`
        });
        prompt.value = '';
        isLoading.value = false;
    }, 1000);
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
                text: `<p>${text}</p>`,
                forceMoveMarkers: true
            };
            editor.executeEdits('insert-text', [operation]);
        } else {
            // Fallback if no cursor position
            const currentContent = editor.getValue();
            editor.setValue(currentContent + `<p>${text}</p>`);
        }

        // Focus back on the editor
        editor.focus();
    }
};
</script>

<template>
    <div class="editor-container">
        <!-- HTML Preview Section (Left) -->
        <div class="document-preview">
            <div class="toolbar bg-white p-2 border-b">
                <h2 class="text-gray-800 font-bold">Aperçu HTML avec Tailwind</h2>
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
            <div class="toolbar bg-green-800 p-2 border-b">
                <h2 class="text-white font-bold">Assistant IA</h2>
            </div>
            <div class="chat-messages">
                <div v-for="(message, index) in chatMessages" :key="index" class="message p-3 rounded mb-2"
                    :class="message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'">
                    <p>{{ message.content }}</p>
                    <button v-if="message.role === 'assistant'" @click="insertTextToEditor(message.content)"
                        class="insert-btn px-2 py-1 text-xs bg-green-600 text-white rounded">
                        Insérer
                    </button>
                </div>
            </div>
            <div class="prompt-input p-2 bg-white border-t flex">
                <input v-model="prompt" @keyup.enter="sendPrompt" type="text" placeholder="Posez une question à l'IA..."
                    class="flex-1 p-2 border rounded" />
                <button @click="sendPrompt" :disabled="isLoading" class="ml-2 px-4 bg-green-600 text-white rounded"
                    :class="{ 'opacity-50': isLoading }">
                    {{ isLoading ? 'Envoi...' : 'Envoyer' }}
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
    display: flex;
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
</style>
