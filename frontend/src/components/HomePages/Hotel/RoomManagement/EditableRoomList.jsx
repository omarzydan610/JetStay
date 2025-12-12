import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import roomsService from "../../../../services/HotelServices/roomsService";
import EditableRoomCard from "./EditableRoomCard";
import SectionHeader from "../HomePage/SectionHeader";
import GlassCard from "../GlassCard";
import UpdateRoomForm from "./UpdateRoomForm";
import ConfirmDeleteModal from "../../../HomePages/Shared/ConfirmDeleteModal";

export default function EditableRoomList() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await roomsService.getAllRooms();
      setRooms(res);
    } catch (err) {
      console.error("Error loading rooms", err);
      toast.error("Failed to load room types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleUpdateRoom = async (updatedRoom) => {
    try {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.roomTypeID === updatedRoom.roomTypeID ? { ...r, ...updatedRoom } : r
        )
      );
      setEditingRoom(null);
    } catch (err) {
      console.error("Error updating room:", err);
    }
  };

  const handleDeleteRoom = async (roomTypeID) => {
    setRoomToDelete(roomTypeID);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      setDeletingId(roomToDelete);
      await roomsService.deleteRoom(roomToDelete);
      setRooms((prevRooms) =>
        prevRooms.filter((r) => r.roomTypeID !== roomToDelete)
      );
      toast.success("Room deleted successfully!");
      setShowDeleteModal(false);
      setRoomToDelete(null);
    } catch (err) {
      console.error("Error deleting room:", err);
      toast.error("Error deleting room. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Room Management"
        description="Edit or delete your rooms"
      />

      {/* Edit Mode - Show only selected room and form */}
      {editingRoom ? (
        <>
          {/* Selected Room Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EditableRoomCard
              room={editingRoom}
              onEdit={() => {}} // Disabled in edit mode
              onDelete={() => {}} // Disabled in edit mode
              isDeleting={false}
              isEditMode={true}
            />
          </motion.div>

          {/* Edit Form */}
          <GlassCard>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
                ✎ Edit Room
              </h4>
              <UpdateRoomForm
                room={editingRoom}
                onUpdate={handleUpdateRoom}
                onCancel={() => setEditingRoom(null)}
              />
            </div>
          </GlassCard>
        </>
      ) : (
        /* Normal Mode - Show rooms list */
        <GlassCard>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.p
                className="text-gray-500 text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading rooms...
              </motion.p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No rooms available. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.roomTypeID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EditableRoomCard
                    room={room}
                    onEdit={setEditingRoom}
                    onDelete={handleDeleteRoom}
                    isDeleting={deletingId === room.roomTypeID}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this room type? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setRoomToDelete(null);
        }}
        isLoading={deletingId !== null}
      />
    </motion.div>
  );
}
