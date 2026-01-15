export default function Input({
  label,
  error,
  required = false,
  className = '',
  ...props
}) {
  const inputClasses = `block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-medium ${
    error 
      ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500 bg-red-50/50' 
      : 'border-gray-200 focus:ring-[#002579]/30 focus:border-[#002579] bg-gray-50/50 focus:bg-white'
  } ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
