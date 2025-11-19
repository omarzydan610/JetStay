// HotelForm.jsx (Fixed)
import { useState } from 'react';
import HotelFormFields from './HotelFormFields';
import SubmitButton from '../partnership-request-form_common_components/SubmitButton';

const HotelForm = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    latitude: '',
    longitude: '',
    city: '',
    country: '',
    managerEmail: '',
    managerPassword: '',
    confirmPassword: '', // Added confirmPassword
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.hotelName.trim()) newErrors.hotelName = 'Hotel name is required';
    if (!formData.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude) newErrors.longitude = 'Longitude is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.managerEmail.trim()) newErrors.managerEmail = 'Manager email is required';
    if (!formData.managerPassword) newErrors.managerPassword = 'Manager password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.managerEmail && !emailRegex.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.managerPassword && formData.managerPassword.length < 6) {
      newErrors.managerPassword = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (formData.managerPassword && formData.confirmPassword && formData.managerPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Coordinate validation
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be a valid number between -90 and 90';
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be a valid number between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear confirm password error if passwords match
    if ((name === 'managerPassword' || name === 'confirmPassword') && 
        formData.managerPassword === formData.confirmPassword && 
        errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));

    // Clear coordinate errors
    setErrors(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          hotelLogo: 'Please upload a valid image file (JPEG, PNG, GIF)'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          hotelLogo: 'File size must be less than 5MB'
        }));
        return;
      }

      // Clear error if file is valid
      setErrors(prev => ({
        ...prev,
        hotelLogo: ''
      }));

      // Here you would handle the file upload or store it in formData
      console.log('Selected file:', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare data for database (exclude confirmPassword from submission)
      const { confirmPassword, ...submissionData } = formData;
      submissionData.latitude = parseFloat(formData.latitude);
      submissionData.longitude = parseFloat(formData.longitude);
      // In a real app, you would upload the file and get a URL
      submissionData.hotelLogo = 'path/to/uploaded/logo.jpg';

      console.log('Submitting hotel data:', submissionData);
      
      // Simulate successful submission
      setSubmitted(true);
      
      // Reset form data including confirmPassword
      setFormData({
        hotelName: '',
        latitude: '',
        longitude: '',
        city: '',
        country: '',
        managerEmail: '',
        managerPassword: '',
        confirmPassword: '',
      });

    } catch (error) {
      console.error('Error submitting form:', error);
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
        <h3 className="text-green-800 text-2xl font-bold mb-4">Submission Successful!</h3>
        <p className="text-green-700 text-lg">
          Your hotel registration is waiting for acceptance from the system admin.
          You will be notified once it's approved.
        </p>
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
        <SubmitButton loading={loading}>
          Register Hotel
        </SubmitButton>
      </div>
    </form>
  );
};

export default HotelForm;