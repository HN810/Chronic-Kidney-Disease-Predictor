import { Info } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  step?: string;
  info?: string;
}

function InputField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  error,
  type = 'text',
  step,
  info,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {info && (
          <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            {info}
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          className={`w-full px-4 py-3 rounded-lg border ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } focus:ring-2 focus:outline-none transition-all`}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
