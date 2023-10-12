import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/components/Products.css'

function Products() {
  const [products, setProducts] = useState([]);
 
  useEffect(() => {
    // Fetch products from your backend here
    fetch(`${process.env.REACT_APP_API_URL}/products/allActive`, {
      method: 'GET',
      headers: {
        Aurhorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        const productData = data.products;
        setProducts(productData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="product-container">
      <h2 className="products-title">Products</h2>
      <div className="row ">
        {products.map((product) => (
          <div key={product._id} className="col-md-4 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;