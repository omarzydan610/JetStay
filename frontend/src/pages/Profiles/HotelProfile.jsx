import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../contexts/AppContext";
import AdminInfoSection from "../../components/ProfileComponents/AdminInfoSection";
import HotelBusinessInfoSection from "../../components/ProfileComponents/HotelBusinessInfoSection";
import HotelEditModal from "../../components/ProfileComponents/HotelEditModal";
import AdminEditModal from "../../components/ProfileComponents/AdminEditModal";
import { updateHotelData } from "../../services/profiles/hotelProfileService";
import hotelImageService from "../../services/HotelServices/HotelImageService";
import ConfirmationModal from "../../components/ConfirmationModal";

function HotelProfile() {
  const { userData, businessData, updateBusinessData } = useAppContext();
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [businessModalError, setBusinessModalError] = useState(null);
  const [adminModalError, setAdminModalError] = useState(null);
  const [hotelImages, setHotelImages] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    if (businessData) { 
        console.log(">>> Data is ready, fetching images now...");
        fetchImages();
    }
  }, [businessData])

  const fetchImages = async (hotelId) => {
    try {
      const images = await hotelImageService.getHotelImages(hotelId);
      setHotelImages(images);
    } catch (error) {
      console.error("Error fetching hotel images:", error);
    }
  };

  const handleAddImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const newImage = await hotelImageService.uploadHotelImage(formData);
      setHotelImages((prev) => [...prev, newImage]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

const handleDeleteClick = (imageId) => {
    setImageToDelete(imageId); 
    setIsDeleteModalOpen(true);
  };
const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      await hotelImageService.deleteHotelImage(imageToDelete);
      
      setHotelImages((prev) => prev.filter((img) => img.imageID !== imageToDelete));
      
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
      setIsDeleteModalOpen(false);
    }
  };

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
        <HotelBusinessInfoSection
          businessData={businessData}
          onEdit={handleEditBusiness}
          isEditing={isEditingBusiness}
          hotelImages={hotelImages}
          onAddImage={handleAddImage}
          onDeleteImage={handleDeleteClick}
        />

        <AdminInfoSection
          userData={userData}
          onEdit={handleEditAdmin}
          isEditing={isEditingAdmin}
        />

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

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteImage}
          title="Delete Image"
          message="Are you sure you want to delete this image? This action cannot be undone."
        />
      </motion.div>
    </main>
  );
}

export default HotelProfile;