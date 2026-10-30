// Catálogo de prueba. Es la fuente de verdad para el seed de Supabase
// (scripts/generate-seed.mjs) y el respaldo offline si la base no responde.
// Imágenes de producto: dummyjson.com (fotos limpias sobre fondo blanco, ideales para VTON).
// Las gorras no tienen foto de referencia: se prueban solo con texto (use_reference_image = false).

export const CATEGORIES = [
  { slug: "camisas", name: "Camisas", sort_order: 1 },
  { slug: "mujer", name: "Ropa de mujer", sort_order: 2 },
  { slug: "zapatos", name: "Zapatos", sort_order: 3 },
  { slug: "gorras", name: "Gorras", sort_order: 4 },
  { slug: "gafas", name: "Gafas", sort_order: 5 },
  { slug: "accesorios", name: "Accesorios", sort_order: 6 },
];

export const PRODUCTS = [
  // Camisas
  { slug: "camisa-cuadros-azul", name: "Camisa a cuadros azul y negra", category: "camisas", gender: "hombre", price: 119900, image_url: "/products/camisa-cuadros-azul.webp", use_reference_image: true, garment_description: "a long-sleeve button-up shirt with a blue, black and white check pattern and a classic collar" },
  { slug: "camisa-plaid", name: "Camisa plaid", category: "camisas", gender: "hombre", price: 139900, image_url: "/products/camisa-plaid.webp", use_reference_image: true, garment_description: "a long-sleeve plaid flannel button-up shirt with a classic collar" },
  { slug: "camisa-manga-corta", name: "Camisa manga corta", category: "camisas", gender: "hombre", price: 79900, image_url: "/products/camisa-manga-corta.webp", use_reference_image: true, garment_description: "a short-sleeve button-up shirt with a relaxed fit" },
  { slug: "camiseta-aorus", name: "Camiseta gráfica Aorus", category: "camisas", gender: "hombre", price: 99900, image_url: "/products/camiseta-aorus.webp", use_reference_image: true, garment_description: "a black crewneck t-shirt with a large graphic logo print on the chest" },

  // Ropa de mujer
  { slug: "vestido-gala-negro", name: "Vestido de gala negro", category: "mujer", gender: "mujer", price: 519900, image_url: "/products/vestido-gala-negro.webp", use_reference_image: true, garment_description: "a long black evening gown with a fitted bodice and a floor-length skirt" },
  { slug: "corset-falda-cuero", name: "Corset con falda de cuero", category: "mujer", gender: "mujer", price: 359900, image_url: "/products/corset-falda-cuero.webp", use_reference_image: true, garment_description: "a black leather corset top with a matching leather skirt" },
  { slug: "vestido-pea", name: "Vestido Pea", category: "mujer", gender: "mujer", price: 199900, image_url: "/products/vestido-pea.webp", use_reference_image: true, garment_description: "a knee-length casual dress" },
  { slug: "vestido-azul", name: "Vestido azul", category: "mujer", gender: "mujer", price: 119900, image_url: "/products/vestido-azul.webp", use_reference_image: true, garment_description: "a blue knee-length frock dress with a flared skirt" },
  { slug: "vestido-tartan", name: "Vestido tartán con lazo", category: "mujer", gender: "mujer", price: 159900, image_url: "/products/vestido-tartan.webp", use_reference_image: true, garment_description: "a sleeveless grey and white tartan dress with a flared skirt and a large black satin bow at the waist" },
  { slug: "vestido-gris", name: "Vestido gris", category: "mujer", gender: "mujer", price: 139900, image_url: "/products/vestido-gris.webp", use_reference_image: true, garment_description: "a grey knee-length dress with a simple silhouette" },

  // Zapatos
  { slug: "jordan-1-rojo-negro", name: "Nike Air Jordan 1 rojo y negro", category: "zapatos", gender: "unisex", price: 599900, image_url: "/products/jordan-1-rojo-negro.webp", use_reference_image: true, garment_description: "red and black high-top leather basketball sneakers" },
  { slug: "puma-future-rider", name: "Puma Future Rider", category: "zapatos", gender: "unisex", price: 359900, image_url: "/products/puma-future-rider.webp", use_reference_image: true, garment_description: "retro running sneakers with colorful suede panels" },
  { slug: "sneakers-off-white-rojo", name: "Tenis Off White y rojo", category: "zapatos", gender: "unisex", price: 479900, image_url: "/products/sneakers-off-white-rojo.webp", use_reference_image: true, garment_description: "off-white sports sneakers with red accents" },
  { slug: "tacones-calvin-klein", name: "Tacones Calvin Klein", category: "zapatos", gender: "mujer", price: 319900, image_url: "/products/tacones-calvin-klein.webp", use_reference_image: true, garment_description: "elegant high-heel pumps" },
  { slug: "zapatos-rojos", name: "Zapatos rojos", category: "zapatos", gender: "mujer", price: 139900, image_url: "/products/zapatos-rojos.webp", use_reference_image: true, garment_description: "glossy red heeled shoes" },

  // Gorras (solo texto)
  { slug: "gorra-negra-clasica", name: "Gorra negra clásica", category: "gorras", gender: "unisex", price: 69900, image_url: "/products/gorra-negra.svg", use_reference_image: false, garment_description: "a plain black cotton baseball cap with a curved brim" },
  { slug: "gorra-roja-trucker", name: "Gorra trucker roja", category: "gorras", gender: "unisex", price: 74900, image_url: "/products/gorra-roja.svg", use_reference_image: false, garment_description: "a red trucker baseball cap with a white mesh back and a flat brim" },
  { slug: "gorra-azul-snapback", name: "Gorra snapback azul", category: "gorras", gender: "unisex", price: 79900, image_url: "/products/gorra-azul.svg", use_reference_image: false, garment_description: "a navy blue snapback baseball cap with a flat brim and a small white logo on the front" },

  // Gafas
  { slug: "gafas-negras", name: "Gafas de sol negras", category: "gafas", gender: "unisex", price: 119900, image_url: "/products/gafas-negras.webp", use_reference_image: true, garment_description: "black sunglasses with dark lenses" },
  { slug: "gafas-clasicas", name: "Gafas de sol clásicas", category: "gafas", gender: "unisex", price: 99900, image_url: "/products/gafas-clasicas.webp", use_reference_image: true, garment_description: "classic sunglasses with a thin frame" },

  // Accesorios
  { slug: "bolso-azul", name: "Bolso azul de mujer", category: "accesorios", gender: "mujer", price: 199900, image_url: "/products/bolso-azul.webp", use_reference_image: true, garment_description: "a blue women's leather handbag" },
];
