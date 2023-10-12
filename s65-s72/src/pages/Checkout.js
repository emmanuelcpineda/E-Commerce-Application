import '../styles/components/Products.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';

function Checkout({productId, productInfo}) {
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');
	const [quantity, setQuantity] = useState(1);
	const [product, setProduct] = useState('');
	const navigate = useNavigate();
	
	const createOrder = () => {
		fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
			method: 'POST',
			Authorization: `Bearer ${token}`,
			body: JSON.stringify({
				userId: userId, 
				productId: productId,
				quantity: quantity
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data) {
				navigate('/products');
				
				alert('Success! New Order Created.');

			} else {
				alert('Failed. Unable to create order.')
			}
		})
	}

	useEffect(() => {
			productInfo.forEach(product => {
	        setProduct(product);
	    })
	}, [productInfo]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
  <Card className="view-product-container" style={{backgroundColor: 'var(--clrLime200)', height: '23rem'}}>
    <Form onSubmit={createOrder}>
      <div>
        <h2 className="title">Checkout Product</h2>
      </div>
      <div className="checkout-body">
        <p>Name: {product.name}</p>
        <p>Description: {product.description}</p>
        <p>Price: &#8369; {product.price}</p>
      </div>
      <div className="checkout-body">
        <Button
          variant="secondary"
          type="button"
          onClick={decreaseQuantity}
          style={{ marginRight: '10px' }}
        >
          -
        </Button>
        <span>{quantity}</span>
        <Button
          variant="secondary"
          type="button"
          onClick={increaseQuantity}
          style={{ marginLeft: '10px' }}
        >
          +
        </Button>
      </div>
      <Button variant="success" type="submit" className="checkout-button">
        Buy
      </Button>
    </Form>
  </Card>
  );
}

export default Checkout;