import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/components/Profile.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: '',
  });
  const [isActive, setIsActive] = useState(false);

  const { register } = useUser();
  const navigate = useNavigate();

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
      // Perform registration logic
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNum: formData.phoneNum,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      if(!response.ok) {
        throw new Error('Error Occurred. Registration Failed.');
      }

      if(response.ok) {
        const userData = await response.json();

        console.log(userData);
        alert('Registration Success!');

        register(userData);

        // Redirect the user to login page
        navigate('/login');

      } else {
        alert('Unable to Register.');
      } 

    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration failure
    }
  };

  useEffect( () => {
    if( (formData.name !== ''
      && formData.email !== ''
      && formData.phoneNum !== ''
      && formData.password !== ''
      && formData.confirmPassword !== '') 
      && (formData.password === formData.confirmPassword) 
      && (formData.phoneNum.length === 11) )
    {
      setIsActive(true);
    }
    else 
    {
      setIsActive(false);
    }
  })


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <h2 className="text-center font">Register</h2>
          <form onSubmit={handleSubmit} className="font">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
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
              <label htmlFor="phoneNum" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNum"
                name="phoneNum"
                value={formData.phoneNum}
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

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            { (isActive) ?
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            :
            <button type="submit" className="btn btn-primary" disabled>
              Register
            </button> }
          </form>
          <p className="mt-3 font">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
