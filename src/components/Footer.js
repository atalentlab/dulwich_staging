import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import wechatQRCode from '../assets/images/Wechat_QRcode.webp';


function Footer({ sectionRefs, isVisible, availableSchools, selectedSchool, setSelectedSchool, setSelectedSchoolSlug }) {
  // State for the left dropdown - default to "International"
  const [selectedOption, setSelectedOption] = useState({ value: 'international', label: 'International' });
  const navigate = useNavigate();

  // Generate options from availableSchools with "International" as first option
  const selectOptions = useMemo(() => {
    const options = [
      { value: 'international', label: 'International', isDisabled: false }
    ];

    if (availableSchools && availableSchools.length > 0) {
      const schoolOptions = availableSchools.map(school => ({
        value: school.slug,
        label: school.title,
        isDisabled: false
      }));
      return [...options, ...schoolOptions];
    }

    return options;
  }, [availableSchools]);

  // Handle selection change
  const handleSelectChange = (option) => {
    setSelectedOption(option);
    if (option && setSelectedSchool && setSelectedSchoolSlug) {
      if (option.value === 'international') {
        setSelectedSchool('International');
        setSelectedSchoolSlug('international');
        // Redirect to static international page
        window.location.href = 'https://www.dulwich-frontend.atalent.xyz/';
      } else {
        setSelectedSchool(option.label);
        setSelectedSchoolSlug(option.value);
        localStorage.setItem('selectedSchoolSlug', option.value);
        localStorage.setItem('selectedSchoolName', option.label);
      }
    }
  };

  return (
    <footer
      ref={(el) => (sectionRefs.current['footer'] = el)}
      className="bg-[#3C3737] text-white transition-all duration-1000"
    >
      {/* Top Section - Logo and School Selector */}
      <div className="max-w-[1120px] mx-auto px-4 lg:px-2 py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left - Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/images/crest-logo.svg"
              alt="Dulwich College"
              className="h-auto w-12"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="
              text-sm
              sm:text-base
              md:text-xl
              lg:text-xl
              font-medium
              tracking-wider
              uppercase
            ">
              DULWICH COLLEGE | INTERNATIONAL |
            </h2>
      
          </div>

          {/* Right - School Selector - Desktop Only */}
          <div className="hidden md:block md:w-auto">
            <label className="block text-xs text-left font-semibold mb-2 text-white tracking-wide">
              Find a School
            </label>
            <Select
              value={(() => {
                // Check if a school is selected
                if (selectedSchool && availableSchools) {
                  const found = availableSchools
                    .map(school => ({
                      value: school.slug,
                      label: school.title,
                      school: school
                    }))
                    .find(option => `Dulwich College ${option.label}` === selectedSchool);
                  if (found) return found;
                }
                // Default to "International"
                return { value: 'international', label: 'International' };
              })()}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  if (selectedOption.value === 'international') {
                    setSelectedSchool('International');
                    setSelectedSchoolSlug('international');
                    // Redirect to static international page
                    window.location.href = 'https://www.dulwich-frontend.atalent.xyz/';
                  } else {
                    const schoolName = `Dulwich College ${selectedOption.label}`;
                    setSelectedSchool(schoolName);
                    setSelectedSchoolSlug(selectedOption.value);
                    localStorage.setItem('selectedSchoolSlug', selectedOption.value);
                    localStorage.setItem('selectedSchoolName', schoolName);
                  }
                }
              }}
              options={[
                { value: 'international', label: 'International' },
                ...(availableSchools || []).map(school => ({
                  value: school.slug,
                  label: school.title,
                  school: school
                }))
              ]}
              placeholder="International"
              className="w-full md:w-56 text-left"
              classNamePrefix="select"
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition="fixed"
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
                    overflow: 'hidden'
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: '0',
                    maxHeight: '300px',
                    overflowY: 'auto',
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
         
        </div>
      </div>

      {/* Main Content - Grid */}
      <div>
        <div className="max-w-[1120px] mx-auto px-4 lg:px-2 py-12">
          <div className="grid text-left grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-10">

            {/* Column 1 - About */}
            <div>
              <h3 className="text-sm font-semibold mb-4 tracking-wide">About</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#our-origins" className="text-xs text-[#FDFCF8] hover:text-white transition-colors">
                    Our Origins
                  </a>
                </li>
                <li>
                  <a href="#vision-values" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Vision & Values
                  </a>
                </li>
                <li>
                  <a href="#school-locations" className="text-xs text-gray-300 hover:text-white transition-colors">
                    School Locations
                  </a>
                </li>
                <li>
                  <a href="#offerings" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Offerings
                  </a>
                </li>
                <li>
                  <a href="#educational-leadership" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Educational Leadership
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 - Live */}
            <div>
              <h3 className="text-sm font-semibold mb-4 tracking-wide">Live</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#enrichment-programmes" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Enrichment Programmes
                  </a>
                </li>
                <li>
                  <a href="#visual-performing-arts" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Visual & Performing Arts
                  </a>
                </li>
                <li>
                  <a href="#sports" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Sports
                  </a>
                </li>
                <li>
                  <a href="#science-technology" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Science & Technology
                  </a>
                </li>
                <li>
                  <a href="#mandarin" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Mandarin
                  </a>
                </li>
                <li>
                  <a href="#sustainability" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Sustainability & Global Citizenship
                  </a>
                </li>
                <li>
                  <a href="#student-leadership" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Student Leadership
                  </a>
                </li>
                <li>
                  <a href="#wellbeing" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Wellbeing
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - World */}
            <div>
              <h3 className="text-sm font-semibold mb-4 tracking-wide">World</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#worldwide-events" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Worldwide Events
                  </a>
                </li>
                <li>
                  <a href="#ignite-switzerland" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Ignite: Switzerland
                  </a>
                </li>
                <li>
                  <a href="#alumni-network" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Worldwide Alumni Network
                  </a>
                </li>
                <li>
                  <a href="#family-of-schools" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Family of Schools
                  </a>
                </li>
                <li>
                  <a href="#dulwich-life" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Dulwich Life
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Wise */}
            <div>
              <h3 className="text-sm font-semibold mb-4 tracking-wide">Wise</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#academic-excellence" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Academic Excellence
                  </a>
                </li>
                <li>
                  <a href="#university-careers" className="text-xs text-gray-300 hover:text-white transition-colors">
                    University & Careers Counselling
                  </a>
                </li>
                <li>
                  <a href="#skills-profile" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Worldwide Skills Profile
                  </a>
                </li>
              </ul>
              <div>
                <br></br>  <br></br>
              <h3 className="text-sm font-semibold mb-4 tracking-wide">External Links</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="#parent-portal" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Parent Portal
                  </a>
                </li>
                <li>
                  <a href="#founding-school" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Founding School
                  </a>
                </li>
                <li>
                  <a href="#education-in-motion" className="text-xs text-gray-300 hover:text-white transition-colors">
                    Education In Motion
                  </a>
                </li>
              </ul>
            </div>
            </div>

      
          </div>
        </div>
      </div>

      {/* Bottom Section - QR Code, Social Media & Copyright */}
      <div className="bg-[#3C3737]">
        <div className="max-w-[1120px] mx-auto px-4 lg:px-2 py-8">

          {/* Mobile: School Selector */}
          <div className="block md:hidden mb-6">
            <h3 className="text-sm text-left font-semibold mb-3 text-white">Our Schools</h3>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              className="w-full text-left"
              options={selectOptions}
              isOptionDisabled={option => option.isDisabled}
              placeholder="International"
              classNamePrefix="select"
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: 'white',
                  borderColor: state.isFocused ? '#d1d5db' : '#e5e7eb',
                  borderWidth: '1px',
                  boxShadow: 'none',
                  minHeight: '42px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#D30013' : state.isFocused ? '#D30013' : '#4a5568',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  fontSize: '14px'
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#4a5568',
                  borderRadius: '4px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999
                }),
                menuList: (base) => ({
                  ...base,
                  padding: '0',
                  maxHeight: '300px',
                  overflowY: 'auto',
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
                  fontSize: '14px'
                }),
                placeholder: (base) => ({
                  ...base,
                  color: '#9ca3af',
                  fontSize: '14px'
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (base, state) => ({
                  ...base,
                  color: '#6b7280',
                  transition: 'transform 0.2s',
                  transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                })
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between lg:items-center lg:justify-start gap-6">

            {/* QR Code - Centered on mobile, left on desktop */}
            <div className="flex justify-left md:justify-start w-full md:w-auto">
              <img
                src={wechatQRCode}
                alt="QR Code"
                className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Social Media Icons - Grid layout on mobile, flex on desktop */}
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-4 md:flex md:flex-row gap-6 md:gap-6 justify-items-center md:justify-start items-center">
                <a href="#wechat" className="text-white hover:text-gray-300 transition-colors" aria-label="WeChat">
                  <Icon icon="Icon-Social-WC" size={28} color="white" />
                </a>
                <a href="#rednote" className="text-white hover:text-gray-300 transition-colors" aria-label="RedNote">
                  <Icon icon="Icon-Social-RedNote" size={28} color="white" />
                </a>
                <a href="#youku" className="text-white hover:text-gray-300 transition-colors" aria-label="Youku">
                  <Icon icon="Icon-Social-YK" size={28} color="white" />
                </a>
                <a href="#instagram" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram">
                  <Icon icon="Icon-Social-IG" size={28} color="white" />
                </a>
                <a href="#facebook" className="text-white hover:text-gray-300 transition-colors" aria-label="Facebook">
                  <Icon icon="Icon-Social-FB" size={28} color="white" />
                </a>
                <a href="#youtube" className="text-white hover:text-gray-300 transition-colors" aria-label="YouTube">
                  <Icon icon="Icon-Social-YT" size={28} color="white" />
                </a>
                <a href="#linkedin" className="text-white hover:text-gray-300 transition-colors" aria-label="LinkedIn">
                  <Icon icon="Icon-Social-LI" size={28} color="white" />
                </a>
              </div>
            </div>
          </div>

          {/* Safeguarding Notice */}
          <div className="mt-8 text-sm text-left text-gray-300 max-w-full md:max-w-3xl">
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Safeguarding Matters:</strong> We are fully committed to safeguarding all of our students from any form of harm or abuse.{' '}
              <a href="#safeguarding" className="text-white underline hover:text-gray-300 transition-colors">
                Click here
              </a>
              {' '}for more information.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-[#646261] mb-[80px] md:mb-70px">
            <p className="text-xs text-white text-left leading-relaxed">
              © 2025 Dulwich College Management International Limited, or its affiliates
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
              沪ICP备16016470号-4 · 沪公网安备31010602002392号
            </p>
       
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
