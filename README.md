# Ropa · Probador virtual (PWA)

PWA en React (Vite) para una tienda de ropa, gorras, zapatos y ropa de mujer, con
**probador virtual en tiempo real** usando [Decart Lucy VTON](https://docs.platform.decart.ai/models/realtime/virtual-try-on)
(`lucy-vton-latest`) y catálogo en **Supabase**.

> Fase actual: núcleo funcional (catálogo, try-on, tokens seguros, PWA instalable).
> `src/App.jsx` es solo un banco de pruebas; la interfaz final y los usuarios vienen después.

## Cómo funciona

```
Cámara ──getUserMedia──► useVirtualTryOn ──WebRTC──► Decart lucy-vton ──► video con la prenda puesta
                               │  set({ prompt, image })  (cambia prenda sin reconectar)
                               ▼
              apiKeyProvider → /api/decart-token (dev)  ó  Supabase Edge Function decart-token (prod)
                               │  token de cliente de 60 s, solo modelos lucy-vton, sesión máx. 5 min
                               ▼
                         DECART_API_KEY (solo en servidor, nunca en el navegador)
```

- **Prendas con foto** (`use_reference_image = true`): se envía la foto limpia de producto + un prompt
  *substitute/add* generado por categoría (`src/lib/prompts.js`).
- **Gorras**: prueba solo con texto (el modelo lo soporta) hasta tener fotos propias.
- Cada prueba se registra en `store_tryon_events` para analítica.

## Estructura

| Ruta | Qué hace |
| - | - |
| `src/hooks/useVirtualTryOn.js` | Cámara, conexión Decart, cambio de prenda, cámara frontal/trasera, estado |
| `src/lib/decart.js` | Cliente Decart con `apiKeyProvider` (token fresco por conexión) |
| `src/lib/prompts.js` | Prompts por categoría + indicaciones de encuadre |
| `src/services/products.js` | Catálogo desde Supabase con respaldo local offline |
| `src/data/catalog.js` | Catálogo de prueba (fuente del seed) |
| `server/decart-token-dev.js` | Endpoint local `/api/decart-token` para `npm run dev` |
| `supabase/functions/decart-token` | Edge Function que acuña tokens en producción |
| `supabase/migrations/` | Tablas `store_categories`, `store_products`, `store_tryon_events` + RLS |

Las tablas llevan prefijo `store_` porque el proyecto de Supabase ya tiene tablas de otra app (`categories`, etc.).

## Puesta en marcha

```bash
npm install
cp .env.example .env        # y pon tu DECART_API_KEY (https://platform.decart.ai → API Keys)
npm run dev
```

Producción: agrega `DECART_API_KEY` en Supabase → Edge Functions → Secrets (la función `decart-token` ya está desplegada).

Regenerar el seed tras editar el catálogo: `node scripts/generate-seed.mjs` y ejecutar `supabase/seed.sql`.

Imágenes de prueba: [dummyjson.com](https://dummyjson.com) (solo para desarrollo).
