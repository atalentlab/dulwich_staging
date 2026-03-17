import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample slides data - replace with your actual event images/data
  const slides = [
    {
      id: 1,
      title: 'Sports Day 2024',
      subtitle: 'Annual Athletic Competition',
      description: 'Join us for an exciting day of sports, teamwork, and celebration',
      image: '/images/sports-day.jpg',
      date: 'March 15, 2024',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 2,
      title: 'Art Exhibition',
      subtitle: 'Student Showcase',
      description: 'Discover the creative talents of our students',
      image: '/images/art-exhibition.jpg',
      date: 'April 20, 2024',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      id: 3,
      title: 'Science Fair',
      subtitle: 'Innovation & Discovery',
      description: 'Experience cutting-edge student research and experiments',
      image: '/images/science-fair.jpg',
      date: 'May 10, 2024',
      gradient: 'from-green-600 to-green-800'
    },
    {
      id: 4,
      title: 'Summer Concert',
      subtitle: 'Musical Performance',
      description: 'An evening of beautiful music by our talented students',
      image: '/images/concert.jpg',
      date: 'June 5, 2024',
      gradient: 'from-red-600 to-red-800'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              {/* Fallback gradient if image doesn't exist */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-90`}></div>

              {/* Image - uncomment when you have images */}
              {/* <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              /> */}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Date Badge */}
                  <div
                    className={`inline-block mb-4 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold transition-all duration-700 delay-100 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.date}
                  </div>

                  {/* Subtitle */}
                  <p
                    className={`text-white/90 text-base lg:text-lg font-medium mb-2 transition-all duration-700 delay-200 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  {/* Title */}
                  <h2
                    className={`text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight transition-all duration-700 delay-300 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p
                    className={`text-lg lg:text-xl text-white/80 mb-8 transition-all duration-700 delay-400 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    className={`px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: '500ms' }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 lg:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 lg:w-12 h-2 lg:h-2.5 bg-white'
                : 'w-2 lg:w-2.5 h-2 lg:h-2.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default EventSlider;