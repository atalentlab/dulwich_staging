import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import '../../styles/HistorySlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import IcoStar from '../../assets/images/ico-star2.svg';
import Icon from '../Icon';
const EASE = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // used only for snap-back

const CollectionBlock = ({ content }) => {
  const location = useLocation();
  const isChineseVersion = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const sliderRef    = useRef(null);
  const containerRef = useRef(null);
  const drag         = useRef({ active: false });
  const [isDragging,    setIsDragging]    = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ── Drag core — same pattern as LiveWorldView.js ────────────────────────
  const beginDrag = (e) => {
    if (e.target.closest('button')) return; // let prev/next arrows work normally
    const track = containerRef.current?.querySelector('.slick-track');
    if (!track || !containerRef.current) return;
    const matrix = new DOMMatrix(window.getComputedStyle(track).transform);
    track.style.transition = 'none';
    drag.current = {
      active:     true,
      startX:     e.clientX,
      baseOffset: matrix.m41,
      offsetPx:   0,
      velX:       0,
      lastX:      e.clientX,
      lastT:      Date.now(),
      track,
      W: containerRef.current.offsetWidth,
    };
    setIsDragging(true);
  };

  const moveDrag = (clientX) => {
    if (!drag.current.active || !drag.current.track) return;
    const now = Date.now();
    const dt  = now - drag.current.lastT || 1;
    drag.current.velX     = (clientX - drag.current.lastX) / dt;
    drag.current.lastX    = clientX;
    drag.current.lastT    = now;
    drag.current.offsetPx = clientX - drag.current.startX;
    // 1:1 cursor tracking — no damping, just like LiveWorldView
    drag.current.track.style.transform =
      `translate3d(${drag.current.baseOffset + drag.current.offsetPx}px, 0, 0)`;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);

    const { W, offsetPx, velX, track, baseOffset } = drag.current;
    const threshold = W * 0.2;           // 20% of container width — same as LiveWorldView
    const momentum  = velX * 150;
    const total     = offsetPx + momentum;

    if (total < -threshold) {
      // Slide left → next: set ease so browser animates from drag pos to slick's target
      if (track) track.style.transition = EASE;
      sliderRef.current?.slickNext();
    } else if (total > threshold) {
      // Slide right → prev
      if (track) track.style.transition = EASE;
      sliderRef.current?.slickPrev();
    } else {
      // Not enough — spring back to origin
      if (track) {
        track.style.transition = EASE;
        track.style.transform  = `translate3d(${baseOffset}px, 0, 0)`;
        setTimeout(() => {
          if (drag.current.track) {
            drag.current.track.style.transition = '';
            drag.current.track.style.transform  = '';
          }
        }, 460);
      }
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => moveDrag(e.clientX);
    const onUp   = ()  => endDrag();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  const collectionItems = Array.isArray(content) ? content : [content];

  console.log('CollectionBlock items:', collectionItems);

  const slides = collectionItems.map((item, index) => {
    const itemType = item['item-type'] || 'image';

    switch (itemType) {
      case 'quote_card':
        return {
          id: index,
          type: 'quote',
          quote: item.quotetext || '',
          author: item.author || '',
          role: '',
          bgColor: getBgColor(item.backgroundtheme),
          position: item.bg_style || 'bottom-right',
        };

      case 'staff_quote':
        return {
          id: index,
          type: 'staff_quote',
          quote: item.sq_quotetext || '',
          author: item.author_name || '',
          role: item.author_role || '',
          authorImage: item.authorimage || null,
          bgColor: getBgColor(item.sq_backgroundtheme),
        };

      case 'story_card':
        return {
          id: index,
          type: 'story',
          title: item.sc_title || '',
          image: item.sc_image || null,
          description: item.description || '',
          buttonText: item.button_text || '',
          buttonUrl: item.button_url || '',
        };

      case 'image':
      default:
        return {
          id: index,
          type: 'image',
          image: item.image || null,
          title: item.title || '',
          subtitle: item.subtitle || '',
          author: item.img_author || '',
          bgColor: item.bg_color ? getBgColor(item.bg_color) : null,
          hasOverlay: !!(item.bg_color && item.bg_color.trim()),
        };
    }
  });

  function getBgColor(colorName) {
    const colorMap = {
      blue: '#009ED0',
      red: '#D30013',
      yellow: '#FFB909',
      dulwich_red :'#9E1422',
    };
    return colorMap[colorName] || colorName || '#0ea5e9';
  }

  function getBgPosition(position) {
    const positionMap = {
      'top-left': '-55% -30%',
      'top-right': '155% -30%',
      'bottom-left': '-55% 100%',
      'bottom-right': '165% 120%',
    };
    return positionMap[position] || '155% 100%';
  }

  const NextArrow = ({ onClick }) => (
    <button onClick={onClick} className="history-arrow history-arrow-next" aria-label="Next slide">
      <Icon icon="Icon-Chevron-small" size={24} style={{ transform: 'rotate(270deg)' }}/>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="history-arrow history-arrow-prev" aria-label="Previous slide">
      <Icon icon="Icon-Chevron-small" size={24} style={{ transform: 'rotate(90deg)' }} />
    </button>
  );

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    cssEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
    useTransform: true,
    draggable: false,
    swipe: true,
    swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: true,
    afterChange: (i) => setCurrentSlide(i),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
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
          centerMode: false,
          variableWidth: true,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: true,
          dots: false,
          arrows: false,
        }
      }
    ]
  };

  if (slides.length === 0) return null;

  return (
    <div className="history-slider">
      <style>{`
        @media (max-width: 767px)  { .history-arrow        { display: none !important; } }
        @media (min-width: 768px)  { .collection-mobile-nav { display: none !important; } }
      `}</style>
      {/* Title section with max-width 1120px */}
      {content[0]?.section_title && (
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222]">
            {content[0].section_title}
          </h2>
        </div>
      )}

      {/* Slider section - full width without max-width constraint */}
      <div className="history-slider-container">
        <div ref={containerRef} style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }} onMouseDown={beginDrag}>
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="history-slide-wrapper">

              {/* Quote Card */}
              {slide.type === 'quote' ? (
                <div
                  className="quote-card-overlay w-[300px] h-[420px] md:w-[340px] md:h-[450px] lg:w-[300px] lg:h-[480px] xl:w-[424px] xl:h-[528px] relative rounded-lg py-[30px] px-[25px] md:py-[35px] md:px-[30px] lg:py-10 lg:px-[35px] xl:py-[50px] xl:px-10 flex flex-col justify-between overflow-hidden"
                  style={{
                    backgroundColor: slide.bgColor,
                    backgroundImage: `url(${IcoStar})`,
                    backgroundPosition: getBgPosition(slide.position),
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '80%'
                  }}
                >
                  <div className="relative z-10 flex flex-col h-full text-left">
                    <div className="font-['Figtree'] text-[#fff] font-light text-left opacity-100

  text-[96px] leading-[110px]        /* mobile */
  sm:text-[160px] sm:leading-[900px] /* tablet */
  md:text-[200px] md:leading-[120px] /* small desktop */
  lg:text-[232px] lg:leading-[156px] /* your design size */"
                     
                    >
                      “
                    </div>
                    <p className="absolute top-[70px] 
  w-[280px] md:w-[290px] lg:w-[260px] xl:w-[333px] 
  min-h-[220px] md:min-h-[240px] xl:min-h-[282px] 

  text-[16px] sm:text-[16px] md:text-[16px]
  lg:text-[20px] xl:text-[26px] 2xl:text-[30px]

  leading-[1.35]
  text-[#FDFCF8] font-normal 
  line-clamp-5 overflow-hidden text-ellipsis">

                      {slide.quote}
                    </p>
                    <div className="mt-6 md:mt-[30px] xl:mt-10 absolute bottom-[0px]">
                      <p className="text-[16px] md:text-base lg:text-[17px] xl:text-lg font-bold text-white mb-1">
                        {slide.author}
                      </p>
                      {slide.role && (
                        <p className="text-[14px] md:text-sm lg:text-[15px] xl:text-base font-normal text-white/90">
                          {slide.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              /* Staff Quote Card */
              ) : slide.type === 'staff_quote' ? (
                <div className="bg-[#FFFFFF] w-[300px] h-[420px] md:w-[340px] md:h-[450px] lg:w-[300px] lg:h-[480px] xl:w-[424px] xl:h-[528px] rounded-lg py-[25px] px-5 md:py-[30px] md:px-[25px] lg:py-[35px] lg:px-[30px] xl:py-[45px] xl:px-10 border flex flex-col items-start shadow-md">
                  {slide.authorImage && (
                    <div
                      className="w-[65px] h-[65px] md:w-[70px] md:h-[70px] lg:w-[75px] lg:h-[75px] xl:w-[90px] xl:h-[90px] rounded-full border-4 overflow-hidden mb-7 shrink-0"
                      style={{ borderColor: slide.bgColor || '#D30013' }}
                    >
                      <img
                        src={slide.authorImage}
                        alt={slide.author}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  )}
             <p className="
                text-[15px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[20px] 2xl:text-[22px]
                leading-[22px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] xl:leading-[30px] 2xl:leading-[32px]
                text-left text-[#3C3737] font-normal mb-auto
              ">
                    {slide.quote}
                  </p>
                  <div className="mt-8">
                    <p className="text-base text-left font-normal text-[#3C3737}">
                      {slide.author}
                    </p>
                    {slide.role && (
                      <p className="text-base text-left font-normal text-[#3C3737}">
                        {slide.role}
                      </p>
                    )}
                  </div>
                </div>

              /* Story Card */
              ) : slide.type === 'story' ? (
                <div className="bg-white w-[300px] h-[440px] md:w-[340px] md:h-[450px] lg:w-[300px] lg:h-[480px] xl:w-[424px] xl:h-[528px] rounded-lg overflow-hidden flex flex-col items-start shadow-md">
                  {slide.image && (
                    <div className="w-full h-[170px] md:h-[190px] lg:h-[100px] 2xl:h-[200px] xl:h-[240px] overflow-hidden shrink-0">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  )}
                  <div className="pt-[18px] px-5 pb-[22px] md:pt-5 md:px-[22px] md:pb-[25px] lg:pt-[22px] lg:px-6 lg:pb-7 xl:pt-7 xl:px-[30px] xl:pb-[35px] flex flex-col flex-1 items-start">
                    <h3 className="text-[20px] text-left md:text-[1.1rem] lg:text-[1.15rem] xl:text-[1.3rem] font-bold text-[#3C3737] mb-3 leading-[1.35]">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-[16px] leading-[22px] md:text-[0.9rem] text-left xl:text-[0.95rem] font-normal text-[#3C3737] mb-5">
                        {slide.description}
                      </p>
                    )}
                    {slide.buttonText && slide.buttonUrl && (
                      <a
                        href={slide.buttonUrl}
                        className="mt-auto inline-block w-fit border border-[#D30013] text-[#D30013] text-[12px] xl:text-[0.95rem] py-2 px-[22px] xl:py-2.5 xl:px-5 rounded no-underline transition-all duration-200 hover:bg-[#D30013] hover:text-white"
                      >
                        {isChineseVersion && slide.buttonText?.toLowerCase() === 'read more' ? '阅读更多' : slide.buttonText}
                      </a>
                    )}
                  </div>
                </div>

              /* Image Card */
              ) : slide.hasOverlay && slide.bgColor ? (
                /* Image with colored text box overlay */
                <div className="bg-transparent rounded-lg overflow-hidden flex flex-col" style={{ width: '100%', minWidth: '280px', maxWidth: '900px' }}>
                  <div className="relative overflow-hidden shrink-0 rounded-lg" style={{ width: '100%' }}>
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="flex h-[460px] md:h-[426px] lg:h-[420px] xl:h-[524px] rounded-lg"
                        style={{ width: 'auto', maxWidth: 'unset'}}
                      />
                    )}
                    {/* Colored text overlay box */}
                    {(slide.title || slide.subtitle || slide.img_author) && (
                      <div
                        className="absolute text-left left-6 md:left-8 lg:left-10 bottom-6 md:bottom-8 lg:bottom-10 max-w-[70%] rounded-lg p-5 md:p-6 lg:p-6"
                        style={{ backgroundColor: slide.bgColor }}
                      >
                        {slide.title && (
                          <p className="text-[12px] md:text-base font-normal text-white/95 mb-1 leading-tight">
                            {slide.title}
                          </p>
                        )}
                        {slide.subtitle && (
                          <p className="text-[12px] md:text-base font-normal text-white/95">
                            {slide.subtitle}
                          </p>
                        )}
                             {slide.author && (
                          <p className="text-[0.85rem] md:text-[0.88rem] lg:text-[12px] xl:text-[0.95rem] mt-1 font-semibold text-white/95 leading-[1.8]">
                            {slide.author}
                          </p>
                           )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Regular image card (no overlay) */
                <div className="bg-transparent overflow-hidden flex flex-col rounded-lg" style={{ width: 'auto', display: 'inline-block' }}>
                  <div className="relative overflow-hidden shrink-0 rounded-lg" style={{ borderRadius: '8px' }}>
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="block h-[460px] lg:h-[500px] lg:bg-cover xl:h-[524px] min-[1800px]:h-[578px] rounded-lg object-cover"
                        style={{ width: 'auto', maxWidth: 'unset' , borderRadius: '8px'}}
                      />
                    )}
                  </div>
                  {(slide.title || slide.subtitle || slide.img_author) && (
                    <div className="py-4 px-5 text-left w-[90%]">
                      <p className="text-sm md:text-[0.95rem] lg:text-[14px] xl:text-[1.05rem] font-semibold text-[#3C3737] leading-tight">
                        {slide.title}
                      </p>
                      {slide.subtitle && (
                        <p className="text-[0.85rem] md:text-[0.88rem] lg:text-[14px] xl:text-[0.95rem] font-semibold text-[#3C3737]">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.author && (
                        <p className="text-[0.85rem] md:text-[0.88rem] lg:text-[12px] xl:text-[0.95rem] font-medium text-[#3C3737] leading-[1.8]">
                          {slide.author}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Slider>
        </div>

        {/* Mobile nav bar — prev/next + counter, hidden on md+ via scoped CSS */}
        <div className="collection-mobile-nav flex items-center justify-between mt-5 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-lg bg-[#FAF7F5] border border-[#F2EDE9] flex items-center justify-center text-[#D30013] transition-colors hover:bg-[#D30013] hover:text-white hover:border-[#D30013]"
              aria-label="Previous slide"
            >
              <Icon icon="Icon-Chevron-small" size={20} style={{ transform: 'rotate(90deg)' }} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-lg bg-[#FAF7F5] border border-[#F2EDE9] flex items-center justify-center text-[#D30013] transition-colors hover:bg-[#D30013] hover:text-white hover:border-[#D30013]"
              aria-label="Next slide"
            >
              <Icon icon="Icon-Chevron-small" size={20} style={{ transform: 'rotate(270deg)' }} />
            </button>
          </div>
          <div className="text-sm font-medium text-[#3C3737] border border-[#F2EDE9] rounded-lg px-4 py-2 bg-[#FAF7F5]">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CollectionBlock;
