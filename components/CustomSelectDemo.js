import React, { useState } from 'react';
import CustomSelect from './CustomSelect';

/**
 * CustomSelectDemo - Example usage of the CustomSelect component
 * This demonstrates how to use the CustomSelect for schools, months, and custom options
 */
function CustomSelectDemo() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCustom, setSelectedCustom] = useState(null);

  // Custom options example
  const customOptions = [
    { value: 'option1', label: 'Option 1', isDisabled: false },
    { value: 'option2', label: 'Option 2', isDisabled: false },
    { value: 'option3', label: 'Option 3', isDisabled: true },
    { value: 'option4', label: 'Option 4', isDisabled: false }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">CustomSelect Component Demo</h1>

      {/* School Selector */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">School Selector</h2>
        <p className="text-sm text-gray-600">
          Select a Dulwich College location from the dropdown
        </p>
        <CustomSelect
          type="school"
          placeholder="Select a School..."
          onChange={(option) => {
            setSelectedSchool(option);
            console.log('Selected school:', option);
          }}
          className="w-full md:w-96"
        />
        {selectedSchool && (
          <div className="mt-2 p-3 bg-blue-50 rounded">
            <p className="text-sm">
              <strong>Selected:</strong> {selectedSchool.label}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Value:</strong> {selectedSchool.value}
            </p>
          </div>
        )}
      </div>

      {/* Month Selector */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Month Selector</h2>
        <p className="text-sm text-gray-600">
          Select a month from the dropdown
        </p>
        <CustomSelect
          type="month"
          placeholder="Select Month..."
          onChange={(option) => {
            setSelectedMonth(option);
            console.log('Selected month:', option);
          }}
          disabledOptions={[0, 1]} // Disable January and February
          className="w-full md:w-96"
        />
        {selectedMonth && (
          <div className="mt-2 p-3 bg-green-50 rounded">
            <p className="text-sm">
              <strong>Selected:</strong> {selectedMonth.label}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Month Index:</strong> {selectedMonth.value}
            </p>
          </div>
        )}
      </div>

      {/* Custom Options Selector */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Custom Options Selector</h2>
        <p className="text-sm text-gray-600">
          Select from custom options (Option 3 is disabled)
        </p>
        <CustomSelect
          type="custom"
          customOptions={customOptions}
          placeholder="Select an Option..."
          onChange={(option) => {
            setSelectedCustom(option);
            console.log('Selected custom option:', option);
          }}
          className="w-full md:w-96"
        />
        {selectedCustom && (
          <div className="mt-2 p-3 bg-purple-50 rounded">
            <p className="text-sm">
              <strong>Selected:</strong> {selectedCustom.label}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Value:</strong> {selectedCustom.value}
            </p>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Usage Examples</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">1. School Selector</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<CustomSelect
  type="school"
  placeholder="Select a School..."
  onChange={(option) => console.log(option)}
  className="w-full md:w-96"
/>`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">2. Month Selector with Disabled Months</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<CustomSelect
  type="month"
  placeholder="Select Month..."
  onChange={(option) => console.log(option)}
  disabledOptions={[0, 1]} // Disable Jan & Feb
  className="w-full md:w-96"
/>`}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">3. Custom Options</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const options = [
  { value: 'opt1', label: 'Option 1', isDisabled: false },
  { value: 'opt2', label: 'Option 2', isDisabled: true }
];

<CustomSelect
  type="custom"
  customOptions={options}
  placeholder="Select..."
  onChange={(option) => console.log(option)}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CustomSelectDemo;
