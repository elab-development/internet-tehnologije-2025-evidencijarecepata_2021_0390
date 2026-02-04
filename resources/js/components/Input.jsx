function Input({                                                                                                                                                                                                       label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    error = ''
}) {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}

export default Input;