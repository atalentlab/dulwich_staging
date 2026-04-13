import React, { useState, useEffect } from 'react';
import { getCurrentSchool } from '../../utils/schoolDetection';
import { useLocation } from 'react-router-dom';
import Icon from '../Icon';

/**
 * MainCampusMapBlock Component
 * Displays school campus location with interactive map and contact information
 *
 * API Response:
 * {
 *   "type": "main_campus_map",
 *   "content": {
 *     "title": "Find Us",
 *     "school_id": "12",
 *     "school": "shanghai-pudong",
 *     "anchor-id": "campus-map"
 *   }
 * }
 */
const MainCampusMapBlock = ({ content }) => {
  const { 'anchor-id': anchorId } = content || {};

  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCampusId, setSelectedCampusId] = useState(null); // track by address id
  const [copiedField, setCopiedField] = useState(null);
  const location = useLocation();

  // Determine locale based on URL path
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const locale = isChineseVersion ? 'zh' : 'en';

  // Get current school from URL or detection
  const detectedSchool = getCurrentSchool();
  const schoolSlug = content?.school || detectedSchool || 'shanghai-pudong';

  // Fetch school information
  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.REACT_APP_API_URL;
        const apiUrl = `${baseUrl}/api/school_info?locale=${locale}&school=${schoolSlug}`;

        console.log('🗺️ MainCampusMapBlock - Fetching school info:', apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.warn(`🗺️ MainCampusMapBlock - School info API returned ${response.status} for ${schoolSlug}`);
          return;
        }

        const result = await response.json();
        console.log('🗺️ MainCampusMapBlock - API response:', result);

        if (result.success && result.data) {
          setSchoolData(result.data);

          // ✅ FIX: addresses is an array — default select the first one (weight: 0)
          const addresses = result.data.addresses;
          if (Array.isArray(addresses) && addresses.length > 0) {
            const sorted = [...addresses].sort((a, b) => a.weight - b.weight);
            setSelectedCampusId(sorted[0].id);
          }

          console.log('🗺️ MainCampusMapBlock - School data set successfully');
        } else {
          console.warn('🗺️ MainCampusMapBlock - No data in API response');
        }
      } catch (error) {
        console.error('🗺️ MainCampusMapBlock - Error fetching school info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, [locale, schoolSlug]);

  // Copy to clipboard function
  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get driving directions URL
  const getDrivingDirectionsUrl = (address) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Open in map app
  const openInMapApp = (lat, lng) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  // Get map file download URL
  const getMapFileUrl = (mapFile) => {
    if (!mapFile?.file) return null;
    const baseUrl = process.env.REACT_APP_API_URL || '';
    return `${baseUrl}/storage/${mapFile.file}`;
  };

  if (loading) {
    return (
      <div className="py-16 px-4 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]"></div>
      </div>
    );
  }

  if (!schoolData) {
    console.warn('🗺️ MainCampusMapBlock - No school data available, not rendering');
    return (
      <div className="py-16 px-4 bg-white text-center">
        <p className="text-gray-500">
          {locale === 'zh' ? '暂无校园地图信息' : 'Campus map information not available'}
        </p>
      </div>
    );
  }

  // ✅ FIX: addresses is an array — sort by weight and filter out unwanted tabs if needed
  const addressesRaw = schoolData.addresses;
  const addresses = Array.isArray(addressesRaw)
    ? [...addressesRaw].sort((a, b) => a.weight - b.weight)
    : addressesRaw
    ? [addressesRaw] // fallback: wrap single object in array
    : [];

  // ✅ FIX: Get the currently selected address object
  const selectedAddress = addresses.find((a) => a.id === selectedCampusId) || addresses[0];

  // Use localized address if Chinese locale
  const displayAddress =
    locale === 'zh' && selectedAddress?.localized_address
      ? selectedAddress.localized_address
      : selectedAddress?.address;

  return (
    <section data-id={anchorId} className="py-2 md:py-12 lg:py-16 bg-white">
      <style>
        {`
          .copy-btn:hover svg path {
            fill: white !important;
          }

          /* Smooth fade-in animation */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Slide-in animation for card */
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .campus-map-container {
            animation: fadeIn 0.6s ease-out;
          }

          .campus-info-card {
            animation: slideIn 0.8s ease-out;
          }

          /* Tab transition */
          .campus-tab {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Map iframe transition */
          .map-iframe {
            transition: opacity 0.4s ease-in-out;
          }

          /* Hide scrollbar but keep functionality */
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          /* Smooth shadow transition */
          .hover\:shadow-3xl:hover {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>

      {/* Title */}
      {content?.title && (
        <div className="max-w-[1120px] mx-auto px-4 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#3C3737] text-left">
            {content.title}
          </h2>
        </div>
      )}

      {/* Full Width Map Container with Overlapping Card */}
      <div className="campus-map-container relative w-full max-w-[1376px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden h-[500px] md:h-[600px] lg:h-[700px]">

          {/* ✅ FIX: Background Map updates dynamically with selectedAddress lat/lng */}
          <div className="absolute inset-0 rounded-lg w-full h-full">
            {selectedAddress?.lat && selectedAddress?.lng ? (
              <iframe
                key={`${selectedAddress.lat}-${selectedAddress.lng}`} // force re-render on campus change
                title="School Location"
                width="100%"
                height="100%"
                frameBorder="0"
                className="map-iframe"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${selectedAddress.lat},${selectedAddress.lng}&hl=${locale}&z=16&output=embed`}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                  {locale === 'zh' ? '地图加载中...' : 'Loading map...'}
                </p>
              </div>
            )}
        </div>

          {/* ✅ FIX: Campus Tabs — dynamically rendered from addresses array */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 lg:left-8 z-20 bg-[#3C3737] opacity-100 p-1 rounded-lg max-w-[calc(100%-1rem)] md:max-w-none">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedCampusId(addr.id)}
                  className={`campus-tab px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm whitespace-nowrap transform hover:scale-105 ${
                    selectedCampusId === addr.id
                      ? 'bg-[#D30013] text-white shadow-lg'
                      : 'bg-[#E5E5E5] text-[#3C3737] hover:bg-[#D5D5D5]'
                  }`}
                >
                  {addr.title || (locale === 'zh' ? '主校区' : 'Main Campus')}
                </button>
              ))}
            </div>
          </div>

          {/* Overlapping Info Card - Responsive Layout */}
          <div className="relative z-10 h-full flex items-end md:items-center px-2 md:px-4 lg:px-8 pt-16 md:pt-20 pb-2 md:pb-0">
            <div className="campus-info-card w-full md:max-w-md lg:max-w-lg">
              <div className="bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">

                {/* Campus Image */}
                {schoolData.header_image && (
                  <div className="w-full h-32 md:h-40 lg:h-48 overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={`https://dulwich.blob.core.chinacloudapi.cn/dulwich-staging/${schoolData.listing_image}`}
                      alt={schoolData.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* School Info */}
                <div className="px-4 md:px-6 py-4 md:py-6 text-left">
                <h3 className="text-lg md:text-xl text-left font-bold text-[#3C3737] mb-1 leading-tight">
                  {schoolData.title}
                </h3>
                {/* ✅ FIX: Show currently selected campus title */}
                <p className="text-xs md:text-sm text-[#3C3737] font-normal mb-4 md:mb-6">
                  {selectedAddress?.title || (locale === 'zh' ? '主校区' : 'Main Campus')}
                </p>

                {/* Contact Information */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">

                  {/* Address */}
                  {displayAddress && (
                    <div className="flex align-center items-start gap-2 md:gap-3 group border border-[#EAE8E4] rounded-lg px-3 md:px-4 py-2 md:py-3 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                      <Icon icon="Icon-Pin" size={18} color="#3C3737" className="flex-shrink-0 mt-0.5 md:mt-1" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs md:text-sm text-[#3C3737] leading-relaxed break-words">{displayAddress}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(displayAddress, 'address')}
                        className="copy-btn flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded hover:bg-[#D30013] transition-all duration-200 transform hover:scale-110"
                        aria-label="Copy address"
                      >
                        <Icon
                          icon={copiedField === 'address' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                          size={20}
                          color={copiedField === 'address' ? '#10B981' : '#D30013'}
                        />
                      </button>
                    </div>
                  )}

                  {/* Phone */}
                  {selectedAddress?.telephone && (
                    <div className="flex items-center gap-2 md:gap-3 group border border-[#EAE8E4] rounded-lg px-3 md:px-4 py-2 md:py-3 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                      <Icon icon="Icon_Phone" size={18} color="#3C3737" className="flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs md:text-sm text-[#3C3737] break-words">{selectedAddress.telephone}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedAddress.telephone, 'phone')}
                        className="copy-btn flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded hover:bg-[#D30013] transition-all duration-200 transform hover:scale-110"
                        aria-label="Copy phone"
                      >
                        <Icon
                          icon={copiedField === 'phone' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                          size={20}
                          color={copiedField === 'phone' ? '#10B981' : '#D30013'}
                        />
                      </button>
                    </div>
                  )}

                  {/* Email */}
                  {selectedAddress?.contact_email && (
                    <div className="flex items-center gap-2 md:gap-3 group border border-[#EAE8E4] rounded-lg px-3 md:px-4 py-2 md:py-3 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
                      <Icon icon="Icon_Email" size={18} color="#3C3737" className="flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs md:text-sm text-[#3C3737] break-words">{selectedAddress.contact_email}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(selectedAddress.contact_email, 'email')}
                        className="copy-btn flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded hover:bg-[#D30013] transition-all duration-200 transform hover:scale-110"
                        aria-label="Copy email"
                      >
                        <Icon
                          icon={copiedField === 'email' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                          size={20}
                          color={copiedField === 'email' ? '#10B981' : '#D30013'}
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row align-center gap-2">
                  {/* Driving Instructions — downloads map_file PDF if available, else Google Maps directions */}
                  {selectedAddress?.map_file?.file ? (
                    <a
                      href={getMapFileUrl(selectedAddress.map_file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={selectedAddress.map_file.name}
                      className="flex items-center justify-center gap-2 w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-[#D30013] text-white rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:bg-[#B8000F] hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <Icon icon="Icon---Download" size={20} color="#FFFFFF" />
                      <span className="whitespace-nowrap">{locale === 'zh' ? '驾车路线' : 'Driving Instructions'}</span>
                    </a>
                  ) : selectedAddress?.address ? (
                    <a
                      href={getDrivingDirectionsUrl(selectedAddress.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-[#D30013] text-white rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:bg-[#B8000F] hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <Icon icon="Icon---Download" size={20} color="#FFFFFF" />
                      <span className="whitespace-nowrap">{locale === 'zh' ? '驾车路线' : 'Driving Instructions'}</span>
                    </a>
                  ) : null}

                  {selectedAddress?.lat && selectedAddress?.lng && (
                    <button
                      onClick={() => openInMapApp(selectedAddress.lat, selectedAddress.lng)}
                      className="flex items-center justify-center gap-2 w-full px-3 md:px-4 py-2.5 md:py-3.5 bg-[#D30013] text-white rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 hover:bg-[#B8000F] hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <Icon icon="Icon_External" size={20} color="#FFFFFF" />
                      <span className="whitespace-nowrap">{locale === 'zh' ? '在地图中打开' : 'Open in Map App'}</span>
                    </button>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCampusMapBlock;