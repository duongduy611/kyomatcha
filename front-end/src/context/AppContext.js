import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('Tất cả');


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

  const blogCategoryMapping = {
    'discover-matcha': 'Khám phá về Matcha',
    'beauty': 'Làm đẹp',
    'recipe': 'Pha chế'
  };

  const updateCategory = (urlCategory) => {
    setSelectedCategory(urlCategory);
  };

  const updateBlogCategory = (category) => {
    setSelectedBlogCategory(category);
  };

  const getCategoryDisplay = (category) => {
    return categoryMapping[category] || category;
  };

  const contextValue = {
    selectedCategory,
    setSelectedCategory,
    selectedBlogCategory,
    setSelectedBlogCategory,
    updateCategory,
    updateBlogCategory,
    categoryMapping,
    blogCategoryMapping,
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