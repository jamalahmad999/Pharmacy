export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 active:scale-95';
  
  const variants = {
    primary: 'bg-[#002579] text-white hover:bg-[#001a5c] focus:ring-[#002579]/30 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500/30 border border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 shadow-lg hover:shadow-xl',
    success: 'bg-[#002579] text-white hover:bg-[#001a5c] focus:ring-[#002579]/30 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-[#002579] bg-white text-[#002579] hover:bg-blue-50 focus:ring-[#002579]/30',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
