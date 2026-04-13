import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Icon from '../Icon';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cms.dulwich.atalent.xyz';

/**
 * DownloadBlock Component
 * Displays downloadable files with CTA buttons in a card layout
 *
 * API Response:
 * {
 *   "type": "download",
 *   "content": {
 *     "title": "Terms and Conditions",
 *     "description": "Full enrolment and admissions terms...",
 *     "anchor-id": "downloads",
 *     "0": {
 *       "cta-copy": "Terms & Conditions",
 *       "download": "/blocks/.../file.pdf",
 *       "weight": "0"
 *     }
 *   }
 * }
 */
const DownloadBlock = ({ content }) => {
  const {
    title,
    description,
    'anchor-id': anchorId
  } = content;

  // Convert object with numeric keys to array, excluding non-download fields
  const downloads = Object.entries(content)
    .filter(([key, item]) => !isNaN(key) && item && item.download)
    .map(([, item]) => item);

  // Sort by weight if available
  downloads.sort((a, b) => (parseInt(a.weight) || 0) - (parseInt(b.weight) || 0));

  if (downloads.length === 0) {
    return null;
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    try {
      // Fetch all files and add to zip
      const filePromises = downloads.map(async (item) => {
        let downloadUrl = item.download?.startsWith('http')
          ? item.download
          : `${API_BASE_URL}${item.download}`;

        // Ensure https if possible
        if (downloadUrl.startsWith('http://')) {
          downloadUrl = downloadUrl.replace('http://', 'https://');
        }

        // Use our local proxy to bypass CORS
        // This hits server.js which fetches the file server-to-server
        const proxyUrl = `/proxy-fetch?url=${encodeURIComponent(downloadUrl)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        
        // Ensure proper filename extension
        let fileName = item['cta-copy'] || 'download';
        if (!fileName.toLowerCase().endsWith('.pdf') && !fileName.toLowerCase().endsWith('.zip') && !fileName.toLowerCase().endsWith('.jpg') && !fileName.toLowerCase().endsWith('.png')) {
          fileName = `${fileName}.pdf`;
        }
        
        zip.file(fileName, blob);
      });

      await Promise.all(filePromises);

      // Generate and download zip
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${title || 'downloads'}.zip`);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to download files due to security restrictions. Please try downloading files individually.');
    }
  };

  return (
    <section data-id={anchorId} className="py-2 md:py-10 px-4 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="bg-[#FAF7F5] rounded-lg p-6 lg:p-10 relative">
          
          {/* Header with Title and Download All Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="max-w-2xl">
              {/* Title */}
              {title && (
                <h2 className="text-3xl lg:text-4xl font-bold text-[#8B1E1E] mb-4 text-left">
                  {title}
                </h2>
              )}

              {/* Description */}
              {description && (
                <p className="text-base text-gray-700 text-left leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {downloads.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="px-6 py-3 bg-[#D30013] text-white font-semibold rounded-lg hover:bg-[#B8000F] transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <Icon icon="Icon---Download" size={20} color="white" />
                Download All
              </button>
            )}
          </div>

          {/* Download Buttons - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {downloads.map((item, index) => {
              const downloadUrl = item.download?.startsWith('http')
                ? item.download
                : `${API_BASE_URL}${item.download}`;

              return (
                <a
                  key={index}
                  href={downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#D30013] text-[#D30013] rounded-lg transition-all duration-300 font-semibold text-base hover:bg-[#FFF5F5] hover:shadow-lg hover:scale-[1.02] w-full"
                >
                  {/* Download Icon */}
                  <Icon icon="Icon---Download" size={20} color="#D30013" className="flex-shrink-0" />
                  {item['cta-copy'] || 'Download File'}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadBlock;
