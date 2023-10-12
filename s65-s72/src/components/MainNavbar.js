import '../styles/components/MainNavbar.css';
import logo from '../images/logo.png'
import React, {useEffect, useState} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { useUser } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
 
function MainNavbar() {
  const {logout} = useUser();
  const navigate = useNavigate();

  //set state for user data
  const [userInfo, setUserInfo] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect( () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/info/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
    .then(data => {
      console.log(data);

      const userData = {
        id: data._id,
        isAdmin: data.isAdmin
      }
      setUserInfo(userData);
    });

  }, [token, setUserInfo]);
  //console.log(userInfo);

  const logoutUser = (e) => {
    e.preventDefault();

    // redirect user
    navigate('/login');

    // call logout function from UserContext
    logout(); 

  }

  return (
    <Navbar className="main-nav" expand="lg">
      <Container className="nav">
        <Navbar.Brand as={Link} to="/products"><img src={logo} alt="app-logo" className="brand-logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="nav">

            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            { userInfo && !userInfo.id && (
            <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link> 
            </> )}
            { userInfo && (userInfo.id) && (
            <>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} onClick={e => {logoutUser(e)}}>Logout</Nav.Link>
            </> ) }
            { userInfo && userInfo.isAdmin && (
            <Nav.Link as={Link} to="/admin">Admin</Nav.Link> ) }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;