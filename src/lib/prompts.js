// Prompts para lucy-vton siguiendo los patrones "substitute" / "add" de la guía de Decart.
// `garment` es la descripción en inglés de la prenda (color, material, corte, detalles).
const TEMPLATES = {
  camisas: (g) => `Substitute the current top with ${g}`,
  mujer: (g) => `Substitute the current outfit with ${g}`,
  vestidos: (g) => `Substitute the current outfit with ${g}`,
  zapatos: (g) => `Substitute the current shoes with ${g}`,
  gorras: (g) => `Add ${g} to the person's head`,
  gafas: (g) => `Add ${g} to the person's face`,
  accesorios: (g) => `Add ${g} held in the person's hand`,
};

export function buildTryOnPrompt(product) {
  if (product.tryon_prompt) return product.tryon_prompt;
  const template = TEMPLATES[product.category] ?? TEMPLATES.camisas;
  return template(product.garment_description || product.name);
}

// Encuadre recomendado para que el modelo vea la zona de la prenda.
export const FRAMING_HINT = {
  camisas: "Encuadra de la cintura hacia arriba",
  mujer: "Aléjate para que se vea el cuerpo completo",
  vestidos: "Aléjate para que se vea el cuerpo completo",
  zapatos: "Muestra tus pies y piernas en cámara",
  gorras: "Encuadra la cabeza y los hombros",
  gafas: "Mira de frente a la cámara",
  accesorios: "Muestra tu mano y torso",
};
