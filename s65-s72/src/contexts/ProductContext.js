import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

// Custom hook for ProductContext
export function useProduct() {
  return useContext(ProductContext);
}

// ProductContext Provider 
export function ProductProvider({ children }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch product details
  const fetchProductDetails = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await response.json();
      console.log(productData.item);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ product, loading, fetchProductDetails }}>
      {children}
    </ProductContext.Provider>
  );
}