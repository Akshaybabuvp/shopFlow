import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        // Fetch main product
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (err) throw err;
        if (!cancelled) {
          setProduct(data);

          // Fetch related products (same category, different id)
          const { data: rel } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .eq('is_active', true)
            .neq('id', id)
            .limit(4);

          if (!cancelled) setRelated(rel || []);
        }
      } catch (err) {
        console.error('useProduct error:', err);
        if (!cancelled) setError(err.message || 'Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, related, loading, error };
}
