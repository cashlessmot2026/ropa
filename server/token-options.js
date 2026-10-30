// Restricciones de los tokens de cliente. Compartido por el endpoint de desarrollo;
// la Edge Function de Supabase mantiene una copia equivalente (Deno no importa este archivo).
export const TOKEN_OPTIONS = {
  expiresIn: 60,
  allowedModels: ["lucy-vton-latest", "lucy-vton-3.6"],
  constraints: { realtime: { maxSessionDuration: 300 } },
};
