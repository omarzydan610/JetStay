const SubmitButton = ({ 
  loading = false, 
  children,
  disabled = false 
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
          <span className="text-lg">Submitting...</span>
        </div>
      ) : (
        <span className="text-lg">{children}</span>
      )}
    </button>
  );
};

export default SubmitButton;