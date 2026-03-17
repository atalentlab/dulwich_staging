import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventTimeline from '../components/EventTimeline';

function EventsPage() {
  // Mock data for header - you can pass actual props
  const [selectedSchool, setSelectedSchool] = React.useState('Dulwich College International');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = React.useState('');
  const [availableSchools, setAvailableSchools] = React.useState([]);
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Header
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#9E1422] via-[#D30013] to-[#9E1422] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            School Events & Activities
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover the vibrant community life at Dulwich College through our diverse calendar of events,
            from academic showcases to cultural celebrations and sporting competitions.
          </p>
        </div>
      </div>

      {/* Event Timeline Section */}
      <EventTimeline />

      {/* Call to Action Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#333] mb-4">
            Want to Stay Updated?
          </h2>
          <p className="text-base lg:text-lg text-[#666] mb-8 max-w-2xl mx-auto">
            Subscribe to our events newsletter and never miss an important date or exciting activity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-[#D30013] focus:outline-none text-base transition-all duration-300"
            />
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#9E1422] to-[#D30013] text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        availableSchools={availableSchools}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </div>
  );
}

export default EventsPage;