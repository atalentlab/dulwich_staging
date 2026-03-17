import React, { useState } from 'react';

function Admissions({ sectionRefs, isVisible }) {
  const [selectedAges, setSelectedAges] = useState([]);

  const toggleAgeRange = (age) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter(a => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  return (
    <section
      id="contact"
      ref={(el) => (sectionRefs.current['contact'] = el)}
      className="py-12 xs:py-16 sm:py-20 md:py-24 px-4 xs:px-6 sm:px-8 xl:px-10 bg-[#f5f0eb]"
    >
      <div className="max-w-xl mx-auto">
        <h2
          className={`text-3xl xs:text-4xl sm:text-4xl md:text-5xl font-bold text-[#8B1538] mb-8 xs:mb-10 sm:mb-12 text-center transition-all duration-1000 ${
            isVisible['contact']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          Get in touch
        </h2>
        <form
          className={`space-y-5 xs:space-y-6 transition-all duration-1000 delay-200 ${
            isVisible['contact']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First name*
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last name*
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email*
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone*
            </label>
            <div className="flex gap-2">
              <select className="px-3 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all">
                <option>SG</option>
                <option>CN</option>
                <option>US</option>
                <option>UK</option>
              </select>
              <input
                type="tel"
                placeholder="+65"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Child Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child Age Range* <span className="text-gray-500 font-normal">(Check all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {['2 - 7', '7 - 11', '11 - 18'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => toggleAgeRange(age)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedAges.includes(age)
                      ? 'bg-[#8B1538] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#8B1538]'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question or Message <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-[#D30013] text-white rounded-md text-base font-semibold hover:bg-[#B8000F] transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            Contact Us
          </button>
        </form>
      </div>
    </section>
  );
}

export default Admissions;
