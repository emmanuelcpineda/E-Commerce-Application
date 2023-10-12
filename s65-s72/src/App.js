import {useState, useEffect} from 'react';
import './styles/App.css';
import Container from 'react-bootstrap/Container';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ProductProvider, useProduct } from './contexts/ProductContext';
import MainNavbar from './components/MainNavbar';
import Footer from './components/Footer';
import Logout from './components/Logout';
import AddProduct from './components/AddProduct';
import ViewProduct from './components/ViewProduct';
import EditProduct from './components/EditProduct';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import UserOrders from './pages/UserOrders';
import {AdminDashboard} from './pages/AdminDashboard'; 
 
function App() {
  const [productData, setProductData] = useState([]);
  const [productId, setProductId] = useState('');
  const token = localStorage.getItem('token');

  //fetch products first
  useEffect( () => {
    if(token) {
      grabProducts();
    }
  }, []);

  const grabProducts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.products);
      const products = data.products;
      if(!data) {
        console.warn('unable to fetch products');
      }
      products.map(product => {
        //localStorage.setItem('productsId', product._id);
        setProductId(product._id);
      })

    })
    fetchProduct();
  }
  const fetchProduct = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then( res => res.json())
    .then( data => {
      console.log(data.products);
      const fetchedProduct = data.products;

      setProductData(fetchedProduct);
    })
  };

  console.log(productId);
  console.log(productData);

  return (
    <Router>
      <UserProvider>
      <ProductProvider>
        <MainNavbar />
        <div style={{margin:0, height: '200vh', 
        backgroundImage: 'linear-gradient(to right, var(--clrLime200), var(--clrYellow300))'}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/viewProduct" element={<ViewProduct productId={productId} productProps={productData} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout productId={productId} productInfo={productData}/>} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/userOrders" element={<UserOrders />} />
            <Route path="/editProduct" element={<EditProduct product={productId} fetchData={fetchProduct} />} />
            {/*-- handles any unautorized access or if user want to access a page that does not exist*/}
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </div>
        <Footer />
      </ProductProvider>
      </UserProvider>
    </Router>

  );
}

export default App;
