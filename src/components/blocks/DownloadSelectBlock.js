import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.dulwich.atalent.xyz';

/**
 * DownloadSelectBlock Component
 * Displays a dropdown/select menu to choose and download files
 *
 * API Response:
 * {
 *   "type": "download_select",
 *   "content": {
 *     "cta-title": "Test block 14",
 *     "files": {
 *       "0": {
 *         "title": "Block14",
 *         "download-select": "/blocks/.../file.pdf",
 *         "weight": "0"
 *       }
 *     }
 *   }
 * }
 */
const DownloadSelectBlock = ({ content }) => {
  const { 'cta-title': ctaTitle, files = {} } = content;

  // Convert files object to array
  const fileArray = Object.values(files).filter(file => file && file['download-select']);
  fileArray.sort((a, b) => (parseInt(a.weight) || 0) - (parseInt(b.weight) || 0));

  if (fileArray.length === 0) {
    return null;
  }

  const handleDownload = (fileUrl) => {
    const downloadUrl = fileUrl.startsWith('http')
      ? fileUrl
      : `${API_BASE_URL}${fileUrl}`;

    window.open(downloadUrl, '_blank');
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    try {
      // Fetch all files and add to zip
      const filePromises = fileArray.map(async (file) => {
        const downloadUrl = file['download-select'].startsWith('http')
          ? file['download-select']
          : `${API_BASE_URL}${file['download-select']}`;

        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const fileName = file.title.endsWith('.pdf') ? file.title : `${file.title}.pdf`;
        zip.file(fileName, blob);
      });

      await Promise.all(filePromises);

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${ctaTitle || 'downloads'}.zip`);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to download files. Please try downloading individually.');
    }
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        {/* Header with Title and Download All Button */}
        <div className="flex justify-between items-center mb-8">
          {ctaTitle && (
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {ctaTitle}
            </h2>
          )}
          <button
            onClick={handleDownloadAll}
            className="px-6 py-3 bg-white border-2 border-[#D30013] text-[#D30013] font-semibold rounded-lg hover:bg-[#D30013] hover:text-white transition-all duration-300"
          >
            Download All
          </button>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fileArray.map((file, index) => (
            <div key={index} className="flex flex-col">
              {/* File Card */}
              <div className="bg-[#ffcbcf] rounded-lg p-12 flex items-center justify-center mb-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                {/* File Icon */}
                <svg
                  className="w-20 h-20 text-[#D30013]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m-6-8h3"
                  />
                </svg>
              </div>

              {/* File Name and Download Button */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{file.title}</span>
                <button
                  onClick={() => handleDownload(file['download-select'])}
                  className="p-2 text-[#D30013] hover:bg-[#FFE5E5] rounded-lg transition-all duration-300"
                  aria-label={`Download ${file.title}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DownloadSelectBlock;
