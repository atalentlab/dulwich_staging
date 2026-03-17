import React, { useState } from 'react';
import Icon from '../Icon';

const schoolsData = [
  {
    name: "Dulwich College Beijing",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/lr002864.jpg",
    content: "Largest student body in Beijing. Purpose-built theatre and Olympic-standard sports facilities.",
    url: "https://beijing.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College Shanghai Pudong",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/9df0942bee622ece96723eb58bd03ab6ec4c2e8f.jpg",
    content: "Leading international school with strong academic pathways.",
    url: "https://shanghai-pudong.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College Shanghai Puxi",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/9df0942bee622ece96723eb58bd03ab6ec4c2e8f.jpg",
    content: "Excellence in education with comprehensive curriculum.",
    url: "https://shanghai-puxi.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College Suzhou",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/9df0942bee622ece96723eb58bd03ab6ec4c2e8f.jpg",
    content: "Innovative learning environment with world-class facilities.",
    url: "https://suzhou.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College (Singapore)",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/ef41358bfee08b4ff9a9c1bd801c8c7737d18931.png",
    content: "Premier international education in the heart of Singapore.",
    url: "https://singapore.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College Seoul",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/ef41358bfee08b4ff9a9c1bd801c8c7737d18931.png",
    content: "Bilingual education with global perspective.",
    url: "https://seoul.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich International High School Programme Suzhou",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/AxxKvKJHe5dxWwt5hhVlixWgoGiKjUg1jwXOu8v6.jpeg",
    content: "Specialized high school programme preparing students for university.",
    url: "https://suzhou-high-school.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich International High School Programme Hengqin",
    image_url: "https://dulwich-eimstaging.oss-cn-shanghai.aliyuncs.com/thumbs/schools/fit/472x256/wechat-image-20210902150627-20210922-151534-393.jpg",
    content: "Rigorous academic program with international focus.",
    url: "https://hengqin.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dulwich College Bangkok",
    image_url: "https://assets.dulwich.org/thumbs/schools/fit/472x256/23004-dulwich-college-bangkok-main-road-20250121-20250211-141857-258-1.jpeg",
    content: "Newest addition to the Dulwich family with state-of-the-art facilities.",
    url: "https://bangkok.dulwich-frontend.atalent.xyz/"
  },
  {
    name: "Dehong Shanghai International Chinese School",
    image_url: "https://www.dulwich.eimstaging.com/images/backgrounds/Dehong_Shanghai.jpeg",
    content: "Blending Chinese national curriculum with international education.",
    url: "https://shanghai.dehong.cn"
  },
  {
    name: "Dehong Beijing International Chinese School",
    image_url: "https://www.dulwich.eimstaging.com/images/backgrounds/Dehong_Beijing.jpeg",
    content: "Chinese-language education with international perspective.",
    url: "https://beijing.dehong.cn"
  },
  {
    name: "Dehong Xi'an School",
    image_url: "https://www.dulwich.eimstaging.com/images/backgrounds/Dehong_Xian.jpeg",
    content: "Quality Chinese education in historic Xi'an.",
    url: "https://xian.dehong.cn"
  }
];

// ── Custom Dropdown (same UI as PageFooter) ────────────────────────────────────
const CustomDropdown = ({ value, options, onChange, isOpen, setIsOpen, placeholder }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <button
        onClick={() => !isClosing && setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 bg-[#fff] border border-[#EBE4DD] rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
        style={{ willChange: 'auto' }}
      >
        <span className={value ? 'text-[#3C3C3B] text-[16px]' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <Icon
          icon="Icon-Chevron-small"
          size={20}
          color="#D30013"
          className={`transition-transformduration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Dropdown menu */}
          <div
            className="absolute z-[101] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: '#D30013 #f3f4f6',
              pointerEvents: 'auto',
              willChange: 'transform, opacity',
              transformOrigin: 'top',
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                  value === option
                    ? 'bg-[#FFF5F5] text-[#D30013] font-semibold border-l-4 border-l-[#D30013]'
                    : 'text-[#3C3C3B] hover:bg-[#FAF7F5] border-l-4 border-l-transparent'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === options.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
                }`}
              >
                <div className="flex items-center">
                  {option}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 8px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #D30013; border-radius: 4px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #B8000F; }
        .overflow-y-auto { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
      `}</style>
    </div>
  );
};

// ── AdmissionsPromoBlock ───────────────────────────────────────────────────────
const AdmissionsPromoBlock = ({ content }) => {
  const { title, description, image, 'image_description': imageDescription } = content;
  const defaultImageUrl = image?.startsWith('http') ? image : `https://www.dulwich.atalent.xyz${image}`;

  const [selectedSchoolName, setSelectedSchoolName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedSchool = schoolsData.find(s => s.name === selectedSchoolName) || null;
  const displayImageUrl = selectedSchool ? selectedSchool.image_url : defaultImageUrl;
  const schoolOptions = schoolsData.map(s => s.name);

  return (
    <section className="py-[80px] px-4 bg-[#FAF7F5] bottom border-[#F2EDE9] max-w-[1370px] m-auto rounded-lg mb-8 mt-8">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex flex-col md:flex-row text-left gap-12">

          {/* Left side – Text content */}
          <div className="md:w-1/2 text-left">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold font-weight-900 text-[#3C3737]">
                {selectedSchool ? selectedSchool.name : title}
              </h2>
              <p className="text-base text-[#3C3C3B] leading-relaxed">
                {selectedSchool ? selectedSchool.content : description}
              </p>

              {/* Dropdown + CTA */}
              <div className="space-y-5 text-left max-w-[355px]">
                <CustomDropdown
                  value={selectedSchoolName}
                  options={schoolOptions}
                  onChange={setSelectedSchoolName}
                  isOpen={isDropdownOpen}
                  setIsOpen={setIsDropdownOpen}
                  placeholder="Select School"
                />

                <a
                  href={selectedSchool ? selectedSchool.url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block text-[14px] font-medium px-8 py-3 text-left bg-[#D30013] text-[#FFFFFF] rounded-lg hover:bg-red-700 transition-colors`}
                  onClick={(e) => { if (!selectedSchool) e.preventDefault(); }}
                >
                  Go to School Site
                </a>
              </div>
            </div>
          </div>

          {/* Right side – Dynamic image */}
          <div className="md:w-1/2">
            <div className="relative overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '544 / 360' }}>
              <img
                src={displayImageUrl}
                alt={selectedSchool ? selectedSchool.name : (imageDescription || title)}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdmissionsPromoBlock;
