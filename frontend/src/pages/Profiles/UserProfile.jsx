import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../contexts/AppContext";
import UserInfoSection from "../../components/ProfileComponents/UserInfoSection"; 
import UserEditModal from "../../components/ProfileComponents/UserEditModal"; 
import { updateUserInfo } from "../../services/profiles/userUpdateProfileService";
import { toast } from "react-toastify";

function UserProfile() {
  const { userData, updateUserData } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    if (sessionStorage.getItem("showUpdateToast")) {
      toast.success("Profile updated successfully!");
      sessionStorage.removeItem("showUpdateToast");
    }
  }, []);

  const handleSaveUser = async (formData) => {
    let data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      }
      console.log("Updating user with data:", data);
    try {
      const updatedUser = await updateUserInfo(data);

      updateUserData(updatedUser); 
      
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully!");
      sessionStorage.setItem("showUpdateToast", "true");
      window.location.reload();
      
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserInfoSection
          userData={userData}
          onEdit={() => setIsEditModalOpen(true)}
        />

        <UserEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={userData}
          onSave={handleSaveUser}
        />
      </motion.div>
    </main>
  );
}

export default UserProfile;