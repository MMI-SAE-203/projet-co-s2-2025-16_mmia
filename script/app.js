let banner = document.querySelector('.banner');
let canvas = document.getElementById('dotsCanvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d');
let dots = [];
const arrayColors = [, '#985293', '#000000', '#FFFFFF', '#374151'];
for (let index = 0; index < 50; index++) {
    dots.push({
        x:  Math.floor(Math.random() * canvas.width),
        y:  Math.floor(Math.random() * canvas.height),
        size: Math.random() * 3 + 5,
        color: arrayColors[Math.floor(Math.random()* 5)]
    });
}
const drawDots = () => {
    dots.forEach(dot => {
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI*2);
        ctx.fill();
    })
}
drawDots();
banner.addEventListener('mousemove', (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    let mouse = {
        x:  event.pageX - banner.getBoundingClientRect().left,
        y:  event.pageY - banner.getBoundingClientRect().top
    }
    dots.forEach(dot => {
        let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
        if(distance < 300){
            ctx.strokeStyle = dot.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    })
})
banner.addEventListener('mouseout', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
})
window.addEventListener('resize', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = banner.offsetWidth;
    canvas.height = banner.offsetHeight;

    dots = [];
    for (let index = 0; index < 50; index++) {
        dots.push({
            x:  Math.floor(Math.random() * canvas.width),
            y:  Math.floor(Math.random() * canvas.height),
            size: Math.random() * 3 + 5,
            color: arrayColors[Math.floor(Math.random()* 5)]
        });
    }
    drawDots();
})


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