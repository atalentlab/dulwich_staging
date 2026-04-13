import React, { useEffect, useMemo } from 'react';

/**
 * MapBlock Component
 *
 * - bing_lat & bing_long → AMap (Gaode Maps)
 *     With REACT_APP_AMAP_KEY → interactive embedded map
 *     Without key → "Open in AMap" button
 * - google_lat & google_long → Google Maps iframe
 */

const AMAP_KEY = process.env.REACT_APP_AMAP_KEY || '';

// ── Location pin icon ──
function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// ── AMap View (works without API key using embed URL) ──
function AMapView({ lat, lng }) {
  const amapLink = `https://uri.amap.com/marker?position=${lng},${lat}&name=Location`;

  // AMap embed iframe — no API key needed
  const embedSrc = `https://m.amap.com/navi/?dest=${lng},${lat}&destName=Location&key=`;

  // If AMAP_KEY exists, use JS API for richer map; otherwise use simple embed
  const iframeSrc = useMemo(() => {
    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
html,body,#map{margin:0;padding:0;width:100%;height:100%}
.amap-logo,.amap-copyright{display:none!important}
</style>
${AMAP_KEY
  ? `<script src="https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}"><\/script>`
  : `<script src="https://webapi.amap.com/maps?v=2.0&key=your_key_here"><\/script>`
}
</head><body>
<div id="map"></div>
<script>
try{
  var map=new AMap.Map('map',{
    zoom:15,
    center:[${parseFloat(lng)},${parseFloat(lat)}],
    showIndoorMap:false,
    resizeEnable:true,
    touchZoom:false,
    scrollWheel:false,
    doubleClickZoom:false,
    keyboardEnable:false,
    dragEnable:false
  });
  new AMap.Marker({position:[${parseFloat(lng)},${parseFloat(lat)}],map:map});
}catch(e){}
<\/script>
</body></html>`;
    return URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  }, [lat, lng]);

  // Cleanup blob URL
  useEffect(() => {
    return () => { if (iframeSrc) URL.revokeObjectURL(iframeSrc); };
  }, [iframeSrc]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1370px] mx-auto">
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
          <a
            href={amapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-t-2xl overflow-hidden cursor-pointer"
            style={{ height: '450px' }}
          >
            {AMAP_KEY ? (
              <>
                <iframe
                  title="AMap"
                  src={iframeSrc}
                  width="100%"
                  height="450"
                  style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 z-10" />
              </>
            ) : (
              <>
                {/* Fallback: use Google Maps embed with AMap coordinates */}
                <iframe
                  title="Map"
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                  style={{
                    border: 0,
                    display: 'block',
                    pointerEvents: 'none',
                    width: 'calc(100% + 100px)',
                    height: '690px',
                    marginTop: '-110px',
                    marginLeft: '-40px',
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 z-10" />
              </>
            )}
          </a>
          <div className="px-6 py-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-b-2xl">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Coordinates:</span> {lat}, {lng}
            </div>
            <a
              href={amapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9e1422] text-white font-semibold rounded-lg hover:bg-[#7f1019] transition-colors text-sm"
            >
              <LocationIcon />
              Open in AMap
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Google Maps View (static image, no controls) ──
function GoogleMapView({ lat, lng }) {
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const staticMapKey = process.env.REACT_APP_GOOGLE_MAPS_KEY || '';

  // Static image URL — if API key exists use Static Maps API, otherwise use embed with controls hidden
  const staticMapSrc = staticMapKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=1370x450&scale=2&markers=color:red%7C${lat},${lng}&key=${staticMapKey}`
    : null;

  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1370px] mx-auto">
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
          {/* Map area — click opens Google Maps */}
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-t-2xl overflow-hidden cursor-pointer"
            style={{ height: '450px' }}
          >
            {staticMapSrc ? (
              <img
                src={staticMapSrc}
                alt={`Map location at ${lat}, ${lng}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <>
                {/* Iframe is oversized and shifted to crop out top info box and bottom controls */}
                <iframe
                  title="Google Maps"
                  src={embedSrc}
                  style={{
                    border: 0,
                    display: 'block',
                    pointerEvents: 'none',
                    width: 'calc(100% + 100px)',
                    height: '690px',
                    marginTop: '-110px',
                    marginLeft: '-40px',
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Overlay to block all iframe interactions */}
                <div className="absolute inset-0 z-10" />
              </>
            )}
          </a>
          <div className="px-6 py-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-b-2xl">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Coordinates:</span> {lat}, {lng}
            </div>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9e1422] text-white font-semibold rounded-lg hover:bg-[#7f1019] transition-colors text-sm"
            >
              <LocationIcon />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main MapBlock ──
const MapBlock = ({ content }) => {
  const {
    google_lat: googleLat,
    google_long: googleLong,
    bing_lat: bingLat,
    bing_long: bingLong,
  } = content || {};

  const hasBing = bingLat && bingLong;
  const hasGoogle = googleLat && googleLong;

  if (hasBing) {
    return <AMapView lat={bingLat} lng={bingLong} />;
  }

  if (hasGoogle) {
    return <GoogleMapView lat={googleLat} lng={googleLong} />;
  }

  return null;
};

export default MapBlock;
