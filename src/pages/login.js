import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Perform login logic here
    // For example, you can make an API call to your backend to authenticate the user
    fetch('https://studygenie-mongodb1.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        // On successful login, store the email in local storage
        localStorage.setItem('userEmail', data.email);
        // Redirect to the profile page or dashboard
        navigate('/dashboard');
        toast.success('Login successful');
      })
      .catch(error => {
        console.error('Error during login:', error);
        toast.error('Login failed');
      });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <ToastContainer/>
      <h1>Welcome Back Stud! 😉</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>Login Credentials</legend>
          <label>Email:</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required', 
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address'
              }
            })}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}

          <label>Password:</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required', 
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long'
              }
            })}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error-msg">{errors.password.message}</p>}
        </fieldset>
        <button type="submit">Login</button>
      </form>
      <div className="new-student">
        <p>New student? <span className="enroll-now" onClick={handleRegisterClick}>Enroll Now</span></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
