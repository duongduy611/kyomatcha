import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categoryMapping = {
    'matcha': 'Matcha',
    'tea_tools': 'Dụng cụ trà đạo',
    'barista_tools': 'Dụng cụ pha chế'
  };

  const reverseCategoryMapping = {
    'Matcha': 'matcha',
    'Dụng cụ trà đạo': 'tea_tools',
    'Dụng cụ pha chế': 'barista_tools'
  };

  const updateCategory = (urlCategory) => {
    setSelectedCategory(urlCategory);
  };

  const getCategoryDisplay = (category) => {
    return categoryMapping[category] || category;
  };

  // Giá trị context có thể mở rộng thêm các state và functions khác trong tương lai
  const contextValue = {
    selectedCategory,
    setSelectedCategory,
    updateCategory,
    categoryMapping,
    getCategoryDisplay,
    reverseCategoryMapping
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 