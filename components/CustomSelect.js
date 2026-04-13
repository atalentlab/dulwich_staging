import React, { useState } from 'react';
import Select from 'react-select';

/**
 * CustomSelect Component
 * A flexible select component that can be used for schools, months, or any custom options
 *
 * @param {Object} props
 * @param {string} props.type - Type of selector: 'school' or 'month' or 'custom'
 * @param {Array} props.customOptions - Custom options array (for type='custom')
 * @param {Function} props.onChange - Callback when selection changes
 * @param {Object} props.initialValue - Initial selected value
 * @param {string} props.placeholder - Placeholder text
 * @param {Array} props.disabledOptions - Array of values to disable
 * @param {string} props.className - Additional CSS classes
 */
function CustomSelect({
  type = 'school',
  customOptions = [],
  onChange,
  initialValue = null,
  placeholder = 'Please Select',
  disabledOptions = [],
  className = 'w-full'
}) {
  const [selectedOption, setSelectedOption] = useState(initialValue);

  // Predefined school options matching your image
  const schoolOptions = [
    { value: 'beijing', label: ' Beijing', isDisabled: disabledOptions.includes('beijing') },
    { value: 'shanghai-pudong', label: 'Dulwich College Shanghai Pudong', isDisabled: disabledOptions.includes('shanghai-pudong') },
    { value: 'shanghai-puxi', label: 'Dulwich College Shanghai Puxi', isDisabled: disabledOptions.includes('shanghai-puxi') },
    { value: 'suzhou', label: 'Dulwich College Suzhou', isDisabled: disabledOptions.includes('suzhou') },
    { value: 'singapore', label: 'Dulwich College Singapore', isDisabled: disabledOptions.includes('singapore') },
    { value: 'yangon', label: 'Dulwich College Yangon', isDisabled: disabledOptions.includes('yangon') },
    { value: 'seoul', label: 'Dulwich College Seoul', isDisabled: disabledOptions.includes('seoul') },
    { value: '', label: 'Dulwich College International', isDisabled: disabledOptions.includes('') }
  ];

  // Month options
  const monthOptions = [
    { value: 0, label: 'January', isDisabled: disabledOptions.includes(0) },
    { value: 1, label: 'February', isDisabled: disabledOptions.includes(1) },
    { value: 2, label: 'March', isDisabled: disabledOptions.includes(2) },
    { value: 3, label: 'April', isDisabled: disabledOptions.includes(3) },
    { value: 4, label: 'May', isDisabled: disabledOptions.includes(4) },
    { value: 5, label: 'June', isDisabled: disabledOptions.includes(5) },
    { value: 6, label: 'July', isDisabled: disabledOptions.includes(6) },
    { value: 7, label: 'August', isDisabled: disabledOptions.includes(7) },
    { value: 8, label: 'September', isDisabled: disabledOptions.includes(8) },
    { value: 9, label: 'October', isDisabled: disabledOptions.includes(9) },
    { value: 10, label: 'November', isDisabled: disabledOptions.includes(10) },
    { value: 11, label: 'December', isDisabled: disabledOptions.includes(11) }
  ];

  // Determine which options to use
  let selectOptions = customOptions;
  if (type === 'school') {
    selectOptions = schoolOptions;
  } else if (type === 'month') {
    selectOptions = monthOptions;
  }

  // Handle selection change
  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  // Custom styles matching the image design
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#d1d5db' : '#e5e7eb',
      borderWidth: '1px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#d1d5db'
      },
      minHeight: '42px',
      borderRadius: '4px',
      cursor: 'pointer'
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 12px'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? '#5a5a5a'
        : state.isSelected
          ? '#4a4a4a'
          : state.isFocused
            ? '#5a5a5a'
            : '#4a4a4a',
      color: state.isDisabled ? '#999' : 'white',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '400',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #5a5a5a',
      '&:active': {
        backgroundColor: state.isDisabled ? '#5a5a5a' : '#5a5a5a'
      },
      '&::before': state.isSelected && !state.isDisabled ? {
        content: '"✓ "',
        marginRight: '8px',
        color: 'white',
        fontWeight: 'bold'
      } : {}
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#4a4a4a',
      borderRadius: '4px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      border: 'none',
      marginTop: '2px',
      overflow: 'hidden',
      zIndex: 9999
    }),
    menuList: (base) => ({
      ...base,
      padding: '0',
      maxHeight: '300px',
      '::-webkit-scrollbar': {
        width: '8px'
      },
      '::-webkit-scrollbar-track': {
        background: '#2d3748'
      },
      '::-webkit-scrollbar-thumb': {
        background: '#718096',
        borderRadius: '4px'
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#a0aec0'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1f2937',
      fontSize: '14px',
      fontWeight: '500'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    input: (base) => ({
      ...base,
      color: '#1f2937',
      fontSize: '14px'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      '&:hover': {
        color: '#4b5563'
      },
      transition: 'transform 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    })
  };

  return (
    <div className={className}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={selectOptions}
        isOptionDisabled={(option) => option.isDisabled}
        placeholder={placeholder}
        className="w-full"
        classNamePrefix="select"
        isSearchable={false}
        styles={customStyles}
      />
    </div>
  );
}

export default CustomSelect;
