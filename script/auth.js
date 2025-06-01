import PocketBase from 'pocketbase';

// Créer l'instance PocketBase uniquement côté client
let pb;
if (typeof window !== 'undefined') {
    pb = new PocketBase('https://mmia.pauldarlef.fr:443');
    pb.autoCancellation(false);
}

export { pb };

export function isAuthenticated() {
    // Vérifier si on est côté client
    if (typeof window === 'undefined' || !pb) {
        return false; // Côté serveur, on retourne toujours false
    }
    
    return pb.authStore.isValid;
}

// Aucune fonction duppliquée
export function getCurrentUser() {
    if (typeof window === 'undefined' || !pb || !pb.authStore.isValid) {
        return null;
    }
    return pb.authStore.model;
}

export function getServerAuthState(request) {
    // On ne peut pas vérifier l'auth côté serveur avec localStorage
    // Il faut utiliser des cookies ou des headers
    return {
        isAuthenticated: false, // Toujours false côté serveur avec cette approche
        user: null
    };
}

export function initAuth() {
    if (typeof window !== 'undefined' && pb) {
        pb.authStore.onChange((token, model) => {
            console.log('Auth state changed:', { 
                isValid: pb.authStore.isValid, 
                user: model 
            });
            updateUIForAuthState();
            
            // Déclencher un événement personnalisé
            window.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isAuthenticated: pb.authStore.isValid, user: model }
            }));
        });
        
        // Vérifier l'état initial
        updateUIForAuthState();
    }
}

function updateUIForAuthState() {
    if (typeof window === 'undefined' || !pb) return;
    
    const isLoggedIn = pb.authStore.isValid;
    
    // Mettre à jour les classes CSS
    document.body.classList.toggle('authenticated', isLoggedIn);
    document.body.classList.toggle('unauthenticated', !isLoggedIn);
    
    // Afficher/masquer les éléments selon l'authentification
    document.querySelectorAll('[data-auth="required"]').forEach(el => {
        el.style.display = isLoggedIn ? 'block' : 'none';
    });
    
    document.querySelectorAll('[data-auth="guest"]').forEach(el => {
        el.style.display = isLoggedIn ? 'none' : 'block';
    });
    
    // Mettre à jour les infos utilisateur
    if (isLoggedIn && pb.authStore.model) {
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = pb.authStore.model.name || pb.authStore.model.email;
        });
    }
}

export function requireAuth(Astro) {
    if (!isAuthenticated()) {
        return Astro.redirect('/Login');
    }
    return null;
}

export function logout() {
    if (typeof window !== 'undefined' && pb) {
        pb.authStore.clear();
        updateUIForAuthState();
    }
}