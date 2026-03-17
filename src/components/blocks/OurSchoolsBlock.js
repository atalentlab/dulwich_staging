import React from 'react';

/**
 * OurSchoolsBlock Component
 * Displays a showcase of schools in the network
 *
 * API Response:
 * {
 *   "type": "our-schools",
 *   "content": {
 *     "our-schools": "our-schools",
 *     "anchor-id": null
 *   }
 * }
 */
const OurSchoolsBlock = ({ content }) => {
  // Sample schools data (would typically come from API or props)
  const schools = [
    {
      name: 'Dulwich College Beijing',
      location: 'Beijing, China',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    },
    {
      name: 'Dulwich College Shanghai',
      location: 'Shanghai, China',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    },
    {
      name: 'Dulwich College Seoul',
      location: 'Seoul, South Korea',
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80',
    },
    {
      name: 'Dulwich College Singapore',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&q=80',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Schools</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dulwich College International operates a network of schools across Asia,
            providing world-class education to students from diverse backgrounds.
          </p>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {schools.map((school, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {school.name}
                </h3>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{school.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/schools"
            className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Explore All Schools
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurSchoolsBlock;
