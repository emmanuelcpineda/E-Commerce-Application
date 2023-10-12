import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/components/Profile.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isActive, setIsActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Perform authentication logic
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          email: formData.email, 
          password: formData.password, 
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      if(response.ok) {
        const userData = await response.json();

        // Call the login function to set the user data in the context
        login(userData);

        console.log(userData._id);
        const userId = localStorage.setItem('userId', userData._id);

        alert('Login Success!')

        // Redirect the user to the home page or another protected route
        navigate('/');
      } else {
        alert('Error. Login Failed.');
      }

    } catch (error) {
      console.error('Unable to Login:', error);
    }
  };

  useEffect( () => {
    if(formData.email !== '' && formData.password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  })

  return (
    <div className="col-md-6 mx-auto pt-5">
      <h2 className="text-center font">Login</h2>
      <form onSubmit={handleSubmit} className="pb-3 font">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        { isActive ?
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        :
        <button type="submit" className="btn btn-primary mb-2" disabled>
          Login
        </button> }

        <p className="font">Don't have an account yet? <Link to='/register'>Create here</Link></p>        
      </form>
    </div>
  );
}

export default Login;
