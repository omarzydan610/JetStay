import TextInput from "../new/AuthComponents/TextInput";
import EmailInput from "../new/AuthComponents/EmailInput";
import PasswordInput from "../new/AuthComponents/PasswordInput";
import FileUpload from "../new/PatnershipRequest/FileUpload";

const AirlineFormFields = ({
  formData,
  errors,
  handleChange,
  handleFileChange,
}) => {
  return (
    <div className="space-y-4">
      <TextInput
        label="Airline Name"
        name="airlineName"
        value={formData.airlineName}
        onChange={handleChange}
        error={errors.airlineName}
        placeholder="Enter airline name"
        touched={true}
      />

      <TextInput
        label="Airline Nationality"
        name="airlineNational"
        value={formData.airlineNational}
        onChange={handleChange}
        error={errors.airlineNational}
        placeholder="Enter airline nationality"
        touched={true}
      />

      <FileUpload
        label="Airline Logo"
        name="airlineLogo"
        onChange={handleFileChange}
        error={errors.airlineLogo}
        accept="image/jpeg,image/png,image/gif"
        fileName={formData.airlineLogo ? formData.airlineLogo.name : ""}
        touched={true}
        placeholder="Choose airline logo..."
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

export default AirlineFormFields;
