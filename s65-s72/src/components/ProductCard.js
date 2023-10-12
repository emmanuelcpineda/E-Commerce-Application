//import { Button } from 'react-bootstrap';
import '../styles/components/Products.css'
import {Link} from 'react-router-dom';
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

import {fill} from "@cloudinary/url-gen/actions/resize";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

function ProductCard({ product }) {
  console.log(product.productImage);
  const imgPublicId = product.productImage;
 
  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dgw5bg7ub'
    }
  });

  // cld.image returns a CloudinaryImage with the configuration set.
  const productImg = cld.image(imgPublicId);

  productImg
  .resize(fill().width(363).height(250).gravity(focusOn(FocusOn.faces())));

  return (
    <div className="card">
    <Link to={`/viewProduct`} className="product-info">
      <AdvancedImage cldImg={productImg} />
      <div className="card-body">
        <h5 className="card-title ">{product.name}</h5>
      </div>
    </Link>
    </div>
  );
}

export default ProductCard;