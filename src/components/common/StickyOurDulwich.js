import { useState } from 'react';
import { getCurrentSchool } from '../../utils/schoolDetection';

// Local asset imports
import imgShanghaiDefault from '../../assets/images/sticky-shanghai-pudong-default.svg';
import imgShanghaiHover   from '../../assets/images/sticky-shanghai-pudong.svg';
import imgShanghaiMobile  from '../../assets/images/sticky-shanghai-pudong-mobile.svg';
import imgSeoul           from '../../assets/images/sticky-seoul.png';
import imgSeoulMobile     from '../../assets/images/sticky-seoul-mobile.png';
import imgSingapore       from '../../assets/images/read-our-story.svg';
import imgBeijing         from '../../assets/images/sticky-beijing.png';
import imgBeijingMobile   from '../../assets/images/sticky-beijing-mobile.svg';

// Static sticky data per school slug.
// Only schools listed here will show the sticky widget.
const STICKY_DATA = {
  // 'shanghai-pudong': {
  //   image_url:        imgShanghaiDefault,
  //   transition_image: imgShanghaiHover,
  //   mobile_image_url: imgShanghaiMobile,
  //   url:      '/lp/foreverdulwich-a-community-for-life',
  //   position: 'top',
  //   effect:   'transition-hover',
  //   mobilewidth: 120,
  //   mobileheight: 40,
  //   desktopMaxwidth: 200,
  //   mobileview: 'full'

  // },
  'seoul': {
    image_url:        imgSeoul,
    mobile_image_url: imgSeoulMobile,
    url:      'https://seoul15years.dulwich.org/',
    position: 'top',
    effect:   'slide-in-right',
    mobilewidth: 80,
    mobileheight: 100,
    desktopMaxwidth: 200,
    mobileview: 'full'


  },

  'beijing': {
    image_url:        imgBeijing,
    mobile_image_url: imgBeijingMobile,
    url:      '20th-anniversary',
    position: 'top',
    effect:   'slide-in-right',
    mobilewidth: 70,
    mobileheight: 100,
    desktopMaxwidth: 200,
    mobileview: 'full'

  },
  'singapore': {
    image_url:        imgSingapore,
    mobile_image_url: imgSingapore,
    url:      '/our-dulwich-stories',
    position: 'top',
    effect:   'slide-in-right',
    mobilewidth: 140,
    mobileheight: 80,
    desktopMaxwidth: 200,
    mobileview: 'half'


  },
};

// Map position key → CSS top value
const POSITION_MAP = {
  center: '50%',
  top:    '45%',
  bottom: '75%',
};

function StickyOurDulwich() {
  const [hovered, setHovered] = useState(false);

  const school = getCurrentSchool();
  const data   = school ? STICKY_DATA[school] : null;

  if (!data) return null;

  const isTransitionHover = data.effect === 'transition-hover';
  const topValue   = POSITION_MAP[data.position] || '50%';
  const deskW      = data.desktopMaxwidth || 200;
  const deskWpx    = `${deskW}px`;

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Our Dulwich"
      className="cursor-pointer no-underline block"
      style={{
        position: 'fixed',
        right: 0,
        top: topValue,
        transform: 'translateY(-50%)',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* ── Mobile: static image, no effect, min-height 40px ───────── */}

      <div
        className="block md:hidden"
        style={{
          minHeight: '40px',
          transform: data.mobileview === 'half' ? 'translateX(50%)' : 'translateX(0)',
        }}
      >


        <img
          src={data.mobile_image_url}
          alt="Our Dulwich"
          style={{ width: `${data.mobilewidth || 80}px`, height: `${data.mobileheight || 80}px`, minHeight: '40px', objectFit: 'contain' }}
        />
      </div>

      {/* ── Desktop + Tablet (md+): effect-based ────────────────────── */}
      <div
        className="hidden md:block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={
          isTransitionHover
            ? {}
            : {
                transform: hovered ? 'translateX(0)' : 'translateX(50%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }
        }
      >
        {isTransitionHover ? (
          /* Always visible — crossfade default → hover image */
          <div className="relative" style={{ width: deskWpx }}>
            <img
              src={data.image_url}
              alt="Our Dulwich"
              style={{ width: deskWpx, objectFit: 'contain', display: 'block', opacity: hovered ? 0 : 1, transition: 'opacity 0.4s ease' }}
            />
            <img
              src={data.transition_image}
              alt="Our Dulwich"
              className="absolute inset-0"
              style={{ width: deskWpx, objectFit: 'contain', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
            />
          </div>
        ) : (
          /* Half-hidden by default — slides fully in on hover */
          <div className="rounded-l-xl flex flex-col items-center" style={{ width: deskWpx, maxWidth: deskWpx }}>
            <img
              src={data.image_url}
              alt="Our Dulwich"
              style={{ width: deskWpx, objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
    </a>
  );
}

export default StickyOurDulwich;
