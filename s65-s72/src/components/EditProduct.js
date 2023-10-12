import {Button, Card, Form} from 'react-bootstrap';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/components/Admin.css';
 
export default function EditProduct({product, fetchData}) {
  const navigate = useNavigate();

  //forms state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  //state for editCourse modals to open/close
  const [showEdit, setShowEdit] = useState(false);

  //function for opening the modal
  const openEdit = (productId) => {
    fetch(`${process.env.API_URI}/products/${productId}`, {
      method: 'GET', 
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const productData = data.products;
      productData.map( product => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
      })      
    })
    //open modal
    setShowEdit(true);
  }

  const closeEdit = () => {
    setShowEdit(false);
    setName('');
    setDescription('');
    setPrice(0);
  }
//function to update/edit a course
const editProduct = (e, productId) => {
  e.preventDefault();

  fetch(`${process.env.REACT_APP_API_URL}/products/updateInfo/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      name: name,
      description: description,
      price: price
    })
  }).then(res => res.json())
  .then(data => {
    console.log(data);

    if(data){
      alert('Success! Product has been updated.');

      closeEdit();
      fetchData();

      navigate('/admin');
    }
    else{
      alert('Failed. Unable to update product.');

      closeEdit();
      fetchData();
    }
  })
}

  return(
<>
{/*EDIT MODAL*/}
    <Form onSubmit={e => editProduct(e, product)} className="admin-container">
        <Card.Header className="text-center" style={{fontSize: '2.8rem'}}>
            <Card.Title className="text-center" style={{fontSize: '2.3rem'}}>Edit Product</Card.Title>
        </Card.Header>
        <Card.Body className="edit-body">    
            <Form.Group controlId="courseName" style={{paddingBottom: '15px'}}>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" 
                value={name} required
                onChange={e => {setName(e.target.value)}} />
            </Form.Group>
            <Form.Group controlId="courseDescription" style={{paddingBottom: '15px'}}>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={description} required
                onChange={e => {setDescription(e.target.value)}} />
            </Form.Group>
            <Form.Group controlId="coursePrice" style={{paddingBottom: '15px'}}>
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" value={price} required
                onChange={e => {setPrice(e.target.value)}} />
            </Form.Group>
        </Card.Body>
        <Card.Footer>
            <Button variant="success" type="submit" className="edit-button">Save</Button>
        </Card.Footer>
    </Form>

</>
  )
}