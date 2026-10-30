import { createDecartClient } from "@decartai/sdk";
import { TOKEN_OPTIONS } from "./token-options.js";

// Endpoint local /api/decart-token para desarrollo: acuña tokens de cliente de corta
// duración con la API key permanente, que nunca sale del proceso de Node.
// En producción el mismo trabajo lo hace la Edge Function de Supabase `decart-token`.
export function decartTokenDevPlugin(apiKey) {
  return {
    name: "decart-token-dev",
    configureServer(server) {
      server.middlewares.use("/api/decart-token", async (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: "Method not allowed" }));
        }
        if (!apiKey) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: "Falta DECART_API_KEY en .env" }));
        }
        try {
          const client = createDecartClient({ apiKey });
          const token = await client.tokens.create(TOKEN_OPTIONS);
          res.end(JSON.stringify({ apiKey: token.apiKey, expiresAt: token.expiresAt }));
        } catch (err) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: "No se pudo crear el token", detail: String(err?.message ?? err) }));
        }
      });
    },
  };
}
