import { supabase } from "../lib/supabase.js";

// Registro de pruebas virtuales para analítica (qué prendas se prueban más).
// Nunca bloquea el try-on: los errores solo se loguean.
export async function logTryOnEvent({ productSlug, decartSessionId, event, seconds }) {
  if (!supabase) return;
  const { error } = await supabase.from("store_tryon_events").insert({
    product_slug: productSlug ?? null,
    decart_session_id: decartSessionId ?? null,
    event,
    seconds: seconds ?? null,
    user_agent: navigator.userAgent.slice(0, 255),
  });
  if (error) console.warn("[store_tryon_events]", error.message);
}
