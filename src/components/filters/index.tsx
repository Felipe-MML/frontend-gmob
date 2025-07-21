import { useState, ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FilterAccordionProps {
  title: string;
  children: ReactNode;
}

const Filters = ({ children, title }: FilterAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white max-w-6xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 focus:outline-none"
      >
        <span className="text-gray-700 font-medium">{title}</span>
        <FiChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 p-4 border-t border-gray-200" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Filters;
