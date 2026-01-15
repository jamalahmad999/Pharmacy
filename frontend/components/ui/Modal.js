export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[9998] transition-all duration-300"
          style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.15)'
          }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl transform transition-all duration-200 scale-100 z-[9999]`}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-all duration-200"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
