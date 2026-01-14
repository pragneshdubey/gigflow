export default function ActionButton({ label, onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`text-blue-600 font-medium text-sm hover:underline ${
          disabled && "text-gray-400 cursor-not-allowed"
        }`}
      >
        {label}
      </button>
    );
  }
  