import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import Globe from 'react-globe.gl';

function SchoolLocations({
  sectionRefs,
  isVisible,
  selectedLocation,
  setSelectedLocation,
  selectedSchool,
  setSelectedSchool,
  globeRef
}) {
  return (
    <section
      id="schools"
      ref={(el) => (sectionRefs.current['schools'] = el)}
      className="min-h-screen bg-[#1a1a1a]"
    >
      <div className="container mx-auto py-8 xs:py-10 sm:py-12 px-4 xs:px-6 sm:px-8">
        <Tabs.Root
          defaultValue="locations"
          orientation="horizontal"
          className="flex flex-col gap-2 xs:gap-3"
        >
          {/* Tabs List */}
          <Tabs.List
            className="bg-[#2a2a2a] text-gray-400 inline-flex h-8 xs:h-9 w-fit items-center justify-center rounded-lg p-[3px]"
            aria-orientation="horizontal"
          >
            <Tabs.Trigger
              value="locations"
              className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1 xs:gap-1.5 rounded-md border border-transparent px-2 xs:px-3 py-1 text-xs xs:text-sm font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm"
            >
              School Locations
            </Tabs.Trigger>
            <Tabs.Trigger
              value="university"
              className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1 xs:gap-1.5 rounded-md border border-transparent px-2 xs:px-3 py-1 text-xs xs:text-sm font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm"
            >
              University Destinations
            </Tabs.Trigger>
          </Tabs.List>

          {/* Tabs Content */}
          <Tabs.Content value="locations" className="flex-1 outline-none">
            <section className="bg-[#1a1a1a] py-6 xs:py-8 sm:py-10 md:py-12">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 items-start">
                  {/* Interactive 3D Globe */}
                  <div className="flex items-center justify-center min-h-[350px] xs:min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[680px]">
                    <div
                      className="globe-container rounded-full shadow-2xl cursor-grab active:cursor-grabbing select-none relative"
                      style={{
                        width: typeof window !== 'undefined' ? `${Math.min(window.innerWidth < 1330 ? window.innerWidth * 0.85 : 680, 680)}px` : '880px',
                        height: typeof window !== 'undefined' ? `${Math.min(window.innerWidth < 1330 ? window.innerWidth * 0.85 : 680, 680)}px` : '880px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <Globe
                        ref={globeRef}
                        globeImageUrl={null}
                        backgroundImageUrl={null}
                        lineHoverPrecision={0}
                        polygonsData={[]}
                        pointsData={[
                          { lat: 31.2304, lng: 121.4737, name: 'Shanghai' },
                          { lat: 39.9042, lng: 116.4074, name: 'Beijing' },
                          { lat: 31.2989, lng: 120.5853, name: 'Suzhou' },
                          { lat: 22.2707, lng: 113.5767, name: 'Zhuhai' },
                          { lat: 37.5665, lng: 126.9780, name: 'Seoul' },
                          { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
                        ]}
                        pointColor={(d) => d.name === selectedLocation ? '#DC2626' : '#DC2626'}
                        pointRadius={(d) => d.name === selectedLocation ? 0.7 : 0.4}
                        pointResolution={2}
                        pointLabel={({ name }) => name}
                        onPointClick={(point) => {
                          setSelectedLocation(point.name);
                          // Center globe on clicked location
                          if (globeRef.current) {
                            globeRef.current.pointOfView({
                              lat: point.lat,
                              lng: point.lng,
                              altitude: 2
                            }, 1000);
                          }
                        }}
                        ringsData={(() => {
                          const locations = {
                            'Shanghai': { lat: 31.2304, lng: 121.4737 },
                            'Beijing': { lat: 39.9042, lng: 116.4074 },
                            'Suzhou': { lat: 31.2989, lng: 120.5853 },
                            'Zhuhai': { lat: 22.2707, lng: 113.5767 },
                            'Seoul': { lat: 37.5665, lng: 126.9780 },
                            'Singapore': { lat: 1.3521, lng: 103.8198 },
                          };
                          const selected = locations[selectedLocation];
                          return selected ? [{
                            ...selected,
                            maxRadius: 2,
                            propagationSpeed: 0.3,
                            repeatPeriod: 1000
                          }] : [];
                        })()}
                        ringColor={() => '#DC2626'}
                        ringMaxRadius="maxRadius"
                        ringPropagationSpeed="propagationSpeed"
                        ringRepeatPeriod="repeatPeriod"
                        showAtmosphere={false}
                        globeMaterial={{
                          color: '#ffffff',
                          emissive: '#f5f5f5',
                          emissiveIntensity: 0.05,
                          wireframe: true,
                          transparent: true,
                          opacity: 0.3,
                        }}
                        showGraticules={true}
                        graticuleColor="#666666"
                        globeCloudsOpacity={0}
                        enablePointerInteraction={true}
                        backgroundColor="rgba(26, 26, 26, 0)"
                        width={typeof window !== 'undefined' ? Math.min(window.innerWidth < 1330 ? window.innerWidth * 0.85 : 680, 680) : 680}
                        height={typeof window !== 'undefined' ? Math.min(window.innerWidth < 1330 ? window.innerWidth * 0.85 : 680, 680) : 680}
                        animateIn={true}
                      />
                    </div>
                  </div>

                  {/* School Info Card */}
                  <div className="bg-white flex flex-col gap-4 xs:gap-5 sm:gap-6 py-4 xs:py-5 sm:py-6 shadow-sm rounded-2xl xs:rounded-3xl border border-black/10">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4 xs:px-5 sm:px-6">
                      <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Dulwich College {selectedLocation}
                      </div>
                      <div className="text-xs xs:text-sm text-black/60">Default to nearest school</div>
                    </div>

                    <div className="px-4 xs:px-5 sm:px-6">
                      {/* Placeholder for school image */}
                      <div className="rounded-xl xs:rounded-2xl border border-black/10 h-32 xs:h-36 sm:h-40 mb-4 xs:mb-5 sm:mb-6"></div>

                      <div className="text-sm xs:text-base text-black/70 mb-4 xs:mb-5 sm:mb-6 text-left">
                        {selectedLocation}, {
                          selectedLocation === 'Seoul' ? 'South Korea' :
                          selectedLocation === 'Singapore' ? 'Singapore' : 'China'
                        }
                      </div>

                      <div className="space-y-2 text-xs xs:text-sm sm:text-[15px] text-black/80 mb-4 xs:mb-5 sm:mb-6 text-left">
                        <div>• World-class academics with holistic learning.</div>
                        <div>• International community and modern facilities.</div>
                        <div>• Book a visit or contact admissions.</div>
                      </div>

                      {/* Location Buttons */}
                      <div className="grid grid-cols-2 gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
                        {[
                          { country: 'China', city: 'Shanghai' },
                          { country: 'China', city: 'Beijing' },
                          { country: 'China', city: 'Suzhou' },
                          { country: 'China', city: 'Zhuhai' },
                          { country: 'South Korea', city: 'Seoul' },
                          { country: 'Singapore', city: 'Singapore' },
                        ].map((location, index) => {
                          const isActive = location.city === selectedLocation;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedLocation(location.city);
                                // Center globe on selected location
                                if (globeRef.current) {
                                  const locationData = [
                                    { lat: 31.2304, lng: 121.4737, name: 'Shanghai' },
                                    { lat: 39.9042, lng: 116.4074, name: 'Beijing' },
                                    { lat: 31.2989, lng: 120.5853, name: 'Suzhou' },
                                    { lat: 22.2707, lng: 113.5767, name: 'Zhuhai' },
                                    { lat: 37.5665, lng: 126.9780, name: 'Seoul' },
                                    { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
                                  ].find(loc => loc.name === location.city);
                                  if (locationData) {
                                    globeRef.current.pointOfView({
                                      lat: locationData.lat,
                                      lng: locationData.lng,
                                      altitude: 2
                                    }, 1000);
                                  }
                                }
                              }}
                              className={`text-left rounded-lg xs:rounded-xl border px-2 xs:px-3 py-1.5 xs:py-2 transition ${
                                isActive
                                  ? 'border-[#DC2626] bg-[#f1eaea]'
                                  : 'border-black/10 hover:border-black/30'
                              }`}
                            >
                              <div className="text-[11px] xs:text-[13px] text-black/60">{location.country}</div>
                              <div className="text-sm xs:text-base font-semibold">{location.city}</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                        <button
                          onClick={() => {
                            if (globeRef.current) {
                              const locationData = [
                                { lat: 31.2304, lng: 121.4737, name: 'Shanghai' },
                                { lat: 39.9042, lng: 116.4074, name: 'Beijing' },
                                { lat: 31.2989, lng: 120.5853, name: 'Suzhou' },
                                { lat: 22.2707, lng: 113.5767, name: 'Zhuhai' },
                                { lat: 37.5665, lng: 126.9780, name: 'Seoul' },
                                { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
                              ].find(loc => loc.name === selectedLocation);
                              if (locationData) {
                                globeRef.current.pointOfView({
                                  lat: locationData.lat,
                                  lng: locationData.lng,
                                  altitude: 2
                                }, 1000);
                              }
                            }
                          }}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm xs:text-base md:text-md font-normal transition-all cursor-pointer bg-gray-200 text-gray-900 hover:bg-gray-300 h-9 xs:h-10 md:h-11 px-3 xs:px-4 py-2 w-full xs:w-auto"
                        >
                          Re-center
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm xs:text-base md:text-md font-normal transition-all cursor-pointer text-white h-9 xs:h-10 md:h-11 px-3 xs:px-4 py-2 bg-[#111] hover:bg-black w-full xs:w-auto">
                          Contact Admissions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Tabs.Content>

          <Tabs.Content value="university" className="flex-1 outline-none">
            <section className="bg-[#e7d7b7] py-6 xs:py-8 sm:py-10 md:py-12">
              <div className="container mx-auto px-4 xs:px-6 sm:px-8">
                <div className="text-center py-12 xs:py-16 sm:py-20">
                  <p className="text-base xs:text-lg text-gray-600">University Destinations content coming soon...</p>
                </div>
              </div>
            </section>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  );
}

export default SchoolLocations;
