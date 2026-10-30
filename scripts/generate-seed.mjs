// Genera supabase/seed.sql a partir de src/data/catalog.js.
// Uso: node scripts/generate-seed.mjs
import { writeFileSync } from "node:fs";
import { CATEGORIES, PRODUCTS } from "../src/data/catalog.js";

const q = (v) => (v === null || v === undefined ? "null" : typeof v === "string" ? `'${v.replaceAll("'", "''")}'` : String(v));

const cats = CATEGORIES.map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${c.sort_order})`).join(",\n");
const prods = PRODUCTS.map(
  (p) =>
    `  (${[p.slug, p.name, p.category, p.gender, p.price, p.image_url, p.use_reference_image, p.garment_description, p.tryon_prompt ?? null, 25].map(q).join(", ")})`,
).join(",\n");

const sql = `-- Generado por scripts/generate-seed.mjs. No editar a mano.
insert into public.store_categories (slug, name, sort_order) values
${cats}
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.store_products (slug, name, category, gender, price, image_url, use_reference_image, garment_description, tryon_prompt, stock) values
${prods}
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, gender = excluded.gender, price = excluded.price,
  image_url = excluded.image_url, use_reference_image = excluded.use_reference_image,
  garment_description = excluded.garment_description, tryon_prompt = excluded.tryon_prompt;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`seed.sql: ${CATEGORIES.length} categorías, ${PRODUCTS.length} productos`);
