import { getApiKey } from './settingsService';

interface Message {
  role: string;
  content: string;
}

// Stocker l'historique des messages pour la conversation
let chatMessages: Message[] = [
  {
    role: 'system',
    content: 'Bonjour, je suis votre assistant pour la création de documents. Comment puis-je vous aider ?'
  }
];

// Ajouter un message à l'historique
export function addMessage(message: Message): void {
  chatMessages.push(message);
}

// Obtenir tous les messages de l'historique
export function getMessages(): Message[] {
  return [...chatMessages];
}

// Réinitialiser l'historique des messages
export function resetMessages(): void {
  chatMessages = [
    {
      role: 'system',
      content: 'Bonjour, je suis votre assistant pour la création de documents. Comment puis-je vous aider ?'
    }
  ];
}



export async function* streamChatCompletion(): AsyncGenerator<string, void, unknown> {
  try {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error('Clé API DeepSeek non configurée. Veuillez la configurer dans les paramètres.');
    }
    
    // Utiliser l'historique des messages enregistrés
    const messages = getMessages();
    
    if (messages.length === 0) {
      throw new Error('Aucun message dans l\'historique.');
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          stream: true,
          max_tokens: 8192,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur DeepSeek API: ${response.status} - ${errorData}`);
    }

    if (!response.body) {
      throw new Error('Réponse sans corps reçue');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Décode les morceaux reçus
      const chunk = decoder.decode(value);
      
      // Traite les lignes du format SSE (Server-Sent Events)
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          
          // Si c'est la fin du flux
          if (data === '[DONE]') {
            break;
          }
          
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta.content) {
              const textChunk = parsedData.choices[0].delta.content;
              assistantResponse += textChunk;
              yield textChunk;
            }
          } catch (e) {
            console.error('Erreur de traitement JSON:', e);
          }
        }
      }
    }
    
    // Après avoir reçu la réponse complète, l'ajouter à l'historique
    if (assistantResponse) {
      addMessage({
        role: 'assistant',
        content: assistantResponse
      });
    }
  } catch (error) {
    console.error('Erreur lors du streaming:', error);
    throw error;
  }
}
