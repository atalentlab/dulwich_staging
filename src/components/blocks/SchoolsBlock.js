import React from 'react';

/**
 * Schools Block Component
 * Displays school locations in a grid
 */
const SchoolsBlock = ({ content }) => {
  const { heading, schools } = content;

  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">
                  {school.name}
                </h3>
                <p className="text-gray-600 mb-2">{school.location}</p>
                <p className="text-sm text-gray-500">
                  Established: {school.established}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolsBlock;
