import React, { useState } from 'react';
import mapStaticImage from '../../assets/images/map-static.png';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

// Parse DMS (e.g. "11°05'43.8") or decimal string to decimal degrees
function parseCoord(val) {
  if (!val) return null;
  const str = String(val).trim();
  if (/^-?\d+(\.\d+)?$/.test(str)) return parseFloat(str);
  const dms = str.match(/(-?\d+)[°]\s*(\d+)[''′]\s*([\d.]+)/);
  if (dms) {
    const deg = parseFloat(dms[1]);
    const min = parseFloat(dms[2]);
    const sec = parseFloat(dms[3]);
    const decimal = Math.abs(deg) + min / 60 + sec / 3600;
    return deg < 0 ? -decimal : decimal;
  }
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

const ContactCardBlock = ({ content }) => {
  const { title, 'nested-blocks': nestedBlocks = [] } = content;
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-[1120px] mx-auto">
        {title && <h2 className="text-4xl font-bold mb-12 text-left text-gray-800">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nestedBlocks.map((card, index) => {
            const imageUrl = card.image?.startsWith('http') ? card.image : `${API_BASE_URL}${card.image}`;

            // Support both google and bing/amap coordinates
            const googleLat = parseCoord(card.google_lat);
            const googleLng = parseCoord(card.google_long);
            const bingLat = parseCoord(card.bing_lat);
            const bingLng = parseCoord(card.bing_long);

            const hasGoogle = googleLat !== null && googleLng !== null;
            const hasBing = bingLat !== null && bingLng !== null;
            const useAmap = hasBing && !hasGoogle;
            const lat = hasGoogle ? googleLat : hasBing ? bingLat : null;
            const lng = hasGoogle ? googleLng : hasBing ? bingLng : null;
            const hasCoords = lat !== null && lng !== null;

            const mapEmbedSrc = hasCoords
              ? useAmap
                ? `https://m.amap.com/navi/?dest=${lng},${lat}&destName=Location&key=`
                : `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
              : null;
            const mapLink = hasCoords
              ? useAmap
                ? `https://uri.amap.com/marker?position=${lng},${lat}&name=Location`
                : `https://www.google.com/maps?q=${lat},${lng}`
              : null;

            return (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                {/* Map Background - Dynamic iframe or fallback static */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {hasCoords ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full relative"
                    >
                      <iframe
                        title={`Map for ${card.title || 'location'}`}
                        src={mapEmbedSrc}
                        style={{
                          border: 0,
                          display: 'block',
                          pointerEvents: 'none',
                          width: 'calc(100% + 120px)',
                          height: '450px',
                          marginTop: '-110px',
                          marginLeft: '-60px',
                        }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      {/* Overlay to block all interactions */}
                      <div className="absolute inset-0 z-10" />
                    </a>
                  ) : (
                    <img src={mapStaticImage} alt="Map location" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Dynamic Square Profile Image - outside overflow-hidden container */}
                {card.image && (
                  <div className="absolute left-4 z-20" style={{ top: '200px' }}>
                    <div className="w-[128px] h-[128px] border-4 border-white rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 space-y-4 text-left mt-14">
                  <h3 className="text-xl font-bold text-gray-900">{card.title || 'Optional Title'}</h3>
                  <p className="text-base font-semibold text-gray-700">{card.name || 'Optional Name'}</p>
                  {card.subtitle && <p className="text-sm text-gray-500">{card.subtitle || 'Optional sub text'}</p>}

                  {/* Contact Information */}
                  <div className="space-y-3 pt-4">
                    {/* Address */}
                    {card.address && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="flex items-center gap-3 flex-1">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-700">{card.address}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(card.address, `${index}-address`)}
                          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy address"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Phone */}
                    {card.telephone && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="flex items-center gap-3 flex-1">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm text-gray-700">{card.telephone}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(card.telephone, `${index}-phone`)}
                          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy phone"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Email */}
                    {card.email && (
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                          <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">{card.email}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(card.email, `${index}-email`)}
                          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                          title="Copy email"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactCardBlock;
