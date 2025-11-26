import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import authService from '../services/authService';
import EmailIcon from '../Icons/EmailIcon';
import PassIcon from '../Icons/PassIcon';
import Showpass from '../Icons/Showpass';
import Hidepass from '../Icons/Hidepass';
import Plane from '../Icons/Plane';
import GoogleLoginButton from '../components/GoogleLogin';

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
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
      const response = await authService.login(form);
      console.log('Login successful:', response);

      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        navigate("/");
        console.log('User authenticated successfully');
      }

    } catch (error) {
      console.error('Login error:', error, form);

      switch (error.code) {
        case 'UNAUTHORIZED':
          setErrors({ general: 'Invalid credentials. Please try again.' });
          break;
        case 'FORBIDDEN':
          setErrors({ general: 'Your account has been blocked. Please contact support.' });
          break;
        case 'NETWORK_ERROR':
          setErrors({ general: 'Network error. Please check your connection.' });
          break;
        default:
          setErrors({ general: error.message || 'Login failed. Please try again.' });
      }
    }
    setIsLoading(false);
  };

  const inputBase = "w-full py-3 pl-11 pr-12 border-2 rounded-xl text-base outline-none transition-all duration-200";
  const inputNormal = "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";
  const inputError = "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Brand Section */}
          <div className="text-center mb-[30px]">
            <div className="flex items-center justify-center gap-3 mb-[10px]">
              <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
                <Plane />
              </div>
              <h1 className="text-[32px] font-bold text-gray-900">JetStay</h1>
            </div>
            <p className="text-gray-500 text-[15px]">Welcome back! Sign in to continue</p>
          </div>
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {errors.general && (
              <div className="p-3 rounded-xl text-sm mb-5 bg-red-50 text-red-600 border border-red-300">
                {errors.general}
              </div>
            )}

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
                  placeholder="your.email@example.com"
                />
              </div>
              {touched.email && errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
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
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <div className="text-right mb-5">
              <a href="/forgot-password" className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base py-3.5 rounded-xl cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/30 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative text-center my-5">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
              <span className="relative bg-white px-4 text-gray-500 text-sm">Or continue with</span>
            </div>

            {/* Google Login */}
            <GoogleLoginButton  />

            {/* Sign Up Link */}
            <div className="text-center text-gray-500 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;