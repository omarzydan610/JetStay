import React from 'react';
import FormInput from '../partnership-request-form_common_components/FormInput';
import FileUpload from '../partnership-request-form_common_components/FileUpload';

const AirlineFormFields = ({ formData, errors, handleChange, handleFileChange }) => {
  return (
    <div className="space-y-4">
      <FormInput
        label="Airline Name"
        name="airlineName"
        value={formData.airlineName}
        onChange={handleChange}
        error={errors.airlineName}
        placeholder="Enter airline name"
        required
      />

      <FormInput
        label="Airline Nationality"
        name="airlineNational"
        value={formData.airlineNational}
        onChange={handleChange}
        error={errors.airlineNational}
        placeholder="Enter airline nationality"
        required
      />

      <FileUpload
        label="Airline Logo"
        name="airlineLogo"
        onChange={handleFileChange}
        error={errors.airlineLogo}
        required
      />

      <FormInput
        label="Manager Email"
        name="managerEmail"
        type="email"
        value={formData.managerEmail}
        onChange={handleChange}
        error={errors.managerEmail}
        placeholder="Enter manager email"
        required
      />

      <FormInput
        label="Manager Password"
        name="managerPassword"
        type="password"
        value={formData.managerPassword}
        onChange={handleChange}
        error={errors.managerPassword}
        placeholder="Enter manager password"
        required
      />
    </div>
  );
};

export default AirlineFormFields;