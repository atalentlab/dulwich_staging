import React from 'react';
import { Bird, Heart, BookOpen, Globe as GlobeIcon, Brain, GraduationCap, Maximize2, X } from 'lucide-react';
import DucksGirlsImage from '../assets/images/sg/DCSG_DUCKS_2 Girls.jpg';
import FoundingFamiliesImage from '../assets/images/sg/240605DCSGFoundingFamilies(Full)-65.jpg';
import JuniorSchoolImage from '../assets/images/sg/DCSL_JS_Student_Question_Hand.jpg';

function LiveWorldWiseOverlay({ expandedView, handleCloseExpandView, handleExpandView }) {
    if (!expandedView) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
            {/* Background Image with Blue Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{
                        backgroundImage: expandedView === 'live'
                            ? `url(${DucksGirlsImage})`
                            : expandedView === 'world'
                                ? `url(${JuniorSchoolImage})`
                                : `url(${FoundingFamiliesImage})`
                    }}
                >
                    {/* Dynamic Overlay based on expanded view - matching tag colors */}
                    {expandedView === 'live' && (
                        <>
                            <div className="absolute inset-0 bg-[#F5A623]/70 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#D4831A] to-[#F5A623]/60 opacity-80"></div>
                        </>
                    )}
                    {expandedView === 'world' && (
                        <>
                            <div className="absolute inset-0 bg-[#4A90E2]/75 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2E5C8A] to-[#4A90E2]/65 opacity-85"></div>
                        </>
                    )}
                    {expandedView === 'wise' && (
                        <>
                            <div className="absolute inset-0 bg-[#D30013]/75 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#9E1422] to-[#D30013]/65 opacity-85"></div>
                        </>
                    )}
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={handleCloseExpandView}
                className="absolute top-8 right-8 z-50 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#005580]/40 text-white hover:bg-[#005580]/60 transition-colors backdrop-blur-sm border border-white/20"
            >
                <Maximize2 className="w-4 h-4 rotate-180" />
                <span className="text-sm font-semibold">Close</span>
            </button>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
                {/* Dynamic Content */}
                {expandedView === 'live' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">
                            DUCKS
                        </h1>
                        <p className="text-[#8cd9ff] text-xl md:text-2xl font-bold tracking-wide uppercase">
                            Ages 2–7
                        </p>
                        <p className="text-white text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
                            Nurturing young minds in a safe and inspiring environment where every day is an adventure in learning.
                        </p>
                    </div>
                )}

                {expandedView === 'world' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">
                            Junior School
                        </h1>
                        <p className="text-[#8cd9ff] text-xl md:text-2xl font-bold tracking-wide uppercase">
                            Ages 7–11
                        </p>
                        <p className="text-white text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
                            Primary years where curiosity meets confidence through projects, reading, and collaborative exploration.
                        </p>
                    </div>
                )}

                {expandedView === 'wise' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">
                            Senior School
                        </h1>
                        <p className="text-[#8cd9ff] text-xl md:text-2xl font-bold tracking-wide uppercase">
                            Ages 11–18
                        </p>
                        <p className="text-white text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
                            Preparing students for university and beyond with academic excellence and holistic development.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="relative z-20 pb-12">
                <div className="flex justify-center items-center gap-4">
                    <div className="flex items-center bg-[#00334d]/60 backdrop-blur-md rounded-full p-1.5 border border-white/10">
                        <button
                            onClick={() => handleExpandView('live')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'live'
                                    ? 'bg-[#0099cc] text-white shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Bird className="w-5 h-5" />
                            <span className="font-bold tracking-wide">DUCKS</span>
                        </button>

                        <button
                            onClick={() => handleExpandView('world')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'world'
                                    ? 'bg-[#0099cc] text-white shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <BookOpen className="w-5 h-5" />
                            <span className="font-bold tracking-wide">Junior School</span>
                        </button>

                        <button
                            onClick={() => handleExpandView('wise')}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${expandedView === 'wise'
                                    ? 'bg-[#0099cc] text-white shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <GraduationCap className="w-5 h-5" />
                            <span className="font-bold tracking-wide">Senior School</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveWorldWiseOverlay;
