import React, { useRef, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

/**
 * VideoUploadBlock Component
 * Displays uploaded video with poster image
 */
const VideoUploadBlock = ({ content }) => {
  const {
    title,
    video,
    image, // poster image
    'image_description': imageDescription,
    'anchor-id': anchorId,
  } = content;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Construct full video URL
  const videoUrl = video?.startsWith('http') ? video : `${API_BASE_URL}${video}`;
  const posterUrl = image?.startsWith('http') ? image : `${API_BASE_URL}${image}`;

  return (
    <section data-id={anchorId} className="py-16 px-4 bg-white">
      <div className="w-full mx-auto">
        {title && (
          <h2 className="text-4xl font-bold mb-8 text-left text-gray-800">
            {title}
          </h2>
        )}

        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            poster={posterUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom play button overlay */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity hover:bg-opacity-40"
              onClick={handlePlayClick}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <svg
                  className="w-10 h-10 text-[#D30013] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {imageDescription && (
          <p className="text-left text-gray-600 text-sm mt-4">
            {imageDescription}
          </p>
        )}
      </div>
    </section>
  );
};

export default VideoUploadBlock;
