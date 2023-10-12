import { useState, useEffect } from 'react';
import {Card, Form, FloatingLabel, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Admin.css'

function AddProduct() {
   const navigate = useNavigate();
	 const [formData, setFormData] = useState({
	 	name: '',
	 	description: '',
	 	price: '',
	 	productImage: '',
	 })
	 const token = localStorage.getItem('token');
	 const [isActive, setIsActive] = useState(false);
	 const [image, setImage] = useState('');

	 const handleChange = (e) => {
	   const { name, value } = e.target;
	   setFormData({
	     ...formData,
	     [name]: value,
	   });
	 };

	 //reads the image
	 const previewFile = (file) => {
	 	const reader = new FileReader();
	 	reader.readAsDataURL(file);

	 	reader.onloadend = () => {
	 		setImage(reader.result);
	 	}
	 	//console.log(image);
	 }

	 const handleImageChange = (e) => {
	   const file = e.target.files[0];
	 	//console.log(file);
	   
	   previewFile(file);

	   // Update the formData with the image URL
	   setFormData({
	     ...formData,
	     productImage: image,
	   });

	 };

	 const handleSubmit = async (e) => {
	   e.preventDefault();

	   try {
	     // Perform registration logic
	     const response = await fetch(`${process.env.REACT_APP_API_URL}/products/add`, {
	       method: 'POST',
	       headers: {
	         'Content-Type': 'application/json',
	         Authorization: `Bearer ${token}`
	       },
	       body: JSON.stringify({
	         name: formData.name,
	         description: formData.description,
	         price: formData.price,
	         productImage: formData.productImage,
	       })
	     });

	     if(!response.ok) {
	       throw new Error('Error Occurred. Failed to Add Product.');
	     }

	     if(response.ok) {
	       const productData = await response.json();

	       console.log(productData);
	       //console.log(productData.productImage.public_id);
	       alert('Product Successfully Added!');

	       // Redirect the user to admin page
	       navigate('/admin');

	     } else {
	       alert('Process Failed. Unable to Add Product.');
	     } 

	   } catch (error) {
	     // Handle registration failure
	     console.error('Error. Cannot Add Product:', error);
	   }
	 };

	useEffect(() => {
		if( formData.name !== "" 
			&& formData.description !== ""
			&& formData.price !== ""
			&& formData.productImage !== "" ) 
		{
			setIsActive(true);
		}
		else 
		{
			setIsActive(false);
		}
	}, [formData.name, formData.description, formData.price, formData.productImage]);

	return (
<div className="col-md-6 add-container">
<Card style={{width: '45rem'}} className="addproduct-card">
	<Card.Header className="text-center" style={{fontSize: '2.8rem'}}>Add Product</Card.Header>
	<Card.Body className="card-body addproduct-card">
		<Form onSubmit={handleSubmit}  encType="multipart/form-data">
			< FloatingLabel
        controlId="floatingInput1"
        label="Name"
        className="mb-3" >
			  <Form.Control type="text" placeholder="Name" name="name" required
			  value={formData.name} onChange={handleChange} />
			</FloatingLabel>

			< FloatingLabel
        controlId="floatingInput2"
        label="Price"
        className="mb-3" >
			  <Form.Control type="number" placeholder="Enter Product Price" name="price" required 
			  value={formData.price} onChange={handleChange} />
			</FloatingLabel>

			< FloatingLabel
        controlId="floatingInput3" 
        label="Description"
        className="mb-3" >
			  <Form.Control as="textarea" required rows={5} placeholder="Enter Product Description" name="description"  required
			  value={formData.description} onChange={handleChange} style={{ height: '100px' }}/>
			</FloatingLabel>

		  <Form.Group className="mb-3" >
		  	 <Form.Label htmlFor="uploadImage" style={{ fontSize: '0.90rem' }}>Upload Product Image</Form.Label>
	       <Form.Control type="file" required value={formData.uploadImage} name="productImage" 
	       onChange={handleImageChange} accept="image/jpg, image/jpeg, image/png, image/jfif" style={{ width: '260px' }}/>
	     </Form.Group>

		  {isActive ? 
		  <Button type="submit">Create</Button>
		  :
		  <Button type="submit" disabled>Create</Button> }
		</Form>
	</Card.Body>
</Card>
</div>
	)
}

export default AddProduct;