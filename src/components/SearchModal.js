import React from 'react';
import { X } from 'lucide-react';
import Icon from './Icon';

/**
 * SearchModal Component
 * Displays search results in a modal overlay with pagination
 * Note: Lenis scroll management is handled by the parent component (PageHeader)
 */
const SearchModal = ({
  showSearchResults,
  setShowSearchResults,
  searchQuery,
  isSearching,
  searchResults,
  currentSearchPage,
  handleSearchPageChange,
  nav = {}
}) => {
  if (!showSearchResults) return null;

  return (
    <>
      <style>{`
        @keyframes modalZoomIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-zoom-in {
          animation: modalZoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .backdrop-fade-in {
          animation: backdropFadeIn 0.3s ease-out;
        }

        .result-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .result-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(211, 0, 19, 0.15);
        }

        /* Custom scrollbar styling for modal content */
        .modal-zoom-in .overflow-y-scroll {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-padding: 20px;
          will-change: scroll-position;
        }

        /* Smooth momentum scrolling for iOS */
        @supports (-webkit-overflow-scrolling: touch) {
          .modal-zoom-in .overflow-y-scroll {
            -webkit-overflow-scrolling: touch;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }

        .modal-zoom-in .overflow-y-scroll::-webkit-scrollbar {
          width: 12px;
        }

        .modal-zoom-in .overflow-y-scroll::-webkit-scrollbar-track {
          background: #f8f8f8;
          border-radius: 10px;
          margin: 8px 0;
        }

        .modal-zoom-in .overflow-y-scroll::-webkit-scrollbar-thumb {
          background: #D30013;
          border-radius: 10px;
          border: 3px solid #f8f8f8;
          transition: background 0.2s ease;
        }

        .modal-zoom-in .overflow-y-scroll::-webkit-scrollbar-thumb:hover {
          background: #9E1422;
          border: 2px solid #f8f8f8;
        }

        .modal-zoom-in .overflow-y-scroll::-webkit-scrollbar-thumb:active {
          background: #7d0f19;
        }

        /* Firefox scrollbar */
        .modal-zoom-in .overflow-y-scroll {
          scrollbar-width: thin;
          scrollbar-color: #D30013 #f8f8f8;
        }

        /* Smooth scrolling animation */
        @media (prefers-reduced-motion: no-preference) {
          .modal-zoom-in .overflow-y-scroll {
            scroll-behavior: smooth;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-[200] backdrop-fade-in"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 lg:p-6"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl modal-zoom-in flex flex-col"
          style={{ height: '85vh', maxHeight: '85vh', overflow: 'hidden' }}
        >
          {/* Modal Header */}
          <div className="flex text-left items-center justify-between px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-200 bg-gradient-to-r from-[#FAF7F5] to-white flex-shrink-0">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#9E1422]">
                {nav.searchResultsTitle || 'Search Results'}
              </h2>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-1 text-left">
                  Searching for: <span className="font-semibold text-[#3C3C3B]">"{searchQuery}"</span>
                </p>
              )}
            </div>
            <button
              onClick={() => setShowSearchResults(false)}
              className="p-1 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
              aria-label="Close modal"
            >
              <Icon icon="Close-Button" size={38} color="#D30013" />
            </button>
          </div>

          {/* Modal Content */}
          <div
            className="overflow-y-scroll overflow-x-hidden px-6 lg:px-8 py-6"
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth'
            }}
            data-lenis-prevent
          >
            {isSearching ? (
              <div className="py-16 text-center">
                <div className="relative inline-flex">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-[#D30013]"></div>
                  <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-[#D30013] opacity-20"></div>
                </div>
                <p className="mt-6 text-lg font-medium text-gray-700">Searching for "{searchQuery}"...</p>
                <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the results</p>
              </div>
            ) : searchResults ? (
              <div>
                {searchResults.content || searchResults.results ? (
                  <div>
                    {(searchResults.content || searchResults.results) && (searchResults.content || searchResults.results).length > 0 ? (
                      <>
                        {/* Results Count Badge */}
                        <div className="mb-6 flex items-center gap-3">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9E1422] to-[#D30013] text-white rounded-full shadow-md">
                            <Icon icon="Icon-Search" size={16} color="white" />
                            <span className="font-semibold text-sm">
                              {searchResults.total
                                ? `${searchResults.total} Result${searchResults.total !== 1 ? 's' : ''}`
                                : `${(searchResults.content || searchResults.results).length} Result${(searchResults.content || searchResults.results).length !== 1 ? 's' : ''}`
                              }
                            </span>
                          </div>
                          {searchResults.page && (
                            <span className="text-sm text-gray-600 font-medium">
                              Page {searchResults.page}
                            </span>
                          )}
                        </div>

                        {/* Results Grid */}
                        <div className="space-y-4">
                          {(searchResults.content || searchResults.results).map((result, index) => (
                            <a
                              key={result.id || index}
                              href={result.url || '#'}
                              className="result-card-hover block p-5 lg:p-6 rounded-xl border-2 border-gray-200 hover:border-[#D30013] bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#FEF2F2] group"
                              onClick={(e) => {
                                if (result.url) {
                                  setShowSearchResults(false);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              {/* Title */}
                              <h3 className="text-lg lg:text-xl font-bold text-[#3C3C3B] group-hover:text-[#D30013] transition-colors mb-3">
                                {result.title}
                              </h3>

                              {/* Content/Excerpt */}
                              {result.excerpt && (
                                <p className="text-sm lg:text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                                  {result.excerpt}
                                </p>
                              )}

                              {/* URL */}
                              {result.url && (
                                <div className="flex items-center gap-2 text-xs text-[#D30013] font-medium">
                                  <Icon icon="Icon-Chevron-Large" size={12} color="#D30013" />
                                  <span className="truncate">{result.url}</span>
                                </div>
                              )}
                            </a>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {(searchResults.page > 1 || !searchResults.noMore) && (
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                            <button
                              onClick={() => handleSearchPageChange(currentSearchPage - 1)}
                              disabled={currentSearchPage === 1}
                              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#D30013] hover:text-[#D30013] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <Icon icon="Icon-Chevron-Large" size={14} style={{ transform: 'rotate(180deg)' }} />
                              Previous
                            </button>

                            <span className="px-4 py-2 text-sm font-medium text-gray-700">
                              Page {searchResults.page || currentSearchPage}
                            </span>

                            <button
                              onClick={() => handleSearchPageChange(currentSearchPage + 1)}
                              disabled={searchResults.noMore}
                              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[#D30013] hover:text-[#D30013] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              Next
                              <Icon icon="Icon-Chevron-Large" size={14} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-16 text-center">
                        <div className="flex justify-center mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <Icon icon="Icon-Search" size={48} color="#9CA3AF" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No Results Found</h3>
                        <p className="text-lg text-gray-600 mb-2">
                          We couldn't find any matches for <span className="font-semibold text-[#D30013]">"{searchQuery}"</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-4">Try using different keywords or check your spelling</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 lg:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#D30013] to-[#9E1422] rounded-full flex items-center justify-center">
                          <X className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl lg:text-2xl font-bold text-[#D30013] mb-3">
                            Search Error
                          </h3>
                          {searchResults.errors && (
                            <div className="space-y-3">
                              {Object.entries(searchResults.errors).map(([key, messages]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-semibold text-gray-700 capitalize block mb-2 text-base">{key}:</span>
                                  {Array.isArray(messages) ? (
                                    <ul className="list-disc list-inside text-[#D30013] space-y-1 ml-2">
                                      {messages.map((msg, idx) => (
                                        <li key={idx} className="text-sm">{msg}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-[#D30013]">{messages}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="px-6 lg:px-8 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
            <button
              onClick={() => setShowSearchResults(false)}
              className="w-full py-3.5 px-6 text-base font-semibold text-[#D30013] border-2 border-[#D30013] rounded-xl hover:bg-[#D30013] hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              {nav.searchResultsClose || 'Close'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
