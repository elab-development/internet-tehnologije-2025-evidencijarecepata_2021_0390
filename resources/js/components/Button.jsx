function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
    const baseStyles = 'px-4 py-2 rounded font-semibold transition-colors duration-200 cursor-pointer';

    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
        success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {children}
        </button>
    );
}

export default Button;