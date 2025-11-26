import TextInput from "../new/AuthComponents/TextInput";
import EmailInput from "../new/AuthComponents/EmailInput";
import PasswordInput from "../new/AuthComponents/PasswordInput";
import FileUpload from "../new/PatnershipRequest/FileUpload";
import LocationPicker from "../new/PatnershipRequest/LocationPicker";

const HotelFormFields = ({
  formData,
  errors,
  handleChange,
  handleFileChange,
  onLocationChange,
}) => {
  return (
    <div className="space-y-4">
      <TextInput
        label="Hotel Name"
        name="hotelName"
        value={formData.hotelName}
        onChange={handleChange}
        error={errors.hotelName}
        placeholder="Enter hotel name"
        touched={true}
      />

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Location Coordinates *
        </label>
        <LocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={onLocationChange}
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="Enter city"
          touched={true}
        />

        <TextInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
          placeholder="Enter country"
          touched={true}
        />
      </div>

      <FileUpload
        label="Hotel Logo"
        name="hotelLogo"
        onChange={handleFileChange}
        error={errors.hotelLogo}
        accept="image/jpeg,image/png,image/gif"
        fileName={formData.hotelLogo ? formData.hotelLogo.name : ""}
        touched={true}
        placeholder="Choose hotel logo..."
      />

      {/* Admin Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Manager First Name"
          name="adminFirstName"
          value={formData.adminFirstName}
          onChange={handleChange}
          error={errors.adminFirstName}
          placeholder="Enter Manager first name"
          touched={true}
        />

        <TextInput
          label="Manager Last Name"
          name="adminLastName"
          value={formData.adminLastName}
          onChange={handleChange}
          error={errors.adminLastName}
          placeholder="Enter Manager last name"
          touched={true}
        />
      </div>

      <TextInput
        label="Manager Phone Number"
        name="adminPhone"
        type="tel"
        value={formData.adminPhone}
        onChange={handleChange}
        error={errors.adminPhone}
        placeholder="Enter Manager phone number"
        touched={true}
      />

      <EmailInput
        value={formData.managerEmail}
        onChange={handleChange}
        error={errors.managerEmail}
        placeholder="Enter manager email"
        touched={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordInput
          name="managerPassword"
          value={formData.managerPassword}
          onChange={handleChange}
          error={errors.managerPassword}
          placeholder="Enter manager password"
          touched={true}
        />

        <PasswordInput
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          touched={true}
        />
      </div>
    </div>
  );
};

export default HotelFormFields;
