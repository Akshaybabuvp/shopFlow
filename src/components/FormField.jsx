export default function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  autoComplete,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || ' '}
        autoComplete={autoComplete}
        className={`peer w-full border rounded-xl px-4 pt-5 pb-2 text-sm text-[#111] bg-white outline-none transition-all duration-200 placeholder-transparent
          ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 text-xs font-medium transition-all duration-200 pointer-events-none
          top-2 ${error ? 'text-red-500' : 'text-gray-400'}
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:text-xs ${error ? 'peer-focus:text-red-500' : 'peer-focus:text-amber-600'}
        `}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
    </div>
  );
}
