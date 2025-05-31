// auth.js
// Import de PocketBase (ajustez le chemin selon votre configuration)
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090/_/');

// Variables pour les onglets et formulaires
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Fonction pour basculer vers le formulaire de connexion
function showLogin() {
    loginTab.classList.add('bg-indigo-500', 'text-white');
    loginTab.classList.remove('text-gray-600');
    registerTab.classList.remove('bg-indigo-500', 'text-white');
    registerTab.classList.add('text-gray-600');
    
    loginForm.classList.remove('form-hidden');
    loginForm.classList.add('form-visible');
    registerForm.classList.remove('form-visible');
    registerForm.classList.add('form-hidden');
}

// Fonction pour basculer vers le formulaire d'inscription
function showRegister() {
    registerTab.classList.add('bg-indigo-500', 'text-white');
    registerTab.classList.remove('text-gray-600');
    loginTab.classList.remove('bg-indigo-500', 'text-white');
    loginTab.classList.add('text-gray-600');
    
    registerForm.classList.remove('form-hidden');
    registerForm.classList.add('form-visible');
    loginForm.classList.remove('form-visible');
    loginForm.classList.add('form-hidden');
}

// Fonctions d'authentification avec PocketBase
export async function login() {
    try {
        const loginInput = document.getElementById("login");
        const passwdInput = document.getElementById("passwd");
        
        if (!loginInput || !passwdInput) {
            throw new Error("Éléments de formulaire manquants");
        }

        const email = loginInput.value.trim();
        const password = passwdInput.value;

        // Validation basique
        if (!email || !password) {
            throw new Error("Veuillez remplir tous les champs");
        }

        if (!isValidEmail(email)) {
            throw new Error("Format d'email invalide");
        }

        // Connexion avec PocketBase
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        console.log("Connexion réussie", authData);
        showSuccess("Connexion réussie !");
        
        // Redirection ou action après connexion réussie
        // window.location.href = "/dashboard";
        
        return { success: true, data: authData };

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        
        let errorMessage = "Erreur de connexion";
        
        if (error.status === 400) {
            errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
        return { success: false, error: errorMessage };
    }
}

export async function register() {
    try {
        const loginInput = document.getElementById("loginReg");
        const passwdInput = document.getElementById("passwdReg");
        const nomInput = document.getElementById("nom");
        
        if (!loginInput || !passwdInput || !nomInput) {
            throw new Error("Éléments de formulaire manquants");
        }

        const email = loginInput.value.trim();
        const password = passwdInput.value;
        const nom = nomInput.value.trim();

        // Validation des données
        if (!email || !password || !nom) {
            throw new Error("Veuillez remplir tous les champs");
        }

        if (!isValidEmail(email)) {
            throw new Error("Format d'email invalide");
        }

        if (password.length < 6) {
            throw new Error("Le mot de passe doit contenir au moins 6 caractères");
        }

        // Création de l'utilisateur
        const userData = await pb.collection('users').create({
            email: email,
            password: password,
            nom: nom,
            passwordConfirm: password,
        });

        console.log("Inscription réussie", userData);
        
        // Connexion automatique après inscription
        await pb.collection('users').authWithPassword(email, password);
        
        showSuccess("Inscription réussie ! Vous êtes maintenant connecté.");
        
        // Redirection ou action après inscription réussie
        // window.location.href = "/dashboard";
        
        return { success: true, data: userData };

    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        
        let errorMessage = "Erreur lors de l'inscription";
        
        if (error.status === 400) {
            if (error.data?.email) {
                errorMessage = "Cette adresse email est déjà utilisée";
            } else {
                errorMessage = "Données invalides";
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
        return { success: false, error: errorMessage };
    }
}

// Fonction utilitaire pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonctions d'affichage des messages avec animations
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.transform = 'translateX(100%)';
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 4000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.transform = 'translateX(100%)';
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 300);
        }
    }, 4000);
}

// Initialisation des event listeners quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners pour les onglets
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', showLogin);
        registerTab.addEventListener('click', showRegister);
    }

    // Event listeners pour les formulaires
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await login();
        });
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await register();
        });
    }
});

// Export des fonctions pour une utilisation externe si nécessaire
window.authFunctions = {
    login,
    register,
    showLogin,
    showRegister
};