import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import roomsService from "../../../../services/HotelServices/roomsService";
import PrimaryButton from "../../PrimaryButton";

export default function CreateRoomForm({ onSuccess }) {
  const [form, setForm] = useState({
    roomTypeName: "",
    price: "",
    quantity: "",
    numberOfGuests: "",
    description: "",
  });

  // State for images
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.roomTypeName.trim()) {
      newErrors.roomTypeName = "Room type name is required";
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!form.quantity || parseInt(form.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!form.numberOfGuests || parseInt(form.numberOfGuests) <= 0) {
      newErrors.numberOfGuests = "Number of guests must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const roomData = {
        roomTypeName: form.roomTypeName,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        numberOfGuests: parseInt(form.numberOfGuests),
        description: form.description,
      };

      // 1. Create the Room first
      const createdRoomResponse = await roomsService.addRoom(roomData);

      // 2. Upload Images if any (requires the new room ID)
      // ملاحظة: نحتاج أن يعيد الباك إند كائن الغرفة المخلوقة للحصول على ID
      // سنفترض أن createdRoomResponse يحتوي على بيانات الغرفة الآن
      if (images.length > 0 && createdRoomResponse && createdRoomResponse.roomTypeID) {
        const roomTypeId = createdRoomResponse.roomTypeID;
        
        // Upload all images in parallel
        await Promise.all(
          images.map((image) => roomsService.uploadRoomImage(roomTypeId, image))
        );
      }

      toast.success("Room created and images uploaded successfully!");
      
      // Reset Form
      setForm({
        roomTypeName: "",
        price: "",
        quantity: "",
        numberOfGuests: "",
        description: "",
      });
      setImages([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating room:", err);
      toast.error("Failed to create room completely. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Type Name */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Room Type Name
        </label>
        <input
          type="text"
          name="roomTypeName"
          value={form.roomTypeName}
          onChange={handleInputChange}
          placeholder="e.g., Deluxe Suite, Standard Room"
          className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition ${
            errors.roomTypeName
              ? "border-red-500 focus:border-red-600"
              : "border-sky-200 focus:border-sky-600"
          }`}
        />
        {errors.roomTypeName && (
          <p className="text-red-600 text-sm mt-1">{errors.roomTypeName}</p>
        )}
      </motion.div>

      {/* Price and Quantity Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price per Night
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition ${
              errors.price
                ? "border-red-500 focus:border-red-600"
                : "border-sky-200 focus:border-sky-600"
            }`}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price}</p>
          )}
        </motion.div>

        {/* Quantity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Available Rooms
          </label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleInputChange}
            placeholder="0"
            className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition ${
              errors.quantity
                ? "border-red-500 focus:border-red-600"
                : "border-sky-200 focus:border-sky-600"
            }`}
          />
          {errors.quantity && (
            <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
          )}
        </motion.div>
      </div>

      {/* Number of Guests */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Maximum Guests
        </label>
        <input
          type="number"
          name="numberOfGuests"
          value={form.numberOfGuests}
          onChange={handleInputChange}
          placeholder="0"
          className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition ${
            errors.numberOfGuests
              ? "border-red-500 focus:border-red-600"
              : "border-sky-200 focus:border-sky-600"
          }`}
        />
        {errors.numberOfGuests && (
          <p className="text-red-600 text-sm mt-1">{errors.numberOfGuests}</p>
        )}
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Add room amenities and details..."
          rows="4"
          className="w-full px-4 py-2 rounded-lg border-2 border-sky-200 focus:border-sky-600 focus:outline-none transition"
        />
      </motion.div>

      {/* Image Upload Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.32 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Room Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 text-gray-600 focus:outline-none focus:border-sky-600 cursor-pointer"
        />
        {images.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            {images.length} image(s) selected
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex gap-3"
      >
        <PrimaryButton
          label={loading ? "Creating & Uploading..." : "✓ Create Room"}
          type="submit"
          disabled={loading}
        />
      </motion.div>
    </form>
  );
}