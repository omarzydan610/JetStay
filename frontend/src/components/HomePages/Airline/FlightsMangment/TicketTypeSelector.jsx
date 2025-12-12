import { useState } from "react";
import { motion } from "framer-motion";
import { getTicketTypes } from "../../../../services/Airline/flightsService";

// Convert lowercase string to Pascal Case (e.g., "first_class" -> "First Class")
const toPascalCase = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function TicketTypeSelector({
  selectedTickets,
  onTicketChange,
  errors,
}) {
  const [availableTypes, setAvailableTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [customType, setCustomType] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const filteredTypes = availableTypes.filter(
    (type) =>
      type.isFromBackend &&
      !selectedTickets[type.id] &&
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);

    // Always fetch fresh types from backend when opening
    if (!showDropdown && !loadingTypes) {
      setLoadingTypes(true);
      try {
        const res = await getTicketTypes();
        // Extract ticket types from SuccessResponse
        const ticketTypes = res?.data?.data || res?.data || [];
        setAvailableTypes(
          Array.isArray(ticketTypes)
            ? ticketTypes.map((type, idx) => ({
                id: type.id || type || idx,
                name: toPascalCase(type.name || type),
                isFromBackend: true,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching ticket types:", error);
        setAvailableTypes([
          { id: 1, name: "Economy", isFromBackend: true },
          { id: 2, name: "Business", isFromBackend: true },
          { id: 3, name: "First Class", isFromBackend: true },
        ]);
      } finally {
        setLoadingTypes(false);
      }
    }
  };

  const handleAddTicket = (typeId) => {
    const type = availableTypes.find((t) => t.id === typeId);
    onTicketChange({
      ...selectedTickets,
      [typeId]: { name: type?.name || "", salary: "", seats: "" },
    });
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveTicket = (typeId) => {
    const id = String(typeId);
    const { [id]: _, ...remaining } = selectedTickets;
    onTicketChange(remaining);
  };

  const handlePriceChange = (typeId, salary) => {
    const id = String(typeId);
    if (selectedTickets[id]) {
      onTicketChange({
        ...selectedTickets,
        [id]: { ...selectedTickets[id], salary },
      });
    }
  };

  const handleQuantityChange = (typeId, seats) => {
    const id = String(typeId);
    if (selectedTickets[id]) {
      onTicketChange({
        ...selectedTickets,
        [id]: { ...selectedTickets[id], seats },
      });
    }
  };

  const handleAddCustomType = () => {
    if (customType.trim()) {
      const newTypeId = Math.max(...availableTypes.map((t) => t.id), 0) + 1;
      // Don't add custom type to availableTypes to keep it out of search list
      onTicketChange({
        ...selectedTickets,
        [newTypeId]: { name: customType, salary: "", seats: "" },
      });
      setCustomType("");
      setShowCustomInput(false);
      setSearchTerm("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 border-t border-sky-200 pt-6"
    >
      <h4 className="text-lg font-bold text-gray-900 mb-4">
        🎫 Ticket Classes & Pricing
      </h4>

      {/* Error for no ticket types */}
      {errors?.tickets && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
        >
          {errors.tickets}
        </motion.div>
      )}

      {/* Selected Tickets */}
      <div className="space-y-3">
        {Object.entries(selectedTickets).map(([typeId, ticketData]) => (
          <motion.div
            key={typeId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg border-2 border-sky-200"
          >
            {/* Ticket Type Name */}
            <span className="font-semibold text-gray-700 min-w-fit w-24">
              {ticketData.name}
            </span>

            {/* Price Input */}
            <div className="flex-1">
              <input
                type="number"
                value={ticketData.salary || ""}
                onChange={(e) => handlePriceChange(typeId, e.target.value)}
                placeholder="Price"
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all focus:outline-none text-sm ${
                  errors?.[`ticket_${typeId}_salary`]
                    ? "border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50"
                    : "border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                }`}
              />
              {errors?.[`ticket_${typeId}_salary`] && (
                <span className="text-xs text-red-600 mt-1 block">
                  {errors[`ticket_${typeId}_salary`]}
                </span>
              )}
            </div>

            {/* Quantity Input */}
            <div className="w-32">
              <input
                type="number"
                value={ticketData.seats || ""}
                onChange={(e) => handleQuantityChange(typeId, e.target.value)}
                placeholder="Seats"
                className={`w-full px-3 py-2 rounded-lg border-2 transition-all focus:outline-none text-sm ${
                  errors?.[`ticket_${typeId}_seats`]
                    ? "border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50"
                    : "border-sky-200 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                }`}
              />
              {errors?.[`ticket_${typeId}_seats`] && (
                <span className="text-xs text-red-600 mt-1 block">
                  {errors[`ticket_${typeId}_seats`]}
                </span>
              )}
            </div>

            {/* Remove Button */}
            <motion.button
              type="button"
              onClick={() => handleRemoveTicket(typeId)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition text-sm"
            >
              ✕
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Add Ticket Dropdown */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={handleOpenDropdown}
          disabled={loadingTypes}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-dashed border-sky-300 text-sky-600 rounded-lg font-semibold hover:bg-sky-100 transition disabled:opacity-50"
        >
          {loadingTypes ? "Loading ticket types..." : "+ Add Ticket Type"}
        </motion.button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-sky-300 rounded-lg shadow-lg z-50"
          >
            {/* Search Input */}
            <div className="p-3 border-b-2 border-sky-100">
              <input
                type="text"
                placeholder="Search ticket types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
              />
            </div>

            {/* Ticket Types List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredTypes.length > 0 ? (
                filteredTypes.map(({ id, name }) => (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => handleAddTicket(id)}
                    whileHover={{ backgroundColor: "#f0f9ff" }}
                    className="w-full text-left px-4 py-2 hover:bg-sky-50 transition"
                  >
                    {name}
                  </motion.button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm text-center">
                  No ticket types found
                </div>
              )}
            </div>

            {/* Add Custom Type Button */}
            <div className="border-t-2 border-sky-100 p-2">
              {!showCustomInput ? (
                <motion.button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full px-3 py-2 text-sky-600 font-semibold hover:bg-sky-50 rounded-lg transition text-sm"
                >
                  + Create Custom Type
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Type name..."
                    autoFocus
                    className="flex-1 px-3 py-2 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none text-sm"
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddCustomType}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition text-sm"
                  >
                    ✓
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomType("");
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition text-sm"
                  >
                    ✕
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </motion.div>
  );
}
