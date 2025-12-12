import React, { useState } from "react";
import AirlineFormFields from "./AirlineFormFields";
import SubmitButton from "./SubmitButton";
import partnershipService from "../../services/AuthServices/partnershipService";
import ErrorAlert from "../AuthComponents/ErrorAlert";

const AirlineForm = () => {
  const [formData, setFormData] = useState({
    airlineName: "",
    airlineNational: "",
    adminFirstName: "",
    adminLastName: "",
    adminPhone: "",
    managerEmail: "",
    managerPassword: "",
    confirmPassword: "",
    airlineLogo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.airlineName.trim())
      newErrors.airlineName = "Airline name is required";
    if (!formData.airlineNational.trim())
      newErrors.airlineNational = "Airline nationality is required";
    if (!formData.adminFirstName.trim())
      newErrors.adminFirstName = "Admin first name is required";
    if (!formData.adminLastName.trim())
      newErrors.adminLastName = "Admin last name is required";
    if (!formData.adminPhone.trim())
      newErrors.adminPhone = "Admin phone number is required";
    if (!formData.managerEmail.trim())
      newErrors.managerEmail = "Manager email is required";
    if (!formData.managerPassword)
      newErrors.managerPassword = "Manager password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.managerEmail && !emailRegex.test(formData.managerEmail)) {
      newErrors.managerEmail = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[+]?[1-9][\d\s\-()]{8,}$/;
    if (
      formData.adminPhone &&
      !phoneRegex.test(formData.adminPhone.replace(/\s/g, ""))
    ) {
      newErrors.adminPhone =
        "Phone number should start with +(country code) then a valid phone number";
    }

    // Name validation (only letters and spaces)
    const nameRegex = /^[a-zA-Z\s']+$/;
    if (formData.adminFirstName && !nameRegex.test(formData.adminFirstName)) {
      newErrors.adminFirstName =
        "First name can only contain letters and spaces";
    }
    if (formData.adminLastName && !nameRegex.test(formData.adminLastName)) {
      newErrors.adminLastName = "Last name can only contain letters and spaces";
    }

    // Password validation
    if (formData.managerPassword) {
      const password = formData.managerPassword;

      if (password.length < 8) {
        newErrors.managerPassword =
          "Password must be at least 8 characters long";
      }else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        newErrors.managerPassword =
          "Password must contain uppercase, lowercase letters and numbers";
      }
    }

    // Confirm password validation
    if (
      formData.managerPassword &&
      formData.confirmPassword &&
      formData.managerPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear confirm password error if passwords match
    if (
      (name === "managerPassword" || name === "confirmPassword") &&
      formData.managerPassword === formData.confirmPassword &&
      errors.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          airlineLogo: "Please upload a valid image file (JPEG, PNG, GIF)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          airlineLogo: "File size must be less than 5MB",
        }));
        return;
      }

      // Clear error if file is valid
      setErrors((prev) => ({
        ...prev,
        airlineLogo: "",
      }));

      // Store the file in formData
      setFormData((prev) => ({
        ...prev,
        airlineLogo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create FormData object for file upload
      const submissionFormData = new FormData();

      // Append all form fields
      submissionFormData.append("airlineName", formData.airlineName);
      submissionFormData.append("airlineNationality", formData.airlineNational);
      submissionFormData.append("adminFirstName", formData.adminFirstName);
      submissionFormData.append("adminLastName", formData.adminLastName);
      submissionFormData.append("adminPhone", formData.adminPhone);
      submissionFormData.append("managerEmail", formData.managerEmail);
      submissionFormData.append("managerPassword", formData.managerPassword);

      // Append the logo file if it exists
      if (formData.airlineLogo) {
        submissionFormData.append("airlineLogo", formData.airlineLogo);
      }

      // Submit to backend using the service
      await partnershipService.submitAirlinePartnership(submissionFormData);

      console.log("Submission successful");

      // Show success message
      setSubmitted(true);

      // Reset form
      setFormData({
        airlineName: "",
        airlineNational: "",
        adminFirstName: "",
        adminLastName: "",
        adminPhone: "",
        managerEmail: "",
        managerPassword: "",
        confirmPassword: "",
        airlineLogo: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error.response.data.message ||
          "Failed to submit partnership request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h3 className="text-green-800 text-2xl font-bold mb-4">
          Submission Successful!
        </h3>
        <p className="text-green-700 text-lg">
          Your airline registration is waiting for acceptance from the system
          admin. You will be notified once it's approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorAlert message={error} />

      <AirlineFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
      />

      <div className="mt-8">
        <SubmitButton text="Register Airline" isLoading={loading} />
      </div>
    </form>
  );
};

export default AirlineForm;
