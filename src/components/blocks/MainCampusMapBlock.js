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
  const [selectedCampus, setSelectedCampus] = useState('main');
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

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          console.warn(`🗺️ MainCampusMapBlock - School info API returned ${response.status} for ${schoolSlug}`);
          return;
        }

        const result = await response.json();

        console.log('🗺️ MainCampusMapBlock - API response:', result);

        if (result.success && result.data) {
          setSchoolData(result.data);
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

  // Get Google Maps embed URL
  const getMapEmbedUrl = (lat, lng) => {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lat},${lng}&zoom=16`;
  };

  // Get driving directions URL
  const getDrivingDirectionsUrl = (address) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  // Open in map app
  const openInMapApp = (lat, lng) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
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

  const { addresses } = schoolData;
  const mainAddress = addresses;

  return (
    <section data-id={anchorId} className="py-16 bg-white">
      <style>
        {`
          .copy-btn:hover svg path {
            fill: white !important;
          }
        `}
      </style>

      {/* Title */}
      {content?.title && (
        <div className="max-w-[1120px] mx-auto px-4 mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#3C3737] text-left">
            {content.title}
          </h2>
        </div>
      )}

      {/* Full Width Map Container with Overlapping Card */}
      <div className="relative w-[1376px] m-auto rounded-lg h-[600px] lg:h-[700px]">
        {/* Background Map - Full Width */}
        <div className="absolute inset-0 rounded-lg w-full h-full">
          {mainAddress?.lat && mainAddress?.lng ? (
            <iframe
              title="School Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${mainAddress.lat},${mainAddress.lng}&hl=${locale}&z=16&output=embed`}
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

        {/* Campus Tabs - Overlay at Top Left */}
        <div className="absolute top-4 left-4 lg:left-8 z-20 bg-[#3C3737] opacity-100 p-1 rounded-lg">
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedCampus('main')}
              className={`px-4 py-3 rounded-lg font-semibold text-[14px] transition-all duration-300 shadow-lg ${
                selectedCampus === 'main'
                  ? 'bg-[#D30013] text-white'
                  : 'bg-[#E5E5E5] text-[#3C3737] hover:bg-[#D5D5D5]'
              }`}
            >
              {locale === 'zh' ? '主校区' : 'Main Campus'}
            </button>
            {/* <button
              disabled
              className="px-4 py-3 rounded-lg font-semibold text-[14px] shadow-lg bg-[#000] text-[#fff] cursor-not-allowed"
            >
              DUCKS
            </button> */}
          </div>
        </div>

        {/* Overlapping Info Card - Left Side */}
        <div className="relative z-10 h-full flex items-center px-4 lg:px-8 pt-20 rounded-lg">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="bg-white rounded-xl shadow-2xl">
                {/* Campus Image */}
                  {schoolData.header_image && (
                    <div className="w-full h-48 overflow-hidden bg-gray-100">
                      <img
                        src={`https://dulwich-azure-prod.oss-cn-shanghai.aliyuncs.com/${schoolData.listing_image}`}
                        alt={schoolData.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        // onError={(e) => {
                          // e.target.style.display = 'none';
                        // }}
                      />
                    </div>
                  )}

                  {/* School Info */}
                  <div className="px-6 py-6 text-left">
                    <h3 className="text-xl text-left font-bold text-[#3C3737] mb-1 leading-tight">
                      {schoolData.title}
                    </h3>
                    <p className="text-sm text-[#3C3737] font-normal mb-6">
                      {mainAddress?.title || (locale === 'zh' ? '主校区' : 'Main Campus')}
                    </p>

                    {/* Contact Information */}
                    <div className="space-y-3 mb-6">
                      {/* Address */}
                      {mainAddress?.address && (
                        <div className="flex align-center items-start gap-3 group border border-[#EAE8E4] rounded-lg px-4 py-3 hover:border-gray-300 transition-colors">
                          <Icon icon="Icon-Pin" size={20} color="#3C3737" className="flex-shrink-0 mt-0.5" />
                          <div className="flex-grow">
                            <p className="text-sm text-[#3C3737] leading-relaxed">{mainAddress.address}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(mainAddress.address, 'address')}
                            className="copy-btn flex-shrink-0 w-8 h-8 flex items-center justify-center  rounded hover:bg-[#D30013] transition-all duration-200"
                            aria-label="Copy address"
                          >
                            <Icon
                              icon={copiedField === 'address' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                              size={24}
                              color={copiedField === 'address' ? '#10B981' : '#D30013'}
                            />
                          </button>
                        </div>
                      )}

                      {/* Phone */}
                      {mainAddress?.telephone && (
                        <div className="flex items-center gap-3 group border border-[#EAE8E4] rounded-lg px-4 py-3 hover:border-gray-300 transition-colors">
                          <Icon icon="Icon_Phone" size={20} color="#3C3737" className="flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-sm text-[#3C3737]">{mainAddress.telephone}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(mainAddress.telephone, 'phone')}
                            className="copy-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-[#D30013] transition-all duration-200"
                            aria-label="Copy phone"
                          >
                            <Icon
                              icon={copiedField === 'phone' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                              size={24}
                              color={copiedField === 'phone' ? '#10B981' : '#D30013'}
                            />
                          </button>
                        </div>
                      )}

                      {/* Email */}
                      {mainAddress?.contact_email && (
                        <div className="flex items-center gap-3 group border border-[#EAE8E4] rounded-lg px-4 py-3 hover:border-gray-300 transition-colors">
                          <Icon icon="Icon_Email" size={20} color="#3C3737" className="flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-sm text-[#3C3737]">{mainAddress.contact_email}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(mainAddress.contact_email, 'email')}
                            className="copy-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-[#D30013] transition-all duration-200"
                            aria-label="Copy email"
                          >
                            <Icon
                              icon={copiedField === 'email' ? 'Icon_Tick-Solid' : 'Icon_Copy'}
                              size={24}
                              color={copiedField === 'email' ? '#10B981' : '#D30013'}
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y flex align-center gap-2">
                      <a
                        href={getDrivingDirectionsUrl(mainAddress?.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-2 py-3.5 bg-[#D30013] text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#B8000F] hover:shadow-lg"
                      >
                        <Icon icon="Icon---Download" size={24} color="#FFFFFF" />
                        {locale === 'zh' ? '驾车路线' : 'Driving Instructions'}
                      </a>

                      <button
                        onClick={() => openInMapApp(mainAddress?.lat, mainAddress?.lng)}
                        className="flex items-center justify-center gap-3 w-full px-2 py-3.5 bg-[#D30013] text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#B8000F] hover:shadow-lg"
                      >
                        <Icon icon="Icon_External" size={24} color="#FFFFFF" />
                        {locale === 'zh' ? '在地图中打开' : 'Open in Map App'}
                      </button>
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
