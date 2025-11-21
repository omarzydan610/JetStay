import React, { useState } from 'react';
import axios from "axios";
import PhoneIcon from '../Icons/PhoneIcon';
import EmailIcon from '../Icons/EmailIcon';
import PassIcon from '../Icons/PassIcon';
import InputIcon from '../Icons/inputIcon';
import GoogleIcon from '../Icons/GoogleIcon';
import Showpass from '../Icons/Showpass';
import Hidepass from '../Icons/Hidepass';
import JetStayIcon from '../Icons/JetStayIcon'
import './SignUp.css';

function SignUp() {

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (value.length < 3 || value.length > 20) {
          error = 'First name must be 3-20 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'First name should contain only letters';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (value.length < 3 || value.length > 20) {
          error = 'Last name must be 3-20 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Last name should contain only letters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain uppercase, lowercase, and number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== form.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = 'Phone must be 10 digits';
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

    if (name === 'password' && touched.confirmPassword) {
      const confirmError = form.confirmPassword !== value ? 'Passwords do not match' : '';
      setErrors({ ...errors, confirmPassword: confirmError });
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
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phoneNumber: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {


    if (!validateAll()) return;

    const newacc = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phoneNumber: '+20' + form.phoneNumber
    }


    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/api/signup', newacc);
      setSuccess('Account created successfully! Redirecting to login...');
      console.log(newacc);
    }
    catch (error) {
      console.log(newacc);
      console.log(error)
      setErrors({ general: "Try again" })
    }

    setIsLoading(false);

  };

  const handleGoogleSignUp = () => {
    console.log('Google Sign Up clicked');
  };

  return (
    <div className="signup-container">
      <div className="logo-section">
        <JetStayIcon />
      </div>
      <div className="form-section">
        <div className="signup-wrapper">

          {/* Brand Section */}
          <div className="brand-section">
            <p className="brand-subtitle">Create your account to start your journey</p>
          </div>
          {/* Form Card */}
          <div className="form-card">
            {success && <div className="alert alert-success">{success}</div>}
            {errors.general && <div className="alert alert-error">{errors.general}</div>}

            {/* Name Fields Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrapper">
                  <InputIcon />
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.firstName && errors.firstName ? 'input-error' : ''}`}
                    placeholder="First name"
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="error-message">{errors.firstName}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <InputIcon />
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.lastName && errors.lastName ? 'input-error' : ''}`}
                    placeholder="Last name"
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="error-message">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  placeholder="your.email@example.com"
                />
              </div>
              {touched.email && errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="phone-input-group">
                <div className="phone-prefix">
                  <PhoneIcon />
                  <span>+20</span>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input phone-input ${touched.phoneNumber && errors.phoneNumber ? 'input-error' : ''}`}
                  placeholder="1234567890"
                  maxLength="10"
                />
              </div>
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="error-message">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <PassIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.password && errors.password ? 'input-error' : ''}`}
                  placeholder="Create a strong password"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <PassIcon />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <Showpass /> : <Hidepass />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="google-button"
            >
              <GoogleIcon />
              Sign up with Google
            </button>

            {/* Login Link */}
            <div className="footer-link">
              Already have an account? <a href="/login">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;