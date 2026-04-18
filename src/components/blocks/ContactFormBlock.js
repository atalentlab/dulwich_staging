import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

const COUNTRY_CODES = [
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
];

const ContactFormBlock = ({ content }) => {
  const { template = 'enquiry_form' } = content;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_code: 'SG',
    age_range: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgeRangeClick = (range) => {
    setFormData(prev => ({
      ...prev,
      age_range: prev.age_range === range ? '' : range
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact/enquiryform`, formData);
      if (response.data.success) {
        setShowSuccess(true);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          country_code: 'SG',
          age_range: '',
          message: ''
        });
      } else {
        setError(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (template !== 'enquiry_form') {
    return <div className="py-10 text-center">Form template "{template}" not implemented.</div>;
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] min-h-screen">

        {/* LEFT SIDE (Image / Banner) - 70% */}
        <div className="relative h-[400px] lg:h-auto">
          <img
            src="https://dulwich.blob.core.chinacloudapi.cn/dulwich-staging/pages/sustainability-and-global-citizenship-1600x1000-1-20260203-130316-204.png"
            alt="Our Dulwich Stories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 lg:px-20">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
              Our Dulwich Stories
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE (Form) - 30% */}
        <div className="flex items-center justify-center bg-[#FAF7F5] px-6 py-12 lg:py-16">
          <div className="w-full max-w-[500px]">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8B1538] mb-8">Get in touch</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
                />
              </div>

              {/* Phone with Country Code */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone<span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Custom Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="min-w-[60px] px-4 py-3 bg-[#6B6B6B] text-white border border-gray-300 rounded flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#D30013]"
                    >
                      <span className="text-sm">
                        {COUNTRY_CODES.find(c => c.code === formData.country_code)?.code || 'Please select'}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsDropdownOpen(false)}
                        ></div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-20 max-h-[240px] overflow-y-auto">
                          {COUNTRY_CODES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, country_code: country.code }));
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                                formData.country_code === country.code
                                  ? 'bg-[#D30013] text-white'
                                  : 'text-gray-700 hover:bg-red-50'
                              }`}
                            >
                              {country.code}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={COUNTRY_CODES.find(c => c.code === formData.country_code)?.dialCode || '+65'}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Child Age Range */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Child Age Range<span className="text-red-600">*</span> (Check all that apply)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['2 - 7', '7 - 11', '11 - 18'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => handleAgeRangeClick(range)}
                      className={`px-4 py-3 border rounded text-sm font-medium transition-all ${
                        formData.age_range === range
                          ? 'bg-[#D30013] text-white border-[#D30013]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#D30013]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question or Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Question or Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#D30013] hover:bg-[#B00010] text-white font-bold rounded transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Contact Us'
                )}
              </button>
            </form>
          </div>
        </div>

      </div>




      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 md:p-12 max-w-[500px] w-full shadow-2xl text-center border border-[#F2EDE9]"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3C3737] mb-4">Message Sent Successfully!</h3>
              <p className="text-[#3C3737] opacity-70 mb-8 leading-relaxed">
                Thank you for reaching out. Our team has received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-[#3C3737] hover:bg-[#2A2626] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-gray-200"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactFormBlock;
