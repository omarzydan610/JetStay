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
        accept="image/jpeg,image/png,image/gif"
        fileName={formData.airlineLogo ? formData.airlineLogo.name : ''}
      />

      {/* Admin Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Manager First Name"
          name="adminFirstName"
          value={formData.adminFirstName}
          onChange={handleChange}
          error={errors.adminFirstName}
          placeholder="Enter Manager first name"
          required
        />

        <FormInput
          label="Manager Last Name"
          name="adminLastName"
          value={formData.adminLastName}
          onChange={handleChange}
          error={errors.adminLastName}
          placeholder="Enter Manager last name"
          required
        />
      </div>

      <FormInput
        label="Manager Phone Number"
        name="adminPhone"
        type="tel"
        value={formData.adminPhone}
        onChange={handleChange}
        error={errors.adminPhone}
        placeholder="Enter Manager phone number"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
        />
      </div>
    </div>
  );
};

export default AirlineFormFields;