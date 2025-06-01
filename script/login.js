import PocketBase from 'pocketbase'
const pb = new PocketBase('https://mmia.pauldarlef.fr:443') ;

export async function addUSer(user){
    await pb.collection('users').create(user);
}


export async function login(email, password) {
    try {
        // Authentifier l'utilisateur
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        // Vérifier que l'authentification a bien fonctionné
        console.log('Auth successful:', pb.authStore.isValid);
        console.log('User:', pb.authStore.model);
        
        return {
            success: true,
            user: authData.record,
            token: authData.token
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}