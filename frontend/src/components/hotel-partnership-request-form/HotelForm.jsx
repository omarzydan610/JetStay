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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.managerEmail && !emailRegex.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.managerPassword && formData.managerPassword.length < 6) {
      newErrors.managerPassword = 'Password must be at least 6 characters long';
    }

    // Coordinate validation
    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
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
      
      // Prepare data for database
      const submissionData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        // In a real app, you would upload the file and get a URL
        hotelLogo: 'path/to/uploaded/logo.jpg'
      };

      console.log('Submitting hotel data:', submissionData);
      
      // Simulate successful submission
      setSubmitted(true);
      setFormData({
        hotelName: '',
        latitude: '',
        longitude: '',
        city: '',
        country: '',
        managerEmail: '',
        managerPassword: '',
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-green-800 text-xl font-bold mb-2">Submission Successful!</h3>
        <p className="text-green-700">
          Your hotel registration is waiting for acceptance from the system admin.
          You will be notified once it's approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Hotel</h2>
      
      <HotelFormFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        onLocationChange={handleLocationChange}
      />

      <div className="mt-6">
        <SubmitButton loading={loading}>
          Register Hotel
        </SubmitButton>
      </div>
    </form>
  );
};

export default HotelForm;
