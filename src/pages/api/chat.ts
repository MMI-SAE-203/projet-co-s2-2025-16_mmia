import type { APIRoute } from 'astro'
import ollama from 'ollama'
import PocketBase from 'pocketbase'

// Configuration PocketBase
const pb = new PocketBase('http://127.0.0.1:8090') // Remplacez par l'URL de votre PocketBase

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, chatId, userId } = await request.json()

    // Générer la réponse avec Ollama
    const response = await ollama.chat({
      model: 'gemma3',
      messages: [{ role: 'user', content: message, stream: true }],
    })

    const aiResponse = response.message.content

    // Déterminer l'ID du chat
    let currentChatId = chatId

    // Si pas de chatId fourni, créer un nouveau chat
    if (!currentChatId && userId) {
      const newChat = await pb.collection('chat_IA').create({
        user: userId,
        // Vous pouvez ajouter d'autres champs si nécessaire
      })
      currentChatId = newChat.id
    }

    // Sauvegarder le message de l'utilisateur
    if (currentChatId) {
      await pb.collection('messages').create({
        titre: 'Message utilisateur',
        contenu: message,
        chat: currentChatId
      })

      // Sauvegarder la réponse de l'IA
      await pb.collection('messages').create({
        titre: 'Réponse IA',
        contenu: aiResponse,
        chat: currentChatId
      })
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      chatId: currentChatId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(JSON.stringify({ 
      error: 'Erreur lors du traitement de la requête' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}