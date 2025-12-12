import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../../services/AuthServices/authService";
import GoogleLoginButton from "../../components/AuthComponents/GoogleLogin";
import AuthLayout from "../../components/AuthComponents/AuthLayout";
import FormHeader from "../../components/AuthComponents/FormHeader";
import SuccessAlert from "../../components/AuthComponents/SuccessAlert";
import ErrorAlert from "../../components/AuthComponents/ErrorAlert";
import TextInput from "../../components/AuthComponents/TextInput";
import EmailInput from "../../components/AuthComponents/EmailInput";
import PhoneInput from "../../components/AuthComponents/PhoneInput";
import PasswordInput from "../../components/AuthComponents/PasswordInput";
import SubmitButton from "../../components/AuthComponents/SubmitButton";
import DecorativeSidePanel from "../../components/AuthComponents/DecorativeSidePanel";
import {
  PlaneIcon,
  LocationIcon,
} from "../../components/AuthComponents/AnimatedIcons";
import PhoneIcon from "../../Icons/PhoneIcon";
import EmailIcon from "../../Icons/EmailIcon";
import PassIcon from "../../Icons/PassIcon";
import InputIcon from "../../Icons/inputIcon";
import Showpass from "../../Icons/Showpass";
import Hidepass from "../../Icons/Hidepass";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateMode = location.state?.mode;
  const initialMode = stateMode === "signup" ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+20",
    phoneNumber: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupTouched, setSignupTouched] = useState({});
  const [signupSuccess, setSignupSuccess] = useState("");
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Login validation
  const validateLoginField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    if (loginTouched[name]) {
      const error = validateLoginField(name, value);
      setLoginErrors({ ...loginErrors, [name]: error });
    }
  };

  const handleLoginBlur = (e) => {
    const { name, value } = e.target;
    setLoginTouched({ ...loginTouched, [name]: true });
    const error = validateLoginField(name, value);
    setLoginErrors({ ...loginErrors, [name]: error });
  };

  const validateLoginAll = () => {
    const newErrors = {};
    const emailError = validateLoginField("email", loginForm.email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validateLoginField("password", loginForm.password);
    if (passwordError) newErrors.password = passwordError;
    setLoginErrors(newErrors);
    setLoginTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (!validateLoginAll()) return;
    setIsLoginLoading(true);
    try {
      const response = await authService.login(loginForm);
      console.log("Login successful:", response);

      if (authService.isAuthenticated()) {
        navigate("/");
        console.log("User authenticated successfully");
      }
    } catch (error) {
      console.error("Login error:", error, loginForm);

      switch (error.code) {
        case "UNAUTHORIZED":
          // Check if the error is about deactivated account
          if (
            error.message &&
            error.message.toLowerCase().includes("deactivated")
          ) {
            setLoginErrors({
              general:
                error.message ||
                "Your account has been deactivated. Please contact support.",
            });
          } else {
            setLoginErrors({
              general: "Invalid credentials. Please try again.",
            });
          }
          break;
        case "FORBIDDEN":
          setLoginErrors({
            general: "Your account has been blocked. Please contact support.",
          });
          break;
        case "NETWORK_ERROR":
          setLoginErrors({
            general: "Network error. Please check your connection.",
          });
          break;
        default:
          setLoginErrors({
            general: error.message || "Login failed. Please try again.",
          });
      }
    }
    setIsLoginLoading(false);
  };

  // Signup validation
  const validateSignupField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 3 || value.length > 20)
          error = "First name must be 3-20 characters";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          error = "First name should contain only letters";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 3 || value.length > 20)
          error = "Last name must be 3-20 characters";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          error = "Last name should contain only letters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          error = "Password must contain uppercase, lowercase, and number";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== signupForm.password)
          error = "Passwords do not match";
        break;
      case "countryCode":
        if (!value.trim()) error = "Country code is required";
        else if (!/^\+[0-9]{1,4}$/.test(value))
          error = "Please enter a valid country code (e.g., +20)";
        break;
      case "phoneNumber":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(value)) error = "Phone must be 10 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
    if (signupTouched[name]) {
      const error = validateSignupField(name, value);
      setSignupErrors({ ...signupErrors, [name]: error });
    }
    if (name === "password" && signupTouched.confirmPassword) {
      const confirmError =
        signupForm.confirmPassword !== value ? "Passwords do not match" : "";
      setSignupErrors({ ...signupErrors, confirmPassword: confirmError });
    }
  };

  const handleSignupBlur = (e) => {
    const { name, value } = e.target;
    setSignupTouched({ ...signupTouched, [name]: true });
    const error = validateSignupField(name, value);
    setSignupErrors({ ...signupErrors, [name]: error });
  };

  const validateSignupAll = () => {
    const newErrors = {};
    Object.keys(signupForm).forEach((key) => {
      const error = validateSignupField(key, signupForm[key]);
      if (error) newErrors[key] = error;
    });
    setSignupErrors(newErrors);
    setSignupTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      countryCode: true,
      phoneNumber: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async () => {
    if (!validateSignupAll()) return;

    const newAccount = {
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      password: signupForm.password,
      phoneNumber: signupForm.countryCode + signupForm.phoneNumber,
    };

    setIsSignupLoading(true);
    setSignupErrors({});
    setSignupSuccess("");

    try {
      const response = await authService.signup(newAccount);

      if (response.success) {
        setSignupSuccess("Account created successfully!");
        console.log("Signup successful:", response);

        // Show success message for 0.5 seconds, then switch to login
        setTimeout(() => {
          setIsLogin(true);
          setSignupSuccess("");
          // Reset signup form
          setSignupForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            countryCode: "+20",
            phoneNumber: "",
          });
          setSignupErrors({});
          setSignupTouched({});
        }, 500);
      }
    } catch (error) {
      console.error("Signup error:", error, newAccount);
      setSignupSuccess("");

      switch (error.code) {
        case "VALIDATION_ERROR":
          if (error.errors) {
            const fieldErrors = {};
            error.errors.forEach((err) => {
              fieldErrors[err.field] = err.message;
            });
            setSignupErrors(fieldErrors);
          } else {
            setSignupErrors({ general: error.message });
          }
          break;

        case "SERVER_ERROR":
        case "UNAUTHORIZED":
        case "FORBIDDEN":
        case "NETWORK_ERROR":
        default:
          setSignupErrors({
            general: error.message || "Registration failed. Please try again.",
          });
      }
    } finally {
      setIsSignupLoading(false);
    }
  };

  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.div
              key="login-view"
              initial={{
                x: "0%",
                opacity: 0,
                scale: 0.95,
                rotateY: 15,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                rotateY: 0,
              }}
              exit={{
                x: "0%",
                opacity: 0,
                scale: 0.95,
                rotateY: 15,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 },
                scale: {
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                },
              }}
              style={{
                boxShadow: "0 20px 60px -10px rgba(8, 145, 178, 0.3)",
              }}
              className="grid md:grid-cols-2 gap-0"
            >
              <DecorativeSidePanel
                icon={
                  <PlaneIcon
                    animation={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                }
                title="Welcome Back"
                description="Continue your journey with personalized travel experiences"
                pattern="grid"
              />

              <div className="p-8 flex items-center min-h-[550px]">
                <div className="w-full">
                  <FormHeader text="Log In" />

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLoginSubmit();
                    }}
                    className="space-y-3"
                  >
                    <EmailInput
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      onBlur={handleLoginBlur}
                      error={loginErrors.email}
                      touched={loginTouched.email}
                      icon={EmailIcon}
                      placeholder="you@example.com"
                    />

                    <PasswordInput
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onBlur={handleLoginBlur}
                      error={loginErrors.password}
                      touched={loginTouched.password}
                      icon={PassIcon}
                      showIcon={Showpass}
                      hideIcon={Hidepass}
                    />

                    <div className="flex items-center justify-end">
                      <a
                        href="/forgot-password"
                        className="text-sky-600 text-sm font-medium hover:underline focus:outline-none focus:underline transition-colors"
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <ErrorAlert message={loginErrors.general} />

                    <SubmitButton
                      onClick={handleLoginSubmit}
                      isLoading={isLoginLoading}
                      text="Log In"
                      loadingText="Logging in..."
                    />

                    <GoogleLoginButton />

                    <div className="mt-3 space-y-2 text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          onClick={() => setIsLogin(false)}
                          className="text-sky-600 font-medium hover:underline focus:outline-none focus:underline"
                          type="button"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup-view"
              initial={{
                x: "0%",
                opacity: 0,
                scale: 0.95,
                rotateY: -15,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                rotateY: 0,
              }}
              exit={{
                x: "0%",
                opacity: 0,
                scale: 0.95,
                rotateY: -15,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 },
                scale: {
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                },
              }}
              style={{
                boxShadow: "0 20px 60px -10px rgba(8, 145, 178, 0.3)",
              }}
              className="grid md:grid-cols-2 gap-0"
            >
              <div className="p-8 flex items-center min-h-[650px] order-2 md:order-1">
                <div className="w-full">
                  <FormHeader text="Create Account" />

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSignupSubmit();
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        name="firstName"
                        value={signupForm.firstName}
                        onChange={handleSignupChange}
                        onBlur={handleSignupBlur}
                        error={signupErrors.firstName}
                        touched={signupTouched.firstName}
                        label="First Name"
                        placeholder="First name"
                        icon={InputIcon}
                      />
                      <TextInput
                        name="lastName"
                        value={signupForm.lastName}
                        onChange={handleSignupChange}
                        onBlur={handleSignupBlur}
                        error={signupErrors.lastName}
                        touched={signupTouched.lastName}
                        label="Last Name"
                        placeholder="Last name"
                        icon={InputIcon}
                      />
                    </div>

                    <EmailInput
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      onBlur={handleSignupBlur}
                      error={signupErrors.email}
                      touched={signupTouched.email}
                      icon={EmailIcon}
                      placeholder="you@example.com"
                    />

                    <PhoneInput
                      name="phoneNumber"
                      value={signupForm.phoneNumber}
                      onChange={handleSignupChange}
                      onBlur={handleSignupBlur}
                      error={signupErrors.phoneNumber}
                      touched={signupTouched.phoneNumber}
                      countryCodeName="countryCode"
                      countryCodeValue={signupForm.countryCode}
                      countryCodeOnChange={handleSignupChange}
                      countryCodeOnBlur={handleSignupBlur}
                      countryCodeError={signupErrors.countryCode}
                      countryCodeTouched={signupTouched.countryCode}
                      icon={PhoneIcon}
                    />

                    <PasswordInput
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      onBlur={handleSignupBlur}
                      error={signupErrors.password}
                      touched={signupTouched.password}
                      icon={PassIcon}
                      showIcon={Showpass}
                      hideIcon={Hidepass}
                      placeholder="Create a strong password"
                    />

                    <PasswordInput
                      name="confirmPassword"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      onBlur={handleSignupBlur}
                      error={signupErrors.confirmPassword}
                      touched={signupTouched.confirmPassword}
                      icon={PassIcon}
                      showIcon={Showpass}
                      hideIcon={Hidepass}
                      placeholder="Confirm your password"
                      label="Confirm Password"
                    />

                    <SuccessAlert message={signupSuccess} />
                    <ErrorAlert message={signupErrors.general} />

                    <SubmitButton
                      onClick={handleSignupSubmit}
                      isLoading={isSignupLoading}
                      loadingText="Creating account..."
                      text="Create Account"
                    />

                    <GoogleLoginButton />

                    <div className="mt-3 space-y-2 text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          onClick={() => setIsLogin(true)}
                          className="text-sky-600 font-medium hover:underline focus:outline-none focus:underline"
                          type="button"
                        >
                          Log in
                        </button>
                      </p>
                      <div className="pt-1 border-t border-gray-200">
                        <a
                          href="/partnership-request"
                          className="text-xs text-sky-600 hover:underline inline-block focus:outline-none focus:underline"
                        >
                          Sign up as airline or hotel administrator →
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <DecorativeSidePanel
                  icon={
                    <LocationIcon
                      animation={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  }
                  title="Join JetStay"
                  description="Start your travel journey with the best deals and experiences"
                  pattern="dots"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      formContent={formContent}
      maxWidth="max-w-5xl"
      showLogoSection={false}
    />
  );
}

export default AuthPage;
