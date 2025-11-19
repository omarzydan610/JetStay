const SubmitButton = ({ 
  loading = false, 
  children,
  disabled = false 
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Submitting...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;