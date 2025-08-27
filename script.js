// Convertit une couleur HEX en HSL
function hexToHSL(hex) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substr(0, 2), 16) / 255;
  let g = parseInt(hex.substr(2, 2), 16) / 255;
  let b = parseInt(hex.substr(4, 2), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; 
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

// Convertit HSL en HEX
function HSLToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Génère une couleur HEX aléatoire
function randomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// Génère la palette selon le mode choisi
function generatePalette() {
  const mode = document.getElementById("mode").value;
  const baseColor = randomHexColor();
  const baseHSL = hexToHSL(baseColor);
  let palette = [baseColor];

  if (mode === "complementary") {
    palette.push(HSLToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l));
  } else if (mode === "analogous") {
    palette.push(HSLToHex((baseHSL.h + 30) % 360, baseHSL.s, baseHSL.l));
    palette.push(HSLToHex((baseHSL.h - 30 + 360) % 360, baseHSL.s, baseHSL.l));
  } else if (mode === "triadic") {
    palette.push(HSLToHex((baseHSL.h + 120) % 360, baseHSL.s, baseHSL.l));
    palette.push(HSLToHex((baseHSL.h + 240) % 360, baseHSL.s, baseHSL.l));
  }

  displayPalette(palette);
}

// Affiche les couleurs
function displayPalette(colors) {
  const paletteDiv = document.getElementById("palette");
  paletteDiv.innerHTML = "";

  colors.forEach(color => {
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = color;
    box.textContent = color;

    box.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      alert(`Copied: ${color}`);
    });

    paletteDiv.appendChild(box);
  });
}

// Événement bouton
document.getElementById("generateBtn").addEventListener("click", generatePalette);

// Génère au chargement
generatePalette();
