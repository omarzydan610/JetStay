import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import Plane from '../Icons/Plane';
import EmailIcon from '../Icons/EmailIcon';
import PassIcon from '../Icons/PassIcon';
import GoogleIcon from '../Icons/GoogleIcon';
import Showpass from '../Icons/Showpass';
import Hidepass from '../Icons/Hidepass';
import './Login.css';

function Login() {
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateAll = () => {
    const newErrors = {};

    const emailError = validateField('email', form.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField('password', form.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsLoading(true);

    try {

      const res = await axios.post('http://localhost:8080/api/login', form);
      console.log(res)
      // const role = res.data.role;

    } catch (err) {
      setErrors({ general: 'Invalid email or password' });
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
  };

  return (
    <div className="login-container">
      {/* Right Side - Form */}
      <div className="form-section">
        <div className="login-wrapper">
          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-header">
              <div className="logo-circle">
                <Plane />
              </div>
              <h1 className="brand-title">JetStay</h1>
            </div>
            <p className="brand-subtitle">Welcome back! Sign in to continue</p>
          </div>

          {/* Form Card */}
          <div className="form-card">
            {errors.general && <div className="alert alert-error">{errors.general}</div>}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <EmailIcon />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.email && errors.email ? 'input-error' : ''}`}
                  placeholder="youremail@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <PassIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.password && errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <Showpass /> : <Hidepass />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Login As</label>
              <div className="role-selector">
                <label className={`role-option ${form.role === 'user' ? 'role-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === 'user'}
                    onChange={handleChange}
                  />
                  <span>User</span>
                </label>
                <label className={`role-option ${form.role === 'flight_admin' ? 'role-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="flight_admin"
                    checked={form.role === 'flight_admin'}
                    onChange={handleChange}
                  />
                  <span>Flight Admin</span>
                </label>
                <label className={`role-option ${form.role === 'hotel_admin' ? 'role-active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="hotel_admin"
                    checked={form.role === 'hotel_admin'}
                    onChange={handleChange}
                  />
                  <span>Hotel Admin</span>
                </label>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-button"
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="footer-link">
              Don't have an account? <a href="/">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;