import type { APIRoute } from 'astro'
import ollama from 'ollama'
import PocketBase from 'pocketbase'
// Configuration PocketBase
const pb = new PocketBase('https://mmia.pauldarlef.fr') // Remplacez par l'URL de votre PocketBase




// Fonction pour envoyer un message à Ollama
async function sendMessageToOllama(message) {
  try {
    console.log('Envoi du message à Ollama:', message);
    const response = await fetch('https://ollamaserver.pauldarlef.fr:443/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Charset': 'utf-8',
      },
      signal: AbortSignal.timeout(120000),
      body: JSON.stringify({
        model: "llama3.2",
        system: "Tu es un assistant IA spécialisé en MMI (Métiers du Multimédia et de l'Internet). Tu aides les étudiants avec leurs cours, projets et questions techniques. Réponds de manière pédagogique et adaptée, ainsi que de façon concise et claire.",
        prompt: message,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse d\'Ollama:', data);
    return data.response;
  } catch (error) {
    console.error('Erreur lors de l\'appel à Ollama:', error);
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Traitement de la requête POST');
    const { message, chatId, userId } = await request.json();

    // Appel à Ollama avec votre fonction personnalisée
    const aiResponse = await sendMessageToOllama(message);

    // Déterminer l'ID du chat
    let currentChatId = chatId;

    // Si pas de chatId fourni, créer un nouveau chat
    if (!currentChatId && userId) {
      const newChat = await pb.collection('chat_IA').create({
        user: userId,
      });
      currentChatId = newChat.id;
    }

    // Sauvegarder le message de l'utilisateur
    if (currentChatId) {
      await pb.collection('messages').create({
        titre: 'Message utilisateur',
        contenu: message,
        chat: currentChatId
      });

      // Sauvegarder la réponse de l'IA
      await pb.collection('messages').create({
        titre: 'Réponse IA',
        contenu: aiResponse,
        chat: currentChatId
      });
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      chatId: currentChatId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({
      error: 'Erreur lors du traitement de la requête'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};