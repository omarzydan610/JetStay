// src/components/RoomType/RoomTypeModal.jsx
import React, { useEffect } from 'react';
import RoomTypeForm from './RoomTypeForm';

const RoomTypeModal = ({ isOpen, onClose, onSubmit, roomType, isLoading = false }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay with blur effect */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Center modal */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                {/* Modal panel */}
                <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl animate-slideUp">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {roomType ? 'Edit Room Type' : 'Create New Room Type'}
                                    </h3>
                                    <p className="text-blue-100 text-sm mt-0.5">
                                        {roomType ? 'Update the details below' : 'Fill in the information below'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 focus:outline-none transition-all"
                                disabled={isLoading}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <RoomTypeForm
                            initialData={roomType}
                            onSubmit={onSubmit}
                            onCancel={onClose}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomTypeModal;