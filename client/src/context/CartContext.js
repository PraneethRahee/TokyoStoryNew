import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../utils/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const hasSynced = useRef(false);
  const lastUserId = useRef(null);

  const getInitialState = () => {
    const savedCart = localStorage.getItem('tokyoLoreCart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        return { items: cartItems };
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    return { items: [] };
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('tokyoLoreCart', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    const syncFromServer = async () => {
      if (!isAuthenticated || !user?._id) return;
      
      if (hasSynced.current && lastUserId.current === user._id) return;
      
      hasSynced.current = true;
      lastUserId.current = user._id;
      
      try {
        const items = await cartAPI.get();
        const mapped = items.map(i => ({
          id: i.storyId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl
        }));
        dispatch({ type: 'SET_CART', payload: mapped });
      } catch (e) {
        console.warn('Failed to sync cart from server');
        hasSynced.current = false;
        lastUserId.current = null;
      }
    };
    syncFromServer();
  }, [isAuthenticated, user?._id]);

  const addToCart = useCallback(async (story) => {
    dispatch({ type: 'ADD_TO_CART', payload: story });
    if (isAuthenticated) {
      try {
        await cartAPI.add({ storyId: story.id, title: story.title, price: story.price, imageUrl: story.imageUrl });
      } catch {}
    }
  }, [isAuthenticated]);

  const removeFromCart = useCallback(async (storyId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: storyId });
    if (isAuthenticated) {
      try { await cartAPI.remove(storyId); } catch {}
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (storyId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: storyId, quantity } });
    if (isAuthenticated) {
      try { await cartAPI.updateQuantity(storyId, quantity); } catch {}
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) {
      try { await cartAPI.clear(); } catch {}
    }
  }, [isAuthenticated]);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
