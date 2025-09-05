import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const PurchaseContext = createContext();

const purchaseReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PURCHASE':
      
      const newPurchases = action.payload.items.map(item => ({
        ...item,
        purchaseDate: new Date().toISOString(),
        purchaseId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return {
        ...state,
        purchases: [...state.purchases, ...newPurchases]
      };
    
    case 'LOAD_PURCHASES':
      return {
        ...state,
        purchases: action.payload
      };
    
    case 'CLEAR_PURCHASES':
      return {
        ...state,
        purchases: []
      };
    
    default:
      return state;
  }
};

export const PurchaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(purchaseReducer, {
    purchases: []
  });

  useEffect(() => {
    const savedPurchases = localStorage.getItem('tokyoLorePurchases');
    if (savedPurchases) {
      try {
        const purchases = JSON.parse(savedPurchases);
        dispatch({ type: 'LOAD_PURCHASES', payload: purchases });
      } catch (error) {
        console.error('Error loading purchases from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tokyoLorePurchases', JSON.stringify(state.purchases));
  }, [state.purchases]);

  const addPurchase = useCallback((items) => {
    dispatch({ type: 'ADD_PURCHASE', payload: { items } });
  }, []);

  const clearPurchases = useCallback(() => {
    dispatch({ type: 'CLEAR_PURCHASES' });
  }, []);

  const getPurchasedStories = useCallback(() => {
    return state.purchases;
  }, [state.purchases]);

  const isStoryPurchased = useCallback((storyId) => {
    return state.purchases.some(purchase => purchase.id === storyId);
  }, [state.purchases]);

  return (
    <PurchaseContext.Provider value={{
      purchases: state.purchases,
      addPurchase,
      clearPurchases,
      getPurchasedStories,
      isStoryPurchased
    }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};
