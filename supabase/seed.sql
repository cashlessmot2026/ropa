-- Generado por scripts/generate-seed.mjs. No editar a mano.
insert into public.store_categories (slug, name, sort_order) values
  ('camisas', 'Camisas', 1),
  ('mujer', 'Ropa de mujer', 2),
  ('zapatos', 'Zapatos', 3),
  ('gorras', 'Gorras', 4),
  ('gafas', 'Gafas', 5),
  ('accesorios', 'Accesorios', 6)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.store_products (slug, name, category, gender, price, image_url, use_reference_image, garment_description, tryon_prompt, stock) values
  ('camisa-cuadros-azul', 'Camisa a cuadros azul y negra', 'camisas', 'hombre', 119900, '/products/camisa-cuadros-azul.webp', true, 'a long-sleeve button-up shirt with a blue, black and white check pattern and a classic collar', null, 25),
  ('camisa-plaid', 'Camisa plaid', 'camisas', 'hombre', 139900, '/products/camisa-plaid.webp', true, 'a long-sleeve plaid flannel button-up shirt with a classic collar', null, 25),
  ('camisa-manga-corta', 'Camisa manga corta', 'camisas', 'hombre', 79900, '/products/camisa-manga-corta.webp', true, 'a short-sleeve button-up shirt with a relaxed fit', null, 25),
  ('camiseta-aorus', 'Camiseta gráfica Aorus', 'camisas', 'hombre', 99900, '/products/camiseta-aorus.webp', true, 'a black crewneck t-shirt with a large graphic logo print on the chest', null, 25),
  ('vestido-gala-negro', 'Vestido de gala negro', 'mujer', 'mujer', 519900, '/products/vestido-gala-negro.webp', true, 'a long black evening gown with a fitted bodice and a floor-length skirt', null, 25),
  ('corset-falda-cuero', 'Corset con falda de cuero', 'mujer', 'mujer', 359900, '/products/corset-falda-cuero.webp', true, 'a black leather corset top with a matching leather skirt', null, 25),
  ('vestido-pea', 'Vestido Pea', 'mujer', 'mujer', 199900, '/products/vestido-pea.webp', true, 'a knee-length casual dress', null, 25),
  ('vestido-azul', 'Vestido azul', 'mujer', 'mujer', 119900, '/products/vestido-azul.webp', true, 'a blue knee-length frock dress with a flared skirt', null, 25),
  ('vestido-tartan', 'Vestido tartán con lazo', 'mujer', 'mujer', 159900, '/products/vestido-tartan.webp', true, 'a sleeveless grey and white tartan dress with a flared skirt and a large black satin bow at the waist', null, 25),
  ('vestido-gris', 'Vestido gris', 'mujer', 'mujer', 139900, '/products/vestido-gris.webp', true, 'a grey knee-length dress with a simple silhouette', null, 25),
  ('jordan-1-rojo-negro', 'Nike Air Jordan 1 rojo y negro', 'zapatos', 'unisex', 599900, '/products/jordan-1-rojo-negro.webp', true, 'red and black high-top leather basketball sneakers', null, 25),
  ('puma-future-rider', 'Puma Future Rider', 'zapatos', 'unisex', 359900, '/products/puma-future-rider.webp', true, 'retro running sneakers with colorful suede panels', null, 25),
  ('sneakers-off-white-rojo', 'Tenis Off White y rojo', 'zapatos', 'unisex', 479900, '/products/sneakers-off-white-rojo.webp', true, 'off-white sports sneakers with red accents', null, 25),
  ('tacones-calvin-klein', 'Tacones Calvin Klein', 'zapatos', 'mujer', 319900, '/products/tacones-calvin-klein.webp', true, 'elegant high-heel pumps', null, 25),
  ('zapatos-rojos', 'Zapatos rojos', 'zapatos', 'mujer', 139900, '/products/zapatos-rojos.webp', true, 'glossy red heeled shoes', null, 25),
  ('gorra-negra-clasica', 'Gorra negra clásica', 'gorras', 'unisex', 69900, '/products/gorra-negra.svg', false, 'a plain black cotton baseball cap with a curved brim', null, 25),
  ('gorra-roja-trucker', 'Gorra trucker roja', 'gorras', 'unisex', 74900, '/products/gorra-roja.svg', false, 'a red trucker baseball cap with a white mesh back and a flat brim', null, 25),
  ('gorra-azul-snapback', 'Gorra snapback azul', 'gorras', 'unisex', 79900, '/products/gorra-azul.svg', false, 'a navy blue snapback baseball cap with a flat brim and a small white logo on the front', null, 25),
  ('gafas-negras', 'Gafas de sol negras', 'gafas', 'unisex', 119900, '/products/gafas-negras.webp', true, 'black sunglasses with dark lenses', null, 25),
  ('gafas-clasicas', 'Gafas de sol clásicas', 'gafas', 'unisex', 99900, '/products/gafas-clasicas.webp', true, 'classic sunglasses with a thin frame', null, 25),
  ('bolso-azul', 'Bolso azul de mujer', 'accesorios', 'mujer', 199900, '/products/bolso-azul.webp', true, 'a blue women''s leather handbag', null, 25)
on conflict (slug) do update set
  name = excluded.name, category = excluded.category, gender = excluded.gender, price = excluded.price,
  image_url = excluded.image_url, use_reference_image = excluded.use_reference_image,
  garment_description = excluded.garment_description, tryon_prompt = excluded.tryon_prompt;
