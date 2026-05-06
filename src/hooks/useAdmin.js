import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useIsAdmin() {
  const { profile } = useAuth();
  return profile?.is_admin === true;
}

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    if (err) setError(err.message);
    else setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function createProduct(payload) {
    const { data, error: err } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
    if (!err && data) setProducts((p) => [...p, data]);
    return { data, error: err };
  }

  async function updateProduct(id, payload) {
    const { data, error: err } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (!err && data)
      setProducts((p) => p.map((x) => (x.id === id ? data : x)));
    return { data, error: err };
  }

  async function deleteProduct(id) {
    const { error: err } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (!err) setProducts((p) => p.filter((x) => x.id !== id));
    return { error: err };
  }

  async function toggleActive(id, current) {
    return updateProduct(id, { is_active: !current });
  }

  return {
    products,
    loading,
    error,
    refetch: fetch,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
  };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (err) setError(err.message);
    else setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function updateOrderStatus(id, status) {
    const { error: err } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (!err)
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    return { error: err };
  }

  // Derived analytics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'processing'].includes(o.status),
  ).length;
  const avgOrderValue =
    totalOrders > 0
      ? totalRevenue /
        (totalOrders - orders.filter((o) => o.status === 'cancelled').length ||
          1)
      : 0;

  return {
    orders,
    loading,
    error,
    refetch: fetch,
    updateOrderStatus,
    totalRevenue,
    totalOrders,
    pendingOrders,
    avgOrderValue,
  };
}
