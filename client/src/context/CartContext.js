import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
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
  // Initialize state with items from localStorage
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

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('tokyoLoreCart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (story) => {
    dispatch({ type: 'ADD_TO_CART', payload: story });
  };

  const removeFromCart = (storyId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: storyId });
  };

  const updateQuantity = (storyId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: storyId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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
