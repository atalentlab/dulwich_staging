import React, { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Video Block Component
 * Displays embedded video with title and description.
 * Supports a cover image (thumbnail) that swaps to the video player on click.
 */
const VideoBlock = ({ content }) => {
  const {
    videoUrl,
    video,
    title,
    description,
    image,
    'video-youtube': videoYoutube,
    'video-youku': videoYouku
  } = content;

  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to get valid embed URL
  const getEmbedSource = () => {
    // Priority 1: Explicit YouTube ID from API
    if (videoYoutube) {
      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${videoYoutube}?autoplay=1`
      };
    }

    // Priority 2: Youku ID (if implemented in future, placeholder for now)
    if (videoYouku) {
      // Youku embed format usually: https://player.youku.com/embed/ID
      return {
        type: 'youku',
        src: `https://player.youku.com/embed/${videoYouku}?autoplay=1`
      };
    }

    // Priority 3: videoUrl or video prop (parsing existing logic)
    const input = videoUrl || video;
    if (!input) return null;

    if (input.includes('youtube.com/embed/')) {
      return { type: 'youtube', src: input };
    }

    let videoId = input;
    if (input.includes('youtube.com/watch?v=')) {
      videoId = input.split('v=')[1]?.split('&')[0];
    } else if (input.includes('youtu.be/')) {
      videoId = input.split('youtu.be/')[1]?.split('?')[0];
    }

    // Fallback if we just have an ID or clean URL
    // If it doesn't look like a URL, treat as Youtube ID
    if (!input.includes('http') && !input.includes('www.')) {
      videoId = input;
    }

    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${videoId}?autoplay=1`
    };
  };

  const embedSource = getEmbedSource();

  if (!embedSource) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1376px] w-full mx-auto">
        {title && (
          <h2 className="text-4xl font-bold mb-4 text-left text-gray-800">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-left text-gray-600 mb-8">{description}</p>
        )}

        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-100 group">
          {!isPlaying && image ? (
            /* Thumbnail View */
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full block cursor-pointer group"
              aria-label="Play video"
            >
              <img
                src={image}
                alt={title || "Video thumbnail"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D30013] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                </div>
              </div>
            </button>
          ) : (
            /* Player View */
            <iframe
              src={isPlaying && image ? embedSource.src : embedSource.src.replace('?autoplay=1', '')}
              title={title || 'Video'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoBlock;
