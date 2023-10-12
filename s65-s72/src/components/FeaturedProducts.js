import '../styles/components/FeaturedProducts.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen"; 

import { fill } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productImg, setProductImg] = useState([]);

  useEffect(() => {
    // Fetch featured products from your backend API
    fetch(`${process.env.REACT_APP_API_URL}/products/allActive`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure a maximum of 4 featured products
        const limitedFeaturedProducts = data.products.slice(0, 4);
        setFeaturedProducts(limitedFeaturedProducts);

        // Extract and set the product image URLs
        const productImageUrls = limitedFeaturedProducts.map((product) => product.productImage);
        setProductImg(productImageUrls);
      })
      .catch((error) => {
        console.error('Error fetching featured products:', error);
      });
  }, []);

  // Initialize Cloudinary instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dgw5bg7ub', 
    },
  });

  return (
    <div className="container my-5">
      <h2 className="text-center title">Hot Products</h2>
      <CardGroup className="my-3">
        {featuredProducts.map((product, index) => (
          <Card key={product._id} className="hot-products hot">
            {/* Create an image transformation URL for each product */}
            <AdvancedImage
              cldImg={cld.image(productImg[index]).resize(fill().width(455).height(250).gravity(focusOn(FocusOn.faces())))}
            />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
            </Card.Body>
              <Card.Text className="price">&#8369; {product.price}</Card.Text>
              <a as={Link} to='/viewProduct' className="btn btn-primary">
                View Details
              </a>
          </Card>
        ))}
      </CardGroup>
    </div>
  );

}

export default FeaturedProducts;
