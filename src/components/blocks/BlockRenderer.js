import React from 'react';
import { getBlockComponent } from './registry';

/**
 * BlockRenderer Component
 * Dynamically renders blocks based on their type
 *
 * This component:
 * 1. Receives an array of blocks from the API
 * 2. Maps each block to its corresponding component via the registry
 * 3. Renders the components with their content
 * 4. Handles errors gracefully with error boundaries
 * 5. Passes header and footer data to all blocks
 *
 * @param {Array} blocks - Array of block objects from API
 * @param {Object} header - Static header data to pass to blocks
 * @param {Object} footer - Static footer data to pass to blocks
 */
const BlockRenderer = ({ blocks, header, footer, locale, school }) => {
  if (!blocks || !Array.isArray(blocks)) {
    console.warn('BlockRenderer: blocks prop must be an array');
    return null;
  }

  if (blocks.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p>No content blocks available.</p>
      </div>
    );
  }

  // Group consecutive collection_block, curriculam, and openday_carousel items together
  const groupedBlocks = [];
  let currentCollectionGroup = [];
  let currentCurriculamGroup = [];
  let currentOpendayCarouselGroup = [];

  const flushCurriculamGroup = () => {
    if (currentCurriculamGroup.length > 0) {
      groupedBlocks.push({
        type: 'curriculam_group',
        id: `curriculam-group-${currentCurriculamGroup[0].id}`,
        items: [...currentCurriculamGroup],
      });
      currentCurriculamGroup = [];
    }
  };

  const flushCollectionGroup = () => {
    if (currentCollectionGroup.length > 0) {
      groupedBlocks.push({
        type: 'collection_block_group',
        id: `collection-group-${currentCollectionGroup[0].id}`,
        items: [...currentCollectionGroup],
      });
      currentCollectionGroup = [];
    }
  };

  const flushOpendayCarouselGroup = () => {
    if (currentOpendayCarouselGroup.length > 0) {
      groupedBlocks.push({
        type: 'openday_carousel_group',
        id: `openday-carousel-group-${currentOpendayCarouselGroup[0].id}`,
        items: [...currentOpendayCarouselGroup],
      });
      currentOpendayCarouselGroup = [];
    }
  };

  let articlesBlockSeen = false;

  blocks.forEach((block) => {
    // Only keep the first articles block — skip duplicates from CMS
    if (block.type === 'articles') {
      if (articlesBlockSeen) return;
      articlesBlockSeen = true;
    }

    if (block.type === 'testimonial') {
      flushCurriculamGroup();
      flushOpendayCarouselGroup();
      currentCollectionGroup.push(block);
    } else if (block.type === 'curriculum') {
      flushCollectionGroup();
      flushOpendayCarouselGroup();
      currentCurriculamGroup.push(block);
    } else if (block.type === 'openday_carousel') {
      flushCollectionGroup();
      flushCurriculamGroup();
      currentOpendayCarouselGroup.push(block);
    } else {
      flushCollectionGroup();
      flushCurriculamGroup();
      flushOpendayCarouselGroup();
      groupedBlocks.push(block);
    }
  });

  // Don't forget the last groups
  flushCollectionGroup();
  flushCurriculamGroup();
  flushOpendayCarouselGroup();

  return (
    <div className="block-container">
      {groupedBlocks.map((block) => {
        // Handle grouped collection blocks
        if (block.type === 'collection_block_group') {
          const BlockComponent = getBlockComponent('testimonial');
          return (
            <ErrorBoundary key={block.id} blockId={block.id} blockType="testimonial">
              <BlockComponent
                content={block.items.map(item => item.content)}
                block={block}
                items={block.items}
                header={header}
                footer={footer}
                schools={footer?.schools || []}
              />
            </ErrorBoundary>
          );
        }

        // Handle grouped curriculam blocks
        if (block.type === 'curriculam_group') {
          const BlockComponent = getBlockComponent('curriculum');
          return (
            <ErrorBoundary key={block.id} blockId={block.id} blockType="curriculum">
              <BlockComponent
                content={block.items.map(item => item.content)}
                block={block}
                items={block.items}
                header={header}
                footer={footer}
                schools={footer?.schools || []}
              />
            </ErrorBoundary>
          );
        }

        // Handle grouped openday_carousel blocks
        if (block.type === 'openday_carousel_group') {
          const BlockComponent = getBlockComponent('openday_carousel');
          return (
            <ErrorBoundary key={block.id} blockId={block.id} blockType="openday_carousel">
              <BlockComponent
                content={block.items.map(item => item.content)}
                block={block}
                items={block.items}
                header={header}
                footer={footer}
                schools={footer?.schools || []}
              />
            </ErrorBoundary>
          );
        }

        // Validate block structure
        if (!block.id || !block.type) {
          console.error('Invalid block structure:', block);
          return null;
        }

        // Get the appropriate component from registry
        const BlockComponent = getBlockComponent(block.type);

        // Render the block with error boundary
        return (
          <ErrorBoundary key={block.id} blockId={block.id} blockType={block.type}>
            <BlockComponent
              content={locale ? { ...block.content, locale } : block.content}
              block={block}
              header={header}
              footer={footer}
              schools={footer?.schools || []}
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

/**
 * Error Boundary for individual blocks
 * Prevents one broken block from crashing the entire page
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `Error in block ${this.props.blockId} (${this.props.blockType}):`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-8 px-4 bg-red-50 border-l-4 border-red-400">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Error rendering block
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Block ID: {this.props.blockId} ({this.props.blockType})
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-2 font-mono text-xs">
                      {this.state.error?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BlockRenderer;
