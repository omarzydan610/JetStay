import { CheckCircle, XCircle, Clock } from "lucide-react";

const BookingStatusBadge = ({ status }) => {
  const statusConfig = {
    CONFIRMED: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
    },
    CANCELLED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    COMPLETED: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: CheckCircle,
    },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
  };

  const config = statusConfig[status?.toUpperCase()] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};

export default BookingStatusBadge;
