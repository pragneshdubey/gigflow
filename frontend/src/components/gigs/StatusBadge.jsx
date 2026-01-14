const COLORS = {
    open: "bg-blue-100 text-blue-600",
    assigned: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    hired: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
  };
  
  export default function StatusBadge({ status }) {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          COLORS[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status?.toUpperCase()}
      </span>
    );
  }
  