import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFeaturedProducts(limit = 4) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (err) setError(err.message);
      else setProducts(data || []);
      setLoading(false);
    }
    fetch();
  }, [limit]);

  return { products, loading, error };
}
