import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

// ── Reducer ──────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (i) => i.id === action.payload.id && i.color === action.payload.color,
      );
      if (existing) {
        return state.map((i) =>
          i.id === action.payload.id && i.color === action.payload.color
            ? { ...i, qty: i.qty + action.payload.qty }
            : i,
        );
      }
      return [...state, { ...action.payload }];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        (i) =>
          !(i.id === action.payload.id && i.color === action.payload.color),
      );

    case 'UPDATE_QTY':
      return state.map((i) =>
        i.id === action.payload.id && i.color === action.payload.color
          ? { ...i, qty: Math.max(1, action.payload.qty) }
          : i,
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

// ── Provider ─────────────────────────────────────────────
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('shopflow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shopflow_cart', JSON.stringify(items));
  }, [items]);

  // ── Derived values ──
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 999 ? 9.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // ── Actions ──
  function addItem(product, qty = 1, color = null) {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        color: color || product.colors?.[0] || null,
        qty,
      },
    });
  }

  function removeItem(id, color) {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, color } });
  }

  function updateQty(id, color, qty) {
    dispatch({ type: 'UPDATE_QTY', payload: { id, color, qty } });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
