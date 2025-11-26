import React, { useState } from 'react';
import authService from '../services/authService';
import PhoneIcon from '../Icons/PhoneIcon';
import EmailIcon from '../Icons/EmailIcon';
import PassIcon from '../Icons/PassIcon';
import InputIcon from '../Icons/inputIcon';
import Showpass from '../Icons/Showpass';
import Hidepass from '../Icons/Hidepass';
import JetStayIcon from '../Icons/JetStayIcon';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLogin';

function SignUp() {
  const navigate = useNavigate();
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
        if (!value.trim()) error = 'First name is required';
        else if (value.length < 3 || value.length > 20) error = 'First name must be 3-20 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'First name should contain only letters';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        else if (value.length < 3 || value.length > 20) error = 'Last name must be 3-20 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Last name should contain only letters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) error = 'Password must contain uppercase, lowercase, and number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== form.password) error = 'Passwords do not match';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Phone must be 10 digits';
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
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true, phoneNumber: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    const newAccount = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phoneNumber: '+20' + form.phoneNumber
    };

    setIsLoading(true);

    try {
      const response = await authService.signup(newAccount);

      if (response.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        console.log("Signup successful:", response);

        navigate("/login");
      }

    } catch (error) {
      console.error("Signup error:", error, newAccount);

      // Handle known errors
      switch (error.code) {
        case "VALIDATION_ERROR":
          if (error.errors) {
            const fieldErrors = {};
            error.errors.forEach(err => {
              fieldErrors[err.field] = err.message;
            });
            setErrors(fieldErrors);
          } else {
            setErrors({ general: error.message });
          }
          break;

        case "SERVER_ERROR":
        case "UNAUTHORIZED":
        case "FORBIDDEN":
        case "NETWORK_ERROR":
        default:
          setErrors({
            general: error.message || "Registration failed. Please try again."
          });
      }
    }

    setIsLoading(false);
  };


  const inputBase = "w-full py-3 pl-11 pr-12 border-2 rounded-xl text-base outline-none transition-all duration-200";
  const inputNormal = "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";
  const inputError = "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="min-h-screen flex">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
        <JetStayIcon />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Brand Section */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-base">Create your account to start your journey</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {success && (
              <div className="p-3 rounded-xl text-sm mb-5 bg-green-50 text-green-700 border border-green-300">
                {success}
              </div>
            )}
            {errors.general && (
              <div className="p-3 rounded-xl text-sm mb-5 bg-red-50 text-red-600 border border-red-300">
                {errors.general}
              </div>
            )}

            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 w-5 h-5 text-gray-400 z-10"><InputIcon /></span>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputBase} ${touched.firstName && errors.firstName ? inputError : inputNormal}`}
                    placeholder="First name"
                  />
                </div>
                {touched.firstName && errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 w-5 h-5 text-gray-400 z-10"><InputIcon /></span>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputBase} ${touched.lastName && errors.lastName ? inputError : inputNormal}`}
                    placeholder="Last name"
                  />
                </div>
                {touched.lastName && errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 w-5 h-5 text-gray-400 z-10"><EmailIcon /></span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${touched.email && errors.email ? inputError : inputNormal}`}
                  placeholder="youremail@example.com"
                />
              </div>
              {touched.email && errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="flex gap-3">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 min-w-[90px]">
                  <span className="w-5 h-5 text-gray-400"><PhoneIcon /></span>
                  <span>+20</span>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`flex-1 py-3 px-4 border-2 rounded-xl text-base outline-none transition-all duration-200 ${touched.phoneNumber && errors.phoneNumber ? inputError : inputNormal}`}
                  placeholder="1234567890"
                  maxLength="10"
                />
              </div>
              {touched.phoneNumber && errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 w-5 h-5 text-gray-400 z-10"><PassIcon /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${touched.password && errors.password ? inputError : inputNormal}`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <Showpass className="w-5 h-5" />
                  ) : (
                    <Hidepass className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 w-5 h-5 text-gray-400 z-10"><PassIcon /></span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputBase} ${touched.confirmPassword && errors.confirmPassword ? inputError : inputNormal}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <Showpass className="w-5 h-5" />
                  ) : (
                    <Hidepass className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base py-3.5 rounded-xl cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/30 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative text-center my-5">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
              <span className="relative bg-white px-4 text-gray-500 text-sm">Or continue with</span>
            </div>

            {/* Google Sign Up */}
            <GoogleLoginButton />

            {/* Login Link */}
            <div className="text-center text-gray-500 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;