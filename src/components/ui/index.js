import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  type = "button",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-poppins";

  const variants = {
    primary:
      "btn-primary text-white shadow-lg focus:ring-2 focus:ring-offset-2",
    secondary:
      "btn-secondary text-white shadow-lg focus:ring-2 focus:ring-offset-2",
    accent:
      "bg-gradient-to-r from-orange-300 to-orange-200 text-red-800 hover:from-orange-400 hover:to-orange-300 focus:ring-orange-400 shadow-md",
    outline: "btn-outline focus:ring-2 focus:ring-offset-2",
    ghost: "btn-ghost focus:ring-2 focus:ring-offset-2",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, className, type = "text", ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-poppins">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 input-focus transition-colors font-poppins",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 font-poppins">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-poppins">
          {label}
        </label>
      )}
      <select
        className={cn(
          "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 input-focus transition-colors font-poppins",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-600 font-poppins">{error}</p>}
    </div>
  );
}

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default", className, ...props }) {
  const variants = {
    default: "badge-primary",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "badge-secondary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div
          className={cn(
            "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full",
            sizes[size]
          )}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="ml-3 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-red-600",
        sizes[size],
        className
      )}
    />
  );
}
