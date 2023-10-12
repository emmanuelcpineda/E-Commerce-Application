import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

function UserOrders() {
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');
	const productId = localStorage.getItem('productsId');
	const [order, setOrder] = useState('');
	const [user, setUser] = useState('');
	const [product, setProduct] = useState([]);

	const fetchUser = async () => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/users/info/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		if(!response.ok) {
			console.warn('unable to fetch user data'); 
		}

		const userData = await response.json();
		console.log(userData);

		setUser(userData);
	}

	const fetchProduct = () => {
		fetch(`${process.env.API_URI}/products/${productId}`, {
			method: 'GET',
			Authorization: `Bearer ${token}`
		})
		.then(res => res.json())
		.then(data => {
			console.log(data.products);

			const productData = data.products;
			const product = []

			for(let i = 0; i < productData.length; i ++){
				product.push(productData[i]);
			}
			setProduct(product)
		})
	}; 
	
	const fetchOrders = () => {
		fetchUser();
		fetchProduct();

		fetch(`${process.env.API_URI}/orders/myPurchases/${order._id}`, {
			method: 'GET',   
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			setOrder(data);
		})
	}

	const fetchAllOrders = () => {
		fetch(`${process.env.API_URI}/orders/`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(!data) {
				console.warn('unable to fetch all orders');
			}
			setOrder(data);
		})
	}

	useEffect(() => {
		if(user.isAdmin) {
			fetchAllOrders();
		} else {
			fetchOrders();
		}

	}, [])
	
	return (
	<Table striped hover responsive>

	  <thead>
	    <tr className="text-center">
	      <th>USER ID</th>
	      <th>USER NAME</th>
	      <th>PRODUCT ID</th>
	      <th>PRODUCT NAME</th>
	      <th>PRICE</th>
	      <th>QUANTITY</th>
	      <th>Status</th>
	    </tr>
	  </thead>
	  <tbody>
	  	<tr key={order._id}>
	        <td>{user._id}</td>
	        <td>{user.name}</td>
	        <td>{product._id}</td>
	        <td>{product.name}</td>
	        <td>&#8369; {product.price}</td> 
	        <td>{order.quantity}</td>
	        <td>Completed</td>
        </tr>
	  </tbody>
	</Table>
	)
}

export default UserOrders;