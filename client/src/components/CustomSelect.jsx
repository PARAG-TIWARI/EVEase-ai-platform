import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

export default function CustomSelect({ options, value, onChange, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <i className={`${icon} select-icon`}></i>}
        <span className="select-text">{selectedOption.label}</span>
        <i className={`fas fa-chevron-down select-arrow ${isOpen ? 'open' : ''}`}></i>
      </div>

      {isOpen && (
        <ul className="custom-select-options fade-in">
          {options.map((option) => (
            <li 
              key={option.value}
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {option.value === value && <i className="fas fa-check" style={{marginLeft: 'auto'}}></i>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
