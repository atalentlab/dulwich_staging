import React, { useState, useEffect, useRef } from 'react';
import { MoveDiagonal, Camera, X } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';

/**
 * AlbumBlock Component
 * Displays a gallery/album of images
 *
 * API Response:
 * {
 *   "type": "album",
 *   "content": {
 *     "albums": ["41", "45"],
 *     "anchor-id": null
 *   }
 * }
 */
const AlbumBlock = ({ content }) => {
  const { albums = [], 'anchor-id': anchorId } = content;
  const [albumsData,        setAlbumsData]        = useState([]);
  const [loading,           setLoading]            = useState(true);
  const [selectedAlbum,     setSelectedAlbum]      = useState(null);
  const [currentImageIndex, setCurrentImageIndex]  = useState(0);
  const [isModalOpen,       setIsModalOpen]        = useState(false);
  const [isClosing,         setIsClosing]          = useState(false);
  const [slideDir,          setSlideDir]           = useState(null); // 'left' | 'right'
  const [imgKey,            setImgKey]             = useState(0);
  const [prevIndex,         setPrevIndex]          = useState(null);
  const autoSlideRef          = useRef(null);
  const currentImageIndexRef  = useRef(0);
  const navigateImageRef      = useRef(null);

  useEffect(() => {
    if (albums.length > 0) {
      fetchAlbumsData();
    } else {
      setLoading(false);
    }
  }, [albums]);

  const fetchAlbumsData = async () => {
    try {
      setLoading(true);
      console.log('Fetching albums with IDs:', albums);

      const promises = albums.map(albumId =>
        fetch(`${API_BASE_URL}/api/albums/${albumId}/media`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              // Get album info and media_files
              const albumInfo = data.data.album || {};
              const mediaFiles = data.data.media_files || [];

              console.log(`Album ${albumId} fetched:`, albumInfo);
              console.log(`Album ${albumId} media_files:`, mediaFiles);

              return {
                ...albumInfo,
                id: albumInfo.id || albumId,
                name: albumInfo.name || `Album ${albumId}`,
                cover_photo: albumInfo.cover_photo || (mediaFiles[0]?.file) || null,
                media_files: mediaFiles
              };
            }
            console.warn(`Album ${albumId} failed or has no data:`, data);
            return null;
          })
          .catch(err => {
            console.error(`Error fetching album ${albumId}:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      const validAlbums = results.filter(album => album !== null);
      console.log('Valid albums loaded:', validAlbums);
      setAlbumsData(validAlbums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = (album, imageIndex = 0) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(imageIndex);
    currentImageIndexRef.current = imageIndex;
    setPrevIndex(null);
    setSlideDir(null);
    setImgKey(0);
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const closeAlbum = () => {
    setIsClosing(true);
    clearInterval(autoSlideRef.current);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setSelectedAlbum(null);
      setCurrentImageIndex(0);
    }, 360);
  };

  const navigateImage = (dir) => {
    if (!selectedAlbum?.media_files) return;
    const curr  = currentImageIndexRef.current;
    const total = selectedAlbum.media_files.length;
    const next  = dir === 'left'
      ? (curr + 1) % total
      : (curr - 1 + total) % total;
    setPrevIndex(curr);
    setSlideDir(dir);
    setCurrentImageIndex(next);
    currentImageIndexRef.current = next;
    setImgKey(k => k + 1);
    setTimeout(() => setPrevIndex(null), 400);
  };
  navigateImageRef.current = navigateImage;

  const goToPrevious = () => navigateImage('right');
  const goToNext    = () => navigateImage('left');

  const goToImage = (index) => {
    if (index === currentImageIndexRef.current) return;
    const dir = index > currentImageIndexRef.current ? 'left' : 'right';
    setPrevIndex(currentImageIndexRef.current);
    setSlideDir(dir);
    setCurrentImageIndex(index);
    currentImageIndexRef.current = index;
    setImgKey(k => k + 1);
    clearInterval(autoSlideRef.current);
    setTimeout(() => setPrevIndex(null), 400);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedAlbum) {
        if (e.key === 'Escape') closeAlbum();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedAlbum, currentImageIndex]);

  // Auto-slide functionality
  useEffect(() => {
    if (selectedAlbum && selectedAlbum.media_files && selectedAlbum.media_files.length > 1) {
      // Clear any existing interval
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }

      // Set up auto-slide interval (3 seconds) — calls navigateImage via ref to always get latest version
      autoSlideRef.current = setInterval(() => {
        navigateImageRef.current('left');
      }, 3000);

      // Cleanup on unmount or when modal closes
      return () => {
        if (autoSlideRef.current) {
          clearInterval(autoSlideRef.current);
        }
      };
    }
  }, [selectedAlbum]);

  return (
    <section data-id={anchorId} className="py-2 md:py-10 px-4 bg-white">
      <style>{`
        @keyframes albumOverlayIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes albumOverlayOut { from { opacity: 1; } to { opacity: 0; } }
        /* Top & bottom meet in center on close; expand from center outward on open */
        @keyframes albumExpand {
          0%   { clip-path: inset(48% 0% 48% 0% round 8px); opacity: 0.6; }
          100% { clip-path: inset(0%  0%  0%  0%  round 8px); opacity: 1; }
        }
        @keyframes albumShrink {
          0%   { clip-path: inset(0%  0%  0%  0%  round 8px); opacity: 1; }
          100% { clip-path: inset(48% 0% 48% 0% round 8px); opacity: 0; }
        }
        @keyframes albumZoomIn  { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: scale(1); } }
        @keyframes albumFadeOut { from { opacity: 1; }                         to { opacity: 0; } }
        .album-overlay-in       { animation: albumOverlayIn  0.3s  ease-out                       forwards; }
        .album-overlay-out      { animation: albumOverlayOut 0.38s ease-out                       forwards; }
        .album-expand           { animation: albumExpand     0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .album-shrink           { animation: albumShrink     0.40s cubic-bezier(0.4,  0, 0.6,  1) forwards; }
        .album-slide-right      { animation: albumZoomIn  0.7s cubic-bezier(0.0, 0.0, 0.2, 1) 0.25s forwards; opacity: 0; }
        .album-slide-left       { animation: albumZoomIn  0.7s cubic-bezier(0.0, 0.0, 0.2, 1) 0.25s forwards; opacity: 0; }
        .album-slide-out-left   { animation: albumFadeOut 0.3s ease-out forwards; }
        .album-slide-out-right  { animation: albumFadeOut 0.3s ease-out forwards; }
      `}</style>

      <div className="max-w-[1120px] mx-auto">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D30013]" />
          </div>
        )}

        {/* Albums Grid */}
        {!loading && albumsData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albumsData.map((album) => (
              <div
                key={album.id}
                onClick={() => openAlbum(album)}
                className="bg-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '8px' }}
              >
                {/* Cover Photo */}
                <div className="w-full aspect-[4/3] overflow-hidden" style={{ borderRadius: '8px 8px 0 0' }}>
                  {album.cover_photo ? (
                    <img
                      src={album.cover_photo}
                      alt={album.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Camera className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Album Info */}
                <div className="p-5 flex items-center justify-between gap-3 h-35">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{album.name}</h3>
                    {album.media_files?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Camera className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{album.media_files.length} Photos</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="relative flex-shrink-0 rounded-full w-12 h-12 border border-[#D30013] text-[#D30013] transition-all duration-500 ease-out hover:w-[4.2rem] hover:bg-[#D30013] hover:text-white hover:border-transparent"
                    onClick={(e) => { e.stopPropagation(); openAlbum(album); }}
                  >
                    <MoveDiagonal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Albums */}
        {!loading && albumsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No albums available</p>
          </div>
        )}
      </div>

      {/* Animated Modal */}
      {isModalOpen && selectedAlbum?.media_files?.length > 0 && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 ${isClosing ? 'album-overlay-out' : 'album-overlay-in'}`}
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={closeAlbum}
        >
          <div
            className={`relative bg-black overflow-hidden ${isClosing ? 'album-shrink' : 'album-expand'}`}
            style={{ width: '100%', maxWidth: '1376px', height: 'auto', aspectRatio: '16/9', borderRadius: '8px', minHeight: '280px', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sliding images — outgoing slides out while incoming slides in */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Outgoing image */}
              {prevIndex !== null && (
                <img
                  key={`prev-${imgKey}`}
                  src={selectedAlbum.media_files[prevIndex]?.file}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover ${
                    slideDir === 'left' ? 'album-slide-out-left' : 'album-slide-out-right'
                  }`}
                />
              )}
              {/* Incoming image */}
              <img
                key={`curr-${imgKey}`}
                src={selectedAlbum.media_files[currentImageIndex]?.file}
                alt={selectedAlbum.media_files[currentImageIndex]?.title || `Image ${currentImageIndex + 1}`}
                className={`absolute inset-0 w-full h-full object-cover ${
                  slideDir === 'left'  ? 'album-slide-right' :
                  slideDir === 'right' ? 'album-slide-left'  : ''
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${API_BASE_URL}/images/placeholders/no-image.gif`;
                }}
              />
            </div>

            {/* Close — top right */}
            <button
              onClick={closeAlbum}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>

            {/* Bottom bar — responsive layout */}
            <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-6 py-3 sm:py-5 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                {/* Title */}
                <h3 className="text-white text-sm sm:text-xl font-bold drop-shadow flex-1 pr-0 sm:pr-4 text-center sm:text-left line-clamp-2">
                  {selectedAlbum.media_files[currentImageIndex]?.title || selectedAlbum.name}
                </h3>

                {/* Pagination dots */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {selectedAlbum.media_files.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={`h-1 sm:h-[5px] rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? 'bg-[#D30013] w-6 sm:w-8' : 'w-2 sm:w-4 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Prev / Next arrows */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={goToPrevious}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center shadow-md transition-colors"
                    aria-label="Previous"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D30013] hover:bg-[#B01810] rounded-lg flex items-center justify-center text-white shadow-md transition-colors"
                    aria-label="Next"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AlbumBlock;
