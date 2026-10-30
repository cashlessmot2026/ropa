import { useState } from "react";
import { VideoStream } from "./components/VideoStream.jsx";
import { useProducts } from "./hooks/useProducts.js";
import { useVirtualTryOn } from "./hooks/useVirtualTryOn.js";
import { FRAMING_HINT } from "./lib/prompts.js";
import { formatPrice } from "./services/products.js";

// Banco de pruebas del núcleo (catálogo + try-on). La interfaz final se diseña después.
export default function App() {
  const [category, setCategory] = useState();
  const { products, categories, source, loading } = useProducts(category);
  const tryon = useVirtualTryOn();
  const [prompt, setPrompt] = useState("");
  const live = tryon.status !== "idle" && tryon.status !== "error";

  return (
    <main style={{ fontFamily: "system-ui", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Ropa · Try-On Lab</h1>
      <p>
        Estado: <b>{tryon.status}</b> · Generado: {tryon.seconds}s · Catálogo: {source ?? "…"}
        {tryon.applying && " · aplicando prenda…"}
      </p>
      {tryon.error && <p style={{ color: "crimson" }}>{tryon.error}</p>}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {!live ? (
          <button onClick={() => tryon.start()}>Iniciar cámara</button>
        ) : (
          <>
            <button onClick={tryon.flipCamera}>Cambiar cámara</button>
            <button onClick={tryon.stop}>Detener</button>
          </>
        )}
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginTop: 12 }}>
        <figure style={{ margin: 0 }}>
          <figcaption>Cámara</figcaption>
          <VideoStream stream={tryon.localStream} mirrored style={{ width: "100%", background: "#111" }} />
        </figure>
        <figure style={{ margin: 0 }}>
          <figcaption>
            Probador {tryon.activeProduct && `· ${tryon.activeProduct.name}`}
            {tryon.activeProduct && ` (${FRAMING_HINT[tryon.activeProduct.category]})`}
          </figcaption>
          <VideoStream stream={tryon.remoteStream} style={{ width: "100%", background: "#111" }} />
        </figure>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prompt.trim()) tryon.tryPrompt(prompt.trim());
        }}
        style={{ display: "flex", gap: 8, marginTop: 12 }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt libre: Add a white bucket hat to the outfit."
          style={{ flex: 1 }}
          disabled={!live}
        />
        <button disabled={!live}>Aplicar</button>
      </form>

      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <button onClick={() => setCategory(undefined)} disabled={!category}>Todo</button>
        {categories.map((c) => (
          <button key={c.slug} onClick={() => setCategory(c.slug)} disabled={category === c.slug}>
            {c.name}
          </button>
        ))}
      </nav>

      {loading ? (
        <p>Cargando catálogo…</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {products.map((p) => (
            <li key={p.id} style={{ border: tryon.activeProduct?.slug === p.slug ? "2px solid #6cf" : "1px solid #ccc", padding: 8 }}>
              <img src={p.image_url} alt={p.name} loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "contain" }} />
              <div style={{ fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{formatPrice(p.price)}</div>
              <button onClick={() => tryon.tryOn(p)} disabled={tryon.applying} style={{ width: "100%", marginTop: 4 }}>
                Probar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
