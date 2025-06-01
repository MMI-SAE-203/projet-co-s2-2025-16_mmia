//changement de thème
console.log("Script de thème chargé"); // Test de base

// Initialisation du thème (immédiate)
const getInitialTheme = () => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

// Appliquer le thème immédiatement
const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

// Initialiser le thème
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// Fonction pour setup le toggle (sera appelée plusieurs fois)
const setupToggle = () => {
  const checkbox = document.getElementById("toggle");
  
  if (!checkbox) {
    // Réessayer dans 100ms si l'élément n'existe pas encore
    setTimeout(setupToggle, 100);
    return;
  }

  console.log("Checkbox trouvée, setup en cours");

  // Synchroniser l'état
  const currentTheme = localStorage.getItem("theme") || "light";
  checkbox.checked = (currentTheme === "dark");

  // Supprimer les anciens listeners
  checkbox.removeEventListener("change", handleChange);

  // Fonction de gestion du changement
  function handleChange() {
    console.log("Changement détecté, état:", checkbox.checked);
    
    if (checkbox.checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      console.log("Mode sombre activé");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log("Mode clair activé");
    }
  }

  // Ajouter le listener
  checkbox.addEventListener("change", handleChange);
  console.log("Event listener attaché");
};

// Démarrer le setup
setupToggle();

// Pour Astro
document.addEventListener("astro:after-swap", () => {
  console.log("Astro navigation détectée");
  
  // Réappliquer le thème
  const theme = localStorage.getItem("theme") || "light";
  applyTheme(theme);
  
  // Reconfigurer le toggle
  setupToggle();
});