import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import hotelDataService from "../../../../services/HotelServices/roomsService";

const ImageCard = ({ imageUrl, imageId, onDelete }) => (
  <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md group">
    <img
      src={imageUrl}
      alt="Room"
      className="w-full h-full object-cover"
    />
    <button
      onClick={() => onDelete(imageId)}
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-bold"
      title="Delete Image"
    >
      Delete
    </button>
  </div>
);

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
  // 2. New state for images and image upload loading
  const [roomImages, setRoomImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);


  // 3. useEffect to fetch images on component mount
  useEffect(() => {
    fetchRoomImages();
  }, []);

  const fetchRoomImages = async () => {
    try {
      setImageLoading(true);
      const images = await hotelDataService.getRoomImages(room.roomTypeID);
      // Assuming images structure is [{ imageID, imageUrl }]
      setRoomImages(images);
    } catch (err) {
      console.error("Error fetching room images:", err);
      toast.error("Failed to load room images.");
    } finally {
      setImageLoading(false);
    }
  };


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
    // ... (Your existing handleSubmit logic remains here)
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

  // 4. Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageLoading(true);
      const newImage = await hotelDataService.uploadRoomImage(
        room.roomTypeID,
        file
      );
      if (newImage) {
        setRoomImages((prev) => [...prev, newImage]);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload image. Max file size may be exceeded.");
    } finally {
      setImageLoading(false);
      // Reset file input value to allow uploading the same file again if needed
      e.target.value = null;
    }
  };

  // 5. Function to handle image deletion
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      setImageLoading(true);
      await hotelDataService.deleteRoomImage(imageId);
      setRoomImages((prev) => prev.filter((img) => img.imageID !== imageId));
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image.");
    } finally {
      setImageLoading(false);
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

      {/* 6. Image Management Section (The new part) */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
          Room Images
          <label
            htmlFor="image-upload-input"
            className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
              imageLoading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-cyan-500 text-white hover:bg-cyan-600"
            }`}
          >
            {imageLoading ? "Uploading..." : "Add Image"}
          </label>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={imageLoading}
            className="hidden"
          />
        </h3>

        <div className="flex flex-wrap gap-4 min-h-[100px] border p-4 rounded-lg bg-gray-50">
          {imageLoading && roomImages.length === 0 ? (
            <p className="text-gray-500">Loading images...</p>
          ) : roomImages.length === 0 ? (
            <p className="text-gray-500">
              No images added yet. Click 'Add Image' to upload.
            </p>
          ) : (
            roomImages.map((image) => (
              <ImageCard
                key={image.imageID}
                imageUrl={image.imageUrl}
                imageId={image.imageID}
                onDelete={handleDeleteImage}
              />
            ))
          )}
        </div>
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
