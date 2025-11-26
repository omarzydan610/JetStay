// src/components/RoomType/RoomTypeForm.jsx
import React, { useState, useEffect } from 'react';

const RoomTypeForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 1,
        basePrice: 0,
        quantity: 0,
        amenities: [],
    });

    const [amenityInput, setAmenityInput] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || '',
                capacity: initialData.capacity || 1,
                basePrice: initialData.basePrice || 0,
                quantity: initialData.quantity || 0,
                amenities: initialData.amenities || [],
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Room type name is required';
        }

        if (formData.capacity && formData.capacity < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        }

        if (formData.basePrice && formData.basePrice < 0) {
            newErrors.basePrice = 'Base price cannot be negative';
        }

        if (formData.quantity && formData.quantity < 0) {
            newErrors.quantity = 'Quantity cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleAddAmenity = () => {
        if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
            setFormData({
                ...formData,
                amenities: [...(formData.amenities || []), amenityInput.trim()],
            });
            setAmenityInput('');
        }
    };

    const handleRemoveAmenity = (amenity) => {
        setFormData({
            ...formData,
            amenities: formData.amenities?.filter((a) => a !== amenity) || [],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Type Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="e.g., Deluxe Suite"
                    disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the room type..."
                    disabled={isLoading}
                />
            </div>

            {/* Capacity, Base Price, and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity (Guests)
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.capacity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        min="1"
                        disabled={isLoading}
                    />
                    {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
                </div>

                <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price ($)
                    </label>
                    <input
                        type="number"
                        id="basePrice"
                        value={formData.basePrice}
                        onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/^0+(?=\d)/, "");
                            setFormData({
                                ...formData,
                                basePrice: value
                            });
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.basePrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        min="0"
                        step="0.01"
                        disabled={isLoading}
                    />
                    {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Available Rooms
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.quantity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        min="0"
                        disabled={isLoading}
                    />
                    {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., WiFi, TV, Mini Bar"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={handleAddAmenity}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
                        disabled={isLoading || !amenityInput.trim()}
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.amenities?.map((amenity, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {amenity}
                            <button
                                type="button"
                                onClick={() => handleRemoveAmenity(amenity)}
                                className="text-blue-600 hover:text-blue-800"
                                disabled={isLoading}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default RoomTypeForm;