import React from 'react';
import Select from 'react-select';

/**
 * SchoolSelector Component
 * A reusable school selection dropdown with localStorage persistence
 *
 * @param {Object} props
 * @param {Array} props.availableSchools - Array of school objects with {slug, title, ...}
 * @param {string} props.selectedSchool - Currently selected school name
 * @param {Function} props.setSelectedSchool - Callback to update selected school name
 * @param {Function} props.setSelectedSchoolSlug - Callback to update selected school slug
 * @param {string} props.className - Additional CSS classes for the wrapper
 * @param {boolean} props.showLabel - Show/hide the "Find a School" label (default: true)
 * @param {string} props.placeholder - Custom placeholder text (default: "Please Select")
 * @param {boolean} props.persistToLocalStorage - Save selection to localStorage (default: true)
 */
function SchoolSelector({
  availableSchools = [],
  selectedSchool,
  setSelectedSchool,
  setSelectedSchoolSlug,
  className = 'w-full md:w-56',
  showLabel = true,
  placeholder = 'Please Select',
  persistToLocalStorage = true
}) {
  // Handle selection change
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const schoolName = `Dulwich College ${selectedOption.label}`;

      // Update parent state
      if (setSelectedSchool) {
        setSelectedSchool(schoolName);
      }
      if (setSelectedSchoolSlug) {
        setSelectedSchoolSlug(selectedOption.value);
      }

      // Persist to localStorage if enabled
      if (persistToLocalStorage) {
        localStorage.setItem('selectedSchoolSlug', selectedOption.value);
        localStorage.removeItem('selectedSchoolName'); // store slug only
      }
    }
  };

  // Generate options from available schools
  const schoolOptions = availableSchools.map(school => ({
    value: school.slug,
    label: school.title,
    school: school
  }));

  // Find current selected option
  const currentValue = schoolOptions.find(
    option => `Dulwich College ${option.label}` === selectedSchool
  );

  // Don't render if no schools available
  if (!availableSchools || availableSchools.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-xs font-semibold mb-2 text-white tracking-wide">
          Find a School
        </label>
      )}
      <Select
        value={currentValue}
        onChange={handleSelectChange}
        options={schoolOptions}
        placeholder={placeholder}
        className="w-full"
        classNamePrefix="select"
        isSearchable={false}
        styles={{
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
            backgroundColor: state.isSelected
              ? '#D30013'
              : state.isFocused
              ? '#D30013'
              : '#4a5568',
            color: 'white',
            cursor: 'pointer',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            '&:active': {
              backgroundColor: '#D30013'
            },
            '&::before': state.isSelected ? {
              content: '"✓ "',
              marginRight: '8px',
              color: 'white'
            } : {}
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#4a5568',
            borderRadius: '4px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
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
              color: '#D30013'
            },
            transition: 'transform 0.2s',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          })
        }}
      />
    </div>
  );
}

export default SchoolSelector;
