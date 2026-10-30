import { useState } from "react";
import { Mirror, StatusPill } from "./components/Mirror.jsx";
import { ProductCard } from "./components/ProductCard.jsx";
import { useProducts } from "./hooks/useProducts.js";
import { useVirtualTryOn } from "./hooks/useVirtualTryOn.js";

export default function App() {
  const [category, setCategory] = useState();
  const { products, categories, loading } = useProducts(category);
  const tryon = useVirtualTryOn();
  const [prompt, setPrompt] = useState("");
  const live = tryon.status === "connected" || tryon.status === "generating";
  const categoryName = categories.find((c) => c.slug === category)?.name ?? "Todo el catálogo";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          Ropa <span className="brand__tag">probador virtual</span>
        </div>
        <StatusPill status={tryon.status} />
      </header>

      <main className="layout">
        <section className="layout__mirror" aria-label="Probador">
          <Mirror tryon={tryon} />

          <form
            className="prompt"
            onSubmit={(e) => {
              e.preventDefault();
              if (prompt.trim()) tryon.tryPrompt(prompt.trim());
            }}
          >
            <label htmlFor="prompt" className="visually-hidden">
              Describe otra prenda en inglés
            </label>
            <input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={live ? "Describe otra prenda: Add a white bucket hat to the outfit." : "Enciende el probador para describir prendas"}
              disabled={!live}
            />
            <button className="btn btn--fuchsia" disabled={!live || !prompt.trim() || tryon.applying}>
              Probar
            </button>
          </form>
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog__head">
            <h2 id="catalog-title">{categoryName}</h2>
            {!loading && <span className="catalog__count">{products.length} prendas</span>}
          </div>

          <nav className="tabs" aria-label="Categorías">
            <button className="tab" aria-pressed={!category} onClick={() => setCategory(undefined)}>
              Todo
            </button>
            {categories.map((c) => (
              <button key={c.slug} className="tab" aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>
                {c.name}
              </button>
            ))}
          </nav>

          {loading ? (
            <div className="grid" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : (
            <ul className="grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  active={tryon.activeProduct?.slug === p.slug}
                  disabled={tryon.applying}
                  onTry={tryon.tryOn}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
