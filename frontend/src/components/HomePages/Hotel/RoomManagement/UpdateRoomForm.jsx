import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import hotelDataService from "../../../../services/HotelServices/roomsService";

export default function UpdateRoomForm({ room, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    roomTypeName: room.roomTypeName || "",
    price: room.price || "",
    quantity: room.quantity || "",
    numberOfGuests: room.numberOfGuests || "",
    description: room.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomTypeName.trim()) {
      newErrors.roomTypeName = "Room type name is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.numberOfGuests || parseInt(formData.numberOfGuests) <= 0) {
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
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        numberOfGuests: parseInt(formData.numberOfGuests),
      };

      await hotelDataService.updateRoom(room.roomTypeID, updateData);
      onUpdate({ ...room, ...updateData });
      toast.success("Room updated successfully!");
    } catch (err) {
      console.error("Error updating room:", err);
      toast.error("Failed to update room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Room Type</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Type Name
        </label>
        <input
          type="text"
          name="roomTypeName"
          value={formData.roomTypeName}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.roomTypeName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Single Room, Double Room"
        />
        {errors.roomTypeName && (
          <p className="text-red-500 text-sm mt-1">{errors.roomTypeName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Night
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          name="numberOfGuests"
          value={formData.numberOfGuests}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            errors.numberOfGuests ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0"
        />
        {errors.numberOfGuests && (
          <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Room description and amenities"
          rows="4"
        />
      </div>

      <div className="flex gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
        >
          {loading ? "Updating..." : "Update Room"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
}
