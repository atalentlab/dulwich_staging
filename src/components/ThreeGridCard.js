import React from 'react';

const ThreeGridCard = () => {
  const cards = [
    {
      id: 1,
      image: 'https://dulwich-eimstaging.oss-cn-shanghai.aliyunc…600x324/26c8ca7b-5750-401c-a90a-28c134d63c71.jpeg',
      title: 'Book a Personal Campus Visit',
      description: 'Schedule a private tour with our admissions team. See our facilities, meet teachers, and ask questions.',
      buttonText: 'Book a Tour',
      buttonLink: '/admissions/book-tour'
    },
    {
      id: 2,
      image: 'https://dulwich-eimstaging.oss-cn-shanghai.aliyunc…600x324/8fb883c3-194b-4b45-bdab-a2e758c5ecea.jpeg',
      title: 'Attend an Open Day',
      description: 'Join us for a comprehensive introduction to Dulwich. Meet current families and experience our community.',
      buttonText: 'View Open Days',
      buttonLink: '/admissions/open-days'
    },
    {
      id: 3,
      image: 'https://dulwich-eimstaging.oss-cn-shanghai.aliyunc…/thumbs/articles/fit/600x324/cover-graduation.jpg',
      title: 'Take a Virtual Tour',
      description: 'Can\'t visit in person yet? Take an in-depth virtual tour of our campus and facilities.',
      buttonText: 'Start Tour',
      buttonLink: '/admissions/virtual-tour'
    }
  ];

  return (
    <section className="py-6 px-6 md:px-12 lg:px-16">
      <div className="max-w-[1120px] mx-auto">
        {/* Header Section */}
        <div className="max-w-[1120px] mx-auto text-left">
          <p
            className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] mb-3"
            style={{
              color: '#3A5A6C',
              letterSpacing: '2.4px'
            }}
          >
            STEP 1: EXPERIENCE DULWICH
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-[56px] font-bold mb-5 leading-tight"
            style={{
              color: '#5A4A5C',
              lineHeight: '1.2'
            }}
          >
            Come and visit us
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{
              color: '#3A5A6C',
              lineHeight: '1.6'
            }}
          >
            The best way to know if Dulwich is right for your family is to experience our campus and community firsthand.
          </p>
          <br/>
        </div>

        {/* Three Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col"
              style={{
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {/* Card Image */}
              <div className="h-[280px] overflow-hidden bg-gray-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop' + encodeURIComponent(card.title);
                  }}
                />
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow text-left">
                <h3
                  className="text-xl md:text-2xl font-bold mb-4 leading-tight"
                  style={{
                    color: '#2C4A5C',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm md:text-base mb-8 flex-grow leading-relaxed"
                  style={{
                    color: '#5A6C7C',
                    lineHeight: '1.7'
                  }}
                >
                  {card.description}
                </p>

                {/* Card Button */}
                <a
                  href={card.buttonLink}
                  className="inline-block px-7 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 text-center border-2 self-start"
                  style={{
                    color: '#D30013',
                    borderColor: '#D30013',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D30013';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D30013';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {card.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeGridCard;
