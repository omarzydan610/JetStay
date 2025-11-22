import FormInput from '../partnership-request-form_common_components/FormInput';
import LocationPicker from '../partnership-request-form_common_components/LocationPicker';
import FileUpload from '../partnership-request-form_common_components/FileUpload';

const HotelFormFields = ({ formData, errors, handleChange, handleFileChange, onLocationChange }) => {
  return (
    <div className="space-y-4">
      <FormInput
        label="Hotel Name"
        name="hotelName"
        value={formData.hotelName}
        onChange={handleChange}
        error={errors.hotelName}
        placeholder="Enter hotel name"
        required
      />

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Location Coordinates *
        </label>
        <LocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={onLocationChange}
        />
        {(errors.latitude || errors.longitude) && (
          <div className="text-red-500 text-xs mt-1">
            {errors.latitude || errors.longitude}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="Enter city"
          required
        />

        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
          placeholder="Enter country"
          required
        />
      </div>

      <FileUpload
        label={
          <span>
            Hotel Logo <span className="text-gray-500 text-sm font-normal">(optional)</span>
          </span>
        }
        name="hotelLogo"
        onChange={handleFileChange}
        error={errors.hotelLogo}
      />

      {/* New Admin Fields */}
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
          label="ManagerLast Name"
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

export default HotelFormFields;