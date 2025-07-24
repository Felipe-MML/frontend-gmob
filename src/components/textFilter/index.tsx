"use client";

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

const TextFilter = ({
  value,
  onChange,
  label,
  placeholder,
}: TextFilterProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={`${label}-filter`}
        className="text-sm font-medium text-gray-600 mb-1"
      >
        {label}
      </label>
      <input
        id={`${label}-filter`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextFilter;
