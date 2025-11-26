import { useState } from "react";
import HotelFormFields from "./HotelFormFields";
import SubmitButton from "./SubmitButton";
import partnershipService from "../../../services/AuthServices/partnershipService";

// Helper function to normalize longitude to [-180, 180] range
const normalizeLongitude = (longitude) => {
  let normalizedLng = parseFloat(longitude);

  // Normalize longitude to be within [-180, 180]
  while (normalizedLng > 180) {
    normalizedLng -= 360;
  }
  while (normalizedLng < -180) {
    normalizedLng += 360;
  }

  return normalizedLng;
};

// Helper function to normalize latitude to [-90, 90] range
const normalizeLatitude = (latitude) => {
  let normalizedLat = parseFloat(latitude);

  // Ensure latitude stays within valid range
  if (normalizedLat > 90) normalizedLat = 90;
  if (normalizedLat < -90) normalizedLat = -90;

  return normalizedLat;
};

const HotelForm = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    latitude: "",
    longitude: "",
    city: "",
    country: "",
    adminFirstName: "",
    adminLastName: "",
    adminPhone: "",
    managerEmail: "",
    managerPassword: "",
    confirmPassword: "",
    hotelLogo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.hotelName.trim())
      newErrors.hotelName = "Hotel name is required";
    if (!formData.latitude) newErrors.latitude = "Latitude is required";
    if (!formData.longitude) newErrors.longitude = "Longitude is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
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
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        newErrors.managerPassword =
          "Password must contain both letters and numbers";
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

    // Coordinate validation - now accepting wider ranges since we'll normalize
    if (formData.latitude && isNaN(formData.latitude)) {
      newErrors.latitude = "Latitude must be a valid number";
    }
    if (formData.longitude && isNaN(formData.longitude)) {
      newErrors.longitude = "Longitude must be a valid number";
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

  const handleLocationChange = (lat, lng) => {
    // Normalize coordinates before storing
    const normalizedLat = normalizeLatitude(lat);
    const normalizedLng = normalizeLongitude(lng);

    setFormData((prev) => ({
      ...prev,
      latitude: normalizedLat.toString(),
      longitude: normalizedLng.toString(),
    }));

    // Clear coordinate errors
    setErrors((prev) => ({
      ...prev,
      latitude: "",
      longitude: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          hotelLogo: "Please upload a valid image file (JPEG, PNG, GIF)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          hotelLogo: "File size must be less than 5MB",
        }));
        return;
      }

      // Clear error if file is valid
      setErrors((prev) => ({
        ...prev,
        hotelLogo: "",
      }));

      // Store the file in formData
      setFormData((prev) => ({
        ...prev,
        hotelLogo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create FormData object for file upload
      const submissionFormData = new FormData();

      // Append all form fields
      submissionFormData.append("hotelName", formData.hotelName);
      submissionFormData.append(
        "latitude",
        normalizeLatitude(formData.latitude)
      );
      submissionFormData.append(
        "longitude",
        normalizeLongitude(formData.longitude)
      );
      submissionFormData.append("city", formData.city);
      submissionFormData.append("country", formData.country);
      submissionFormData.append("adminFirstName", formData.adminFirstName);
      submissionFormData.append("adminLastName", formData.adminLastName);
      submissionFormData.append("adminPhone", formData.adminPhone);
      submissionFormData.append("managerEmail", formData.managerEmail);
      submissionFormData.append("managerPassword", formData.managerPassword);

      // Append the logo file if it exists
      if (formData.hotelLogo) {
        submissionFormData.append("hotelLogo", formData.hotelLogo);
      }

      console.log("Submitting form with file:", formData.hotelLogo);

      // Submit to backend using the service
      await partnershipService.submitHotelPartnership(submissionFormData);

      console.log("Submission successful");

      // Show success message
      setSubmitted(true);

      // Reset form
      setFormData({
        hotelName: "",
        latitude: "",
        longitude: "",
        city: "",
        country: "",
        adminFirstName: "",
        adminLastName: "",
        adminPhone: "",
        managerEmail: "",
        managerPassword: "",
        confirmPassword: "",
        hotelLogo: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        error.message ||
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
          Your hotel registration is waiting for acceptance from the system
          admin. You will be notified once it's approved.
        </p>
      </div>
    );
  }

  if (submissionError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">⚠️</span>
        </div>
        <h3 className="text-red-800 text-2xl font-bold mb-4">
          Submission Failed
        </h3>
        <p className="text-red-700 text-lg mb-6">{submissionError}</p>
        <button
          onClick={() => setSubmissionError("")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <HotelFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        onLocationChange={handleLocationChange}
      />

      <div className="mt-8">
        <SubmitButton text="Register Hotel" isLoading={loading} />
      </div>
    </form>
  );
};

export default HotelForm;
