import { HangerIcon } from "./Icons.jsx";
import { formatPrice } from "../services/products.js";

export function ProductCard({ product, active, disabled, onTry }) {
  return (
    <li className="card" data-active={active}>
      <div className="card__tray">
        <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" />
        {!product.use_reference_image && <span className="card__badge">Prueba por descripción</span>}
      </div>
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <span className="card__price">{formatPrice(product.price)}</span>
      </div>
      <button
        className={`btn ${active ? "btn--fuchsia" : ""}`}
        onClick={() => onTry(product)}
        disabled={disabled}
        aria-pressed={active}
      >
        <HangerIcon /> {active ? "Puesta" : "Probar"}
      </button>
    </li>
  );
}
