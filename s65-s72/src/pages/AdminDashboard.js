import { createContext, useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import EditProduct from '../components/EditProduct';
import { useProduct } from '../contexts/ProductContext';
import '../styles/components/Admin.css'

// Context object
const ProductContext = createContext();

function useProductContext() {
  return useContext(ProductContext);
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { fetchProductDetails } = useProduct();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem('token');
  //console.log(token);
  // Function to open the edit form for a specific product
  const openEditForm = (productId) => {
    
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      method: 'GET',
      Authorization: `Bearer ${token}`
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if(!data) {
        console.warn('unable to fetch product details')
      }
      const fetchedProduct = data.item;

      setEditingProduct(fetchedProduct);

    })

    //editingProduct();
  };

  const closeEditForm = () => {
    setEditingProduct(null);
  };

  const saveChanges = (productId, updatedData) => {
    console.log(productId, updatedData);
    fetch(`${process.env.REACT_APP_API_URL}/products/updateInfo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: updatedData.name,
        price: updatedData.price,
        description: updatedData.description
      })
      .then(res => {
        if(!res.ok) {
          console.warn('Error, Unable to updated product');
        }
        res.json();
      })
      .then(data => {
        console.log(data);

        if(data) {
          alert(`Sucess! Product has been edited.`);

        } else {
          alert('Failed. Unable to edit product.')
        }

        setProducts(data);

        navigate('/admin');
      })
    })
  }

  const toggleArchive = (productId, isActive) => {
      const newStatus = !isActive; // Toggle the status; true to false, vice-versa
      const token = localStorage.getItem('token');
      // Make an API call to update the product's isActive status
      fetch(`${process.env.REACT_APP_API_URL}/products/setToNotActive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          isActive: newStatus,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.warn('Error, Unable to update product status');
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);

          if (data) {
            alert(`Success! Product status has been updated.`);
          } else {
            alert('Failed. Unable to update product status.');
          }

          fetchProductList(); // Refresh productList

          navigate('/admin');
        });
    };

    const toggleActive = (productId, isActive) => {
        const newStatus = !isActive; // Toggle the status; true to false, vice-versa
        const token = localStorage.getItem('token');
        // Make an API call to update the product's isActive status
        fetch(`${process.env.REACT_APP_API_URL}/products/setToActive`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: productId,
            isActive: newStatus,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              console.warn('Error, Unable to update product status');
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);

            if (data) {
              alert(`Success! Product status has been updated.`);
            } else {
              alert('Failed. Unable to update product status.');
            }

            fetchProductList(); // Refresh productList

            navigate('/admin');
          });
      };

  const fetchProductList = () => {
    const token = localStorage.getItem('token');
    //console.log(token);
    fetch(`${process.env.REACT_APP_API_URL}/products/`, {
      method: 'GET',
      Authorization: `Bearer ${token}`
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        const productsData = data.products;
        const productsArray = productsData.map((product) => (
          <tr key={product._id}>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>&#8369; {product.price}</td>
            <td>{product.isActive ? 'Available' : 'Unavailable'}</td>
            <td>
              <Button variant="info" as={Link} to='/editProduct'>
                Edit
              </Button>
            </td>
            <td>
              { product.isActive ? (
                <Button
                  variant="warning"
                  onClick={() => toggleArchive(product._id, product.isActive)}
                >
                  Archive
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => toggleActive(product._id, product.isActive)}
                >
                  Activate
                </Button> )}
            </td>
          </tr>
        ));

        setProducts(productsArray);
      });
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="text-center">Admin Dashboard</h1>
      <Button variant="warning" as={Link} to="/addProduct" className="button">
        Add Product
      </Button>
      <Table striped hover responsive className="table">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>NAME</th>
            <th>DESCRIPTION</th>
            <th>PRICE</th>
            <th>AVAILABILITY</th>
            <th colSpan="2">ACTIONS</th>
          </tr>
        </thead>
        <tbody>{products}</tbody>
      </Table>
    </div>
  );
}

export { AdminDashboard, useProductContext };
