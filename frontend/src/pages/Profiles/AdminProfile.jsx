import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../contexts/AppContext";
import AdminInfoSection from "../../components/ProfileComponents/AdminInfoSection";
import AdminEditModal from "../../components/ProfileComponents/AdminEditModal";
import { updateUserInfo } from "../../services/profiles/userUpdateProfileService";
import { toast } from "react-toastify";

function AdminProfile() {
  const { userData, updateUserData } = useAppContext();
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminModalError, setAdminModalError] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("showUpdateToast")) {
      toast.success("Profile updated successfully!");
      sessionStorage.removeItem("showUpdateToast");
    }
  }, []);

  const handleEditAdmin = () => {
    setIsEditingAdmin(true);
  };

  const handleSaveAdmin = async (formData) => {
    let data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
    };
    console.log("Updating user with data:", data);
    try {
      setAdminModalError(null);
      const updatedUser = await updateUserInfo(data);

      updateUserData(updatedUser);

      setIsEditingAdmin(false);
      toast.success("Profile updated successfully!");
      sessionStorage.setItem("showUpdateToast", "true");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile", error);
      setAdminModalError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
    }
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
        {/* Admin Information Section */}
        <AdminInfoSection
          userData={userData}
          onEdit={handleEditAdmin}
          isEditing={isEditingAdmin}
        />

        {/* Edit Modal */}
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

export default AdminProfile;
