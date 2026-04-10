import React, { createContext, useState, useContext } from 'react';

const RegistryContext = createContext();

export const RegistryProvider = ({ children }) => {
  // Global registry array
  const [registryItems, setRegistryItems] = useState([]);
  
  // Role can be 'registrant' or 'guest'
  const [userRole, setUserRole] = useState('registrant');
  
  // Used mainly for guest flow to know which registry they are viewing
  const [selectedRegistry, setSelectedRegistry] = useState(null);

  // Helper function to add item
  const addItemToRegistry = (item) => {
    setRegistryItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  // Helper to update item status (e.g. guest buying an item)
  const updateItemStatus = (itemId, newStatus) => {
    setRegistryItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i))
    );
  };

  // Helper to increment contributor count
  const incrementContributors = (itemId) => {
    setRegistryItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, contributors: (i.contributors || 0) + 1 } : i))
    );
  };

  return (
    <RegistryContext.Provider
      value={{
        registryItems,
        setRegistryItems,
        userRole,
        setUserRole,
        selectedRegistry,
        setSelectedRegistry,
        addItemToRegistry,
        updateItemStatus,
        incrementContributors,
      }}
    >
      {children}
    </RegistryContext.Provider>
  );
};

export const useRegistry = () => useContext(RegistryContext);
