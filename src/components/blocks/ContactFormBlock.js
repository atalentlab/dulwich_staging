import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

const ContactFormBlock = ({ content }) => {
  const { template = 'enquiry_form' } = content;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    <section className="py-16 px-4 bg-white relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%] min-h-screen">

        {/* LEFT SIDE (Image / Banner) */}
        <div className="relative">
          <img
            src="https://dulwich.blob.core.chinacloudapi.cn/dulwich-staging/pages/sustainability-and-global-citizenship-1600x1000-1-20260203-130316-204.png"
            alt="Dulwich Story"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold">
              Our Dulwich Stories
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div className="flex items-center justify-center bg-[#FAF7F5] px-6 py-12">
          <div className="w-full max-w-[500px]">
            <div className="max-w-[800px] mx-auto">
              <div className="bg-[#FAF7F5] rounded-3xl p-4 md:p-6 shadow-sm">
                <h2 className="text-3xl font-bold text-[#3C3737] mb-8 text-center">Get in Touch</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="first_name" className="block text-sm font-semibold text-[#3C3737]">First Name *</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E3D9D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last_name" className="block text-sm font-semibold text-[#3C3737]">Last Name *</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E3D9D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-[#3C3737]">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E3D9D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent transition-all"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#3C3737]">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E3D9D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-[#3C3737]">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-[#E3D9D1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D30013] focus:border-transparent transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group flex items-center justify-center gap-2 px-10 py-4 bg-[#D30013] hover:bg-[#B00010] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Send Message
                          <Icon icon="Icon-Arrow" size={18} color="white" className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
