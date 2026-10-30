import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../services/products.js";

export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchProducts({ category }), fetchCategories()]).then(([res, cats]) => {
      if (cancelled) return;
      setProducts(res.products);
      setSource(res.source);
      setCategories(cats);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, categories, source, loading };
}
