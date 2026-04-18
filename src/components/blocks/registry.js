/**
 * Component Registry
 * Maps block types to their corresponding React components
 *
 * SCALABILITY: To add a new block type, simply:
 * 1. Create the new block component (e.g., TestimonialsBlock.js)
 * 2. Import it here
 * 3. Add one line to the BLOCK_COMPONENTS object
 *
 * No need to modify BlockRenderer or any other files!
 */

import BannerBlock from './BannerBlock';
import TriptychBlock from './TriptychBlock';
import ArticlesBlock from './ArticlesBlock';
import SchoolsBlock from './SchoolsBlock';
import VideoBlock from './VideoBlock';
import SchoolListingBlock from './SchoolListingBlock';
import PromoBlock from './PromoBlock';
import VideoUploadBlock from './VideoUploadBlock';
import CopyBlock from './CopyBlock';
import SingleImageBlock from './SingleImageBlock';
import AccordionBlock from './AccordionBlock';
import AdmissionsPromoBlock from './AdmissionsPromoBlock';
import ColoredBlock from './ColoredBlock';
import ContactCardBlock from './ContactCardBlock';
import TwoColCopyBlock from './TwoColCopyBlock';
import CtaBlock from './CtaBlock';
import TwoColCtaBlock from './TwoColCtaBlock';
import EmbeddedFormBlock from './EmbeddedFormBlock';
import TwoColImageBlock from './TwoColImageBlock';
import TwoColImageCopyBlock from './TwoColImageCopyBlock';
import QuoteBlock from './QuoteBlock';
import AlbumBlock from './AlbumBlock';
import DownloadBlock from './DownloadBlock';
import DownloadSelectBlock from './DownloadSelectBlock';
import TimelineEventBlock from './TimelineEventBlock';
import TwoColAccordionBlock from './TwoColAccordionBlock';
import MapBlock from './MapBlock';
import OurSchoolsBlock from './OurSchoolsBlock';
import TaxonomyBlock from './TaxonomyBlock';
import TemplateBlock from './TemplateBlock';
import TimelineSliderBlock from './TimelineSliderBlock';
import TextBlock from './TextBlock';
import DefaultBlock from './DefaultBlock';
import CollectionBlock from './CollectionBlock';
import IBRatingBlock from './IBRatingBlock';
import PromoNewBlock from './PromoNewBlock';
import LiveWorldWiseGrid from './LiveWorldWiseGrid';
import HolisticCurriculumBlock from './HolisticCurriculumBlock';
import FeeStructureBlock from './FeeStructureBlock';
import StatisticBlocks from './StatisticBlock';
import LiveWorldView from './LiveWorldView';
import StoriesSection from './StoriesSection';

import OpendayCarouselBlock from './OpendayCarouselBlock';
import MainCampusMapBlock from './MainCampusMapBlock';
import ContactFormBlock from './ContactFormBlock';
import SchoolLocationsBlock from './SchoolLocationsBlock';

/**
 * Registry mapping block types to components
 * Key = block.type from API
 * Value = React component
 */
export const BLOCK_COMPONENTS = {
  // Core content blocks
  copy: CopyBlock,
  text_block: TextBlock,
  single_image: SingleImageBlock,
  video_upload: VideoUploadBlock,
  video: VideoBlock,

  // Layout blocks
  triptych: TriptychBlock,
  promo: PromoBlock,
  promo_new: PromoNewBlock,
  accordion: AccordionBlock,

  // Two column blocks
  '2-col-copy': TwoColCopyBlock,
  '2-col-cta': TwoColCtaBlock,
  '2-col-image': TwoColImageBlock,
  '2-col-image-copy': TwoColImageCopyBlock,
  '2-col-accordion': TwoColAccordionBlock,

  // Interactive blocks
  cta: CtaBlock,
  quote: QuoteBlock,
  contact_card: ContactCardBlock,
  contact_form: ContactFormBlock,

  // Special blocks
  admissions_promo: AdmissionsPromoBlock,
  statistic_block: StatisticBlocks,
  colored_block: ColoredBlock,
  school_listing: SchoolListingBlock,
  embedded_form: EmbeddedFormBlock,
  ib_rating: IBRatingBlock,
  fee_structure: FeeStructureBlock,
  openday_carousel: OpendayCarouselBlock,
  live_world_wise: LiveWorldView,
  // Media and content blocks
  album: AlbumBlock,
  curriculum: LiveWorldWiseGrid,
  holistic_curriculum: HolisticCurriculumBlock,
  holistic_curriculum_links: HolisticCurriculumBlock,
  // collection_block: CollectionBlock,
  testimonial: CollectionBlock,
  stories_section: StoriesSection,
  student_stories: StoriesSection,
  download: DownloadBlock,
  download_select: DownloadSelectBlock,
  timeline_event: TimelineEventBlock,
  map_block: MapBlock,
  main_campus_map: MainCampusMapBlock,
  school_locations: SchoolLocationsBlock,
  'our-schools': OurSchoolsBlock,
  taxonomy: TaxonomyBlock,
  template: TemplateBlock,
  // years_anniversary: YearsAnniversaryBlock,
  years_anniversary: TimelineSliderBlock,

  // Legacy/reference blocks
  banner: BannerBlock,
  articles: ArticlesBlock,
  schools: SchoolsBlock,
};

/**
 * Gets the appropriate component for a block type
 * Returns DefaultBlock if type is not found (fallback)
 *
 * @param {string} type - The block type from API
 * @returns {React.Component} The corresponding component
 */
export const getBlockComponent = (type) => {
  return BLOCK_COMPONENTS[type] || DefaultBlock;
};

/**
 * Checks if a block type is registered
 * Useful for validation and debugging
 *
 * @param {string} type - The block type to check
 * @returns {boolean} True if type is registered
 */
export const isBlockTypeRegistered = (type) => {
  return type in BLOCK_COMPONENTS;
};

/**
 * Gets all registered block types
 * Useful for documentation and testing
 *
 * @returns {string[]} Array of registered block types
 */
export const getRegisteredBlockTypes = () => {
  return Object.keys(BLOCK_COMPONENTS);
};

export default BLOCK_COMPONENTS;