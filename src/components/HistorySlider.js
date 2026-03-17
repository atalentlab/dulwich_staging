import React, { useRef } from 'react';
import Slider from 'react-slick';
import '../styles/HistorySlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import images from assets folder
import FoundingFamilies from '../assets/images/sg/240605DCSGFoundingFamilies(Full)-65.jpg';
import Campus from '../assets/images/sg/AO0T3146.jpg';
import DucksGeography from '../assets/images/sg/DCSG__DUCKS_Geography.jpg';
import DucksGirls from '../assets/images/sg/DCSG_DUCKS_2 Girls.jpg';
import StudentQuestion from '../assets/images/sg/DCSL_JS_Student_Question_Hand.jpg';
import DucksBoy from '../assets/images/sg/DUCKS boy.jpg';
import Leadership from '../assets/images/sg/Leadership1.jpg';
import IcoStar from '../assets/images/ico-star2.svg';

/**
 * HistorySlider Component
 * Displays a slider showcasing Dulwich's history with images and descriptions
 * Navigation is via buttons and dots only - does not interfere with page scroll
 */
const HistorySlider = (content) => {
  const sliderRef = useRef(null);
  console.log('HistorySlider content:', content);

  console.log('Rendering HistorySlider component');

  // Custom Arrow Components
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="history-arrow history-arrow-next"
      aria-label="Next slide"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="history-arrow history-arrow-prev"
      aria-label="Previous slide"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );

  // Slides data with quotes and images
  const slides = [
    {
      id: 1,
      type: 'quote',
      quote: 'As first-time international school parents, we had so many questions. The tour guide answered every single one with patience, not scripts. That warm authenticity sealed the deal for us.',
      author: 'David',
      role: 'Year 4 Parent',
      bgColor: '#0ea5e9'
    },
    {
      id: 2,
      type: 'image',
      image: FoundingFamilies,
      quote: 'My children have thrived academically and socially in an environment that truly values each student.',
      author: 'Sarah Chen',
      role: 'Parent, Year 5'
    },
    {
      id: 3,
      type: 'quote',
      quote: 'We visited three schools in two weeks. Dulwich was the only place where the students we met spoke genuinely about their learning, not just achievements.',
      author: 'Priya',
      role: 'Year 9 Parent',
      bgColor: '#D30013'
    },
    {
      id: 4,
      type: 'image',
      image: Campus,
      quote: 'The facilities are world-class, but it\'s the passionate teachers who make the real difference.',
      author: 'Michael Thompson',
      role: 'Parent, Year 9'
    },
    {
      id: 5,
      type: 'image',
      image: DucksGirls,
      quote: 'Watching my daughter discover her love for learning has been the greatest joy.',
      author: 'Emma Wilson',
      role: 'DUCKS Parent'
    },
    {
      id: 6,
      type: 'quote',
      quote: 'DCSZ provided a holistic environment where intellectual curiosity and global perspectives were constantly encouraged.',
      author: 'Ryan G',
      role: '2025 Graduate',
      bgColor: '#0ea5e9'
    },
    {
      id: 7,
      type: 'image',
      image: StudentQuestion,
      quote: 'It\'s probably the most nervous I\'ve ever been. But I absolutely loved the experience.',
      author: 'Richard',
      role: 'Year 11'
    },
    {
      id: 8,
      type: 'quote',
      quote: 'Every student has the potential for a fire within them—a spark of curiosity and enthusiasm waiting to be ignited.',
      author: 'Betty Lutterodt',
      role: 'Deputy Head of Senior School',
      bgColor: '#D30013'
    },
    {
      id: 9,
      type: 'image',
      image: DucksBoy,
      quote: 'Every day brings new adventures and opportunities to learn through play.',
      author: 'James Anderson',
      role: 'Year 3 Parent'
    },
    {
      id: 10,
      type: 'image',
      image: Leadership,
      quote: 'The leadership opportunities helped me discover strengths I never knew I had.',
      author: 'Sophie Zhang',
      role: 'Year 12 Student'
    }
  ];

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '60px',
    variableWidth: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <button>
        <div className="history-dot-bar"></div>
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px',
          variableWidth: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
          variableWidth: true,
        }
      }
    ]
  };

  return (
    <div className="history-slider">
      <div className="history-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="history-slide-wrapper">
              {slide.type === 'quote' ? (
                <div
                  className="history-quote-card"
                  style={{
                    backgroundColor: slide.bgColor,
                    backgroundImage: `url(${IcoStar})`,
                    backgroundPosition: '155% bottom',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '80%'
                  }}
                >
                  {/* Quote Content */}
                  <div className="quote-content text-left">
                    {/* Quote Mark */}
                    <div className="quote-mark text-left">"</div>

                    {/* Quote Text */}
                    <p className="quote-text">{slide.quote}</p>

                    {/* Author Info */}
                    <div className="quote-author">
                      <p className="author-name">{slide.author}</p>
                      <p className="author-role">{slide.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="history-slide">
                  <div className="history-slide-image">
                    <img src={slide.image} alt={slide.author} />
                    {/* Gradient Overlay */}
                    <div className="history-slide-overlay"></div>
                    {/* Content Overlaid on Image */}
                    {slide.quote && (
                      <div className="history-slide-content">
                        <p className="history-slide-quote">{slide.quote}</p>
                        <p className="history-slide-author">{slide.author}</p>
                        {slide.role && (
                          <p className="history-slide-role">{slide.role}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HistorySlider;
