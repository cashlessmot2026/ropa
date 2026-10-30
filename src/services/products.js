import { supabase } from "../lib/supabase.js";
import { CATEGORIES, PRODUCTS } from "../data/catalog.js";

const PRODUCT_COLUMNS =
  "id, slug, name, category, gender, price, image_url, use_reference_image, garment_description, tryon_prompt";

// Devuelve { products, source }. Si Supabase falla o está vacío, usa el catálogo local
// para que la app siga funcionando offline (PWA).
export async function fetchProducts({ category } = {}) {
  if (supabase) {
    let query = supabase.from("store_products").select(PRODUCT_COLUMNS).eq("active", true).order("created_at");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (!error && data?.length) return { products: data, source: "supabase" };
    if (error) console.warn("[products] Supabase:", error.message);
  }
  const local = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  return { products: local.map((p) => ({ id: p.slug, ...p })), source: "local" };
}

export async function fetchCategories() {
  if (supabase) {
    const { data, error } = await supabase.from("store_categories").select("slug, name, sort_order").order("sort_order");
    if (!error && data?.length) return data;
  }
  return CATEGORIES;
}

export function formatPrice(cop) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(cop);
}
