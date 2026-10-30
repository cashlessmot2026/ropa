// Edge Function: acuña tokens de cliente de Decart de corta duración.
// La API key permanente vive solo como secreto de Supabase (DECART_API_KEY).
// Deploy:  supabase functions deploy decart-token --no-verify-jwt
// Secreto: supabase secrets set DECART_API_KEY=dct_...
import { createDecartClient } from "npm:@decartai/sdk@0.2.14";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Mantener en sincronía con server/token-options.js
const TOKEN_OPTIONS = {
  expiresIn: 60,
  allowedModels: ["lucy-vton-latest", "lucy-vton-3.6"],
  constraints: { realtime: { maxSessionDuration: 300 } },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("DECART_API_KEY");
  if (!apiKey) return json({ error: "DECART_API_KEY no configurada" }, 500);

  try {
    const client = createDecartClient({ apiKey });
    const token = await client.tokens.create(TOKEN_OPTIONS);
    return json({ apiKey: token.apiKey, expiresAt: token.expiresAt });
  } catch (err) {
    console.error("decart-token:", err);
    return json({ error: "No se pudo crear el token" }, 502);
  }
});
