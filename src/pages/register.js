import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import "../styles/register.css";
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    subfield: "",
    year: "",
    college: "",
    age: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    toast.info('Welcome to StudyGenie! We are excited to have you here.', {
      position: "top-right",
      autoClose: 5000,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/register', data);
      console.log('Registration successful:', response.data);
      toast.success('Registration successful!', {
        position: "top-right",
        autoClose: 5000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed!', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleCustomSubmit = () => {
    document.getElementById('register-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <h1>Welcome to StudyGenie 😉</h1>
      <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="register-form">
        <fieldset>
          <legend>Personal Information & Credentials</legend>
          <label>Name:</label>
          <input className='inp'
            type="text"
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error-msg">{errors.name.message}</p>}

          <label>Email:</label>
          <input className='inp'
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
          <input className='inp'
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

          <label>Age:</label>
          <input className='inp'
            type="number"
            {...register('age', { 
              required: 'Age is required', 
              min: {
                value: 18,
                message: 'You must be at least 18 years old'
              }
            })}
            placeholder="Enter your age"
          />
          {errors.age && <p className="error-msg">{errors.age.message}</p>}
        </fieldset>

        <fieldset>
          <legend>Course Information</legend>
          <label>Course:</label>
          <select className='inp' {...register('course', { required: 'Course is required' })} onChange={handleChange}>
            <option value="">Select your course</option>
            <option value="BE">BE</option>
            <option value="BTech">BTech</option>
            <option value="Diploma">Diploma</option>
          </select>
          {errors.course && <p className="error-msg">{errors.course.message}</p>}

          <label>SubField:</label>
          <select className='inp' {...register('subfield', { required: 'SubField is required' })}>
            <option value="">Select your subfield</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Chemical">Chemical</option>
            <option value="Biomedical">Biomedical</option>
            <option value="Other">Other</option>
          </select>
          {errors.subfield && <p className="error-msg">{errors.subfield.message}</p>}

          <label>Year:</label>
          <select className='inp' {...register('year', { required: 'Year is required' })}>
            <option value="">Select your year</option>
            {formData.course === "Diploma" ? (
              <>
                <option value="FY">FY</option>
                <option value="SY">SY</option>
                <option value="TY">TY</option>
              </>
            ) : (
              <>
                <option value="FY">FY</option>
                <option value="SY">SY</option>
                <option value="TY">TY</option>
                <option value="LY">LY</option>
              </>
            )}
          </select>
          {errors.year && <p className="error-msg">{errors.year.message}</p>}

          <label>College:</label>
          <input className='inp'
            type="text"
            {...register('college', { required: 'College name is required' })}
            placeholder="Enter your college name"
          />
          {errors.college && <p className="error-msg">{errors.college.message}</p>}
        </fieldset>
      </form>
      <button type="button" className="register-button" onClick={handleCustomSubmit}>
        Register
      </button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;