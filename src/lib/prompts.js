// Prompts para lucy-vton siguiendo los patrones "substitute" / "add" de la guía de Decart.
// `garment` es la descripción en inglés de la prenda (color, material, corte, detalles).
// Regiones tomadas de la guía oficial (vton-3.5-prompting): una sola acción por prompt.
const TEMPLATES = {
  camisas: (g) => `Substitute the upper body garment with ${g}.`,
  mujer: (g) => `Substitute the outfit with ${g}.`,
  vestidos: (g) => `Substitute the outfit with ${g}.`,
  zapatos: (g) => `Substitute the footwear with ${g}.`,
  gorras: (g) => `Add ${g} to the outfit.`,
  gafas: (g) => `Add ${g} to the outfit.`,
  accesorios: (g) => `Add ${g} to the outfit.`,
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
