import { createDecartClient, models } from "@decartai/sdk";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase.js";

export const TRYON_MODEL = models.realtime("lucy-vton-latest");

// En dev, Vite sirve /api/decart-token (server/decart-token-dev.js).
// En producción, la Edge Function de Supabase acuña el token.
const TOKEN_ENDPOINT =
  import.meta.env.VITE_DECART_TOKEN_ENDPOINT ||
  (import.meta.env.DEV ? "/api/decart-token" : `${SUPABASE_URL}/functions/v1/decart-token`);

async function fetchClientToken() {
  const headers = { "Content-Type": "application/json" };
  if (TOKEN_ENDPOINT.includes("/functions/v1/")) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
    headers.apikey = SUPABASE_ANON_KEY;
  }
  const res = await fetch(TOKEN_ENDPOINT, { method: "POST", headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.apiKey) {
    throw new Error(body.error || `No se pudo obtener el token de Decart (${res.status})`);
  }
  return body.apiKey;
}

let client;

// El SDK llama a apiKeyProvider antes de cada conexión y reconexión,
// así nunca reutilizamos un token vencido (duran 60 s).
export function getDecartClient() {
  client ??= createDecartClient({ apiKeyProvider: fetchClientToken });
  return client;
}
