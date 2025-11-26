import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../../contexts/AppContext";
import AdminInfoSection from "../../../components/new/ProfileComponents/AdminInfoSection";
import HotelBusinessInfoSection from "../../../components/new/ProfileComponents/HotelBusinessInfoSection";
import HotelEditModal from "../../../components/new/ProfileComponents/HotelEditModal";
import AdminEditModal from "../../../components/new/ProfileComponents/AdminEditModal";
import { updateHotelData } from "../../../services/profiles/hotelProfileService";

function HotelProfile() {
  const { userData, businessData, updateBusinessData} =
    useAppContext();
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [businessModalError, setBusinessModalError] = useState(null);
  const [adminModalError, setAdminModalError] = useState(null);

  const handleEditBusiness = () => {
    setIsEditingBusiness(true);
  };

  const handleEditAdmin = () => {
    setIsEditingAdmin(true);
  };

  const handleSaveBusiness = async (formData) => {
    try {
      setBusinessModalError(null);
      const response = await updateHotelData({
        name: formData.name,
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude,
        logoUrl: formData.logoUrl,
      });
      updateBusinessData(response);
      window.location.reload();
    } catch (error) {
      console.error("Error updating business data:", error);
      setBusinessModalError(
        "Failed to update hotel information. Please try again."
      );
      throw error;
    }
  };

  const handleSaveAdmin = async (formData) => {
    // try {
    //   setAdminModalError(null);
    //   const response = await updateAdminData({
    //     firstName: formData.firstName,
    //     lastName: formData.lastName,
    //     email: formData.email,
    //     phoneNumber: formData.phoneNumber,
    //   });
    //   updateUserData(response);
    //   window.location.reload();
    // } catch (error) {
    //   console.error("Error updating admin data:", error);
    //   setAdminModalError("Failed to update admin information. Please try again.");
    //   throw error;
    // }
    alert("not implemented yet");
  };

  const handleCloseBusinessModal = () => {
    setIsEditingBusiness(false);
    setBusinessModalError(null);
  };

  const handleCloseAdminModal = () => {
    setIsEditingAdmin(false);
    setAdminModalError(null);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Business Information Section */}
        <HotelBusinessInfoSection
          businessData={businessData}
          onEdit={handleEditBusiness}
          isEditing={isEditingBusiness}
        />

        {/* Admin Information Section */}
        <AdminInfoSection
          userData={userData}
          onEdit={handleEditAdmin}
          isEditing={isEditingAdmin}
        />

        {/* Edit Modals */}
        <HotelEditModal
          isOpen={isEditingBusiness}
          onClose={handleCloseBusinessModal}
          businessData={businessData}
          onSave={handleSaveBusiness}
          error={businessModalError}
        />

        <AdminEditModal
          isOpen={isEditingAdmin}
          onClose={handleCloseAdminModal}
          userData={userData}
          onSave={handleSaveAdmin}
          error={adminModalError}
        />
      </motion.div>
    </main>
  );
}

export default HotelProfile;
