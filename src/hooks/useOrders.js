import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (err) setError(err.message);
    else setOrders(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { orders, loading, error, refetch: fetch };
}

export function useOrderByNumber(orderNumber) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single();

      if (!cancelled) {
        if (err)
          setError('Order not found. Check the order number and try again.');
        else setOrder(data);
        setLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  return { order, loading, error };
}
