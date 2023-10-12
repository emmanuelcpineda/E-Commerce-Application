import '../styles/components/Products.css';
import {Button, Card} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

import {fill} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

function ViewProduct({ productId}) {
  const [product, setProduct] = useState('')

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      //console.log(data);
      if(!data){
        console.warn('Unable to fetch product data');
      }

      const productData = data.item;
      //console.log(productData)
      setProduct(productData);
    })
  });
  //console.log(product);
  //fetch product's image
  const img = product.productImage;

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dgw5bg7ub'
    }
  });
 
  const productImg = cld.image(img);

  productImg
  .resize(fill().width(455).height(250).gravity(focusOn(FocusOn.faces())));

  return (
  <Card className="view-product-container" style={{backgroundColor: 'var(--clrLime200)'}}>
    <div>
      <h2 className="title">Product Details</h2>
    </div>
    <div>
      <AdvancedImage cldImg={productImg} className="img"/>
    </div>
    <div className="body">
      <p>Name: {product.name}</p>
      <p>Description: {product.description}</p>
      <p>Price: &#8369; {product.price}</p>
      <Button variant="info" as={Link} to="/checkout">Checkout</Button>
    </div>
  </Card>
  );
}

export default ViewProduct;