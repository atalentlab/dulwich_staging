import React, { useState, useEffect } from 'react';

/**
 * SEODebugger Component
 * Displays a floating debug panel showing all OG and Twitter meta tags
 * Only visible in development mode
 *
 * Usage:
 * Import and add to your App.js:
 * <SEODebugger />
 */
const SEODebugger = () => {
  const [metaTags, setMetaTags] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    const updateMetaTags = () => {
      // Get all OG and Twitter meta tags
      const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]'));
      const twitterTags = Array.from(document.querySelectorAll('meta[name^="twitter:"]'));
      const descTag = document.querySelector('meta[name="description"]');
      const titleTag = document.querySelector('title');

      const allTags = [
        ...(titleTag ? [{
          element: titleTag,
          type: 'title',
          content: titleTag.textContent,
          isHelmet: titleTag.hasAttribute('data-react-helmet')
        }] : []),
        ...(descTag ? [{
          element: descTag,
          type: 'description',
          content: descTag.getAttribute('content'),
          isHelmet: descTag.hasAttribute('data-react-helmet')
        }] : []),
        ...ogTags.map(tag => ({
          element: tag,
          type: tag.getAttribute('property'),
          content: tag.getAttribute('content'),
          isHelmet: tag.hasAttribute('data-react-helmet')
        })),
        ...twitterTags.map(tag => ({
          element: tag,
          type: tag.getAttribute('name'),
          content: tag.getAttribute('content'),
          isHelmet: tag.hasAttribute('data-react-helmet')
        }))
      ];

      setMetaTags(allTags);

      // Check image URLs
      allTags.forEach(tag => {
        if (tag.type?.includes('image') && tag.content) {
          checkImageStatus(tag.content);
        }
      });
    };

    updateMetaTags();

    // Update when DOM changes (for dynamic updates)
    const observer = new MutationObserver(updateMetaTags);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content']
    });

    return () => observer.disconnect();
  }, []);

  const checkImageStatus = (imageUrl) => {
    if (!imageUrl || imageStatus[imageUrl]) return;

    const img = new Image();
    const startTime = Date.now();

    img.onload = () => {
      const loadTime = Date.now() - startTime;
      setImageStatus(prev => ({
        ...prev,
        [imageUrl]: {
          status: 'success',
          width: img.width,
          height: img.height,
          loadTime
        }
      }));
    };

    img.onerror = () => {
      setImageStatus(prev => ({
        ...prev,
        [imageUrl]: { status: 'error' }
      }));
    };

    img.src = imageUrl;
  };

  const copyToClipboard = () => {
    const data = metaTags.map(t => `${t.type}: ${t.content}`).join('\n');
    navigator.clipboard.writeText(data);
    alert('✅ Meta tags copied to clipboard!');
  };

  const exportAsJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      tags: metaTags.reduce((acc, tag) => {
        acc[tag.type] = tag.content;
        return acc;
      }, {}),
      images: imageStatus
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-meta-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#339af0',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 9999,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
        title="Open SEO Debugger"
      >
        🔍
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      maxWidth: '500px',
      maxHeight: '600px',
      overflow: 'auto',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      border: '1px solid #339af0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #444'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#74c0fc' }}>
          🔍 SEO Meta Tags ({metaTags.length})
        </h3>
        <button
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          title="Minimize"
        >
          ✕
        </button>
      </div>

      {/* Warning for CSR */}
      <div style={{
        background: '#f03e3e',
        padding: '8px',
        borderRadius: '4px',
        marginBottom: '10px',
        fontSize: '11px'
      }}>
        ⚠️ <strong>CSR Warning:</strong> If tags have "🔄 React Helmet", they won't work for social media bots!
      </div>

      {/* Meta Tags List */}
      {metaTags.length === 0 ? (
        <p style={{ color: '#ff6b6b' }}>⚠️ No OG/Twitter tags found!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {metaTags.map((tag, i) => {
            const isImage = tag.type?.includes('image');
            const imgStatus = isImage ? imageStatus[tag.content] : null;

            return (
              <div key={i} style={{
                borderLeft: tag.isHelmet ? '3px solid #ffd93d' : '3px solid #51cf66',
                paddingLeft: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '8px',
                borderRadius: '4px'
              }}>
                {/* Tag Type */}
                <div style={{
                  color: '#74c0fc',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{tag.type}</span>
                  {tag.isHelmet && (
                    <span style={{
                      color: '#ffd93d',
                      fontSize: '10px',
                      background: 'rgba(255, 217, 61, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      🔄 Helmet
                    </span>
                  )}
                  {!tag.isHelmet && (
                    <span style={{
                      color: '#51cf66',
                      fontSize: '10px',
                      background: 'rgba(81, 207, 102, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      ✅ Static
                    </span>
                  )}
                </div>

                {/* Tag Content */}
                <div style={{
                  color: '#d0d0d0',
                  wordBreak: 'break-all',
                  fontSize: '11px'
                }}>
                  {isImage ? (
                    <a
                      href={tag.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#74c0fc', textDecoration: 'underline' }}
                    >
                      {tag.content}
                    </a>
                  ) : (
                    tag.content
                  )}
                </div>

                {/* Image Status */}
                {isImage && imgStatus && (
                  <div style={{
                    marginTop: '5px',
                    padding: '5px',
                    background: imgStatus.status === 'success'
                      ? 'rgba(81, 207, 102, 0.2)'
                      : 'rgba(255, 107, 107, 0.2)',
                    borderRadius: '3px',
                    fontSize: '10px'
                  }}>
                    {imgStatus.status === 'success' ? (
                      <>
                        ✅ {imgStatus.width}x{imgStatus.height}px
                        {' • '}{imgStatus.loadTime}ms
                        {imgStatus.width === 1200 && imgStatus.height === 630 ? (
                          <span style={{ color: '#51cf66' }}> • Perfect Size!</span>
                        ) : (
                          <span style={{ color: '#ffd93d' }}> • Recommended: 1200x630px</span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#ff6b6b' }}>❌ Failed to load</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '15px',
        paddingTop: '15px',
        borderTop: '1px solid #444'
      }}>
        <button
          onClick={copyToClipboard}
          style={{
            flex: 1,
            padding: '8px',
            background: '#339af0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          📋 Copy Tags
        </button>

        <button
          onClick={exportAsJSON}
          style={{
            flex: 1,
            padding: '8px',
            background: '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          💾 Export JSON
        </button>

        <button
          onClick={() => window.open('https://www.opengraph.xyz/', '_blank')}
          style={{
            flex: 1,
            padding: '8px',
            background: '#845ef7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          🔗 Test Online
        </button>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '10px',
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
        fontSize: '10px',
        color: '#a0a0a0'
      }}>
        💡 <strong>Tip:</strong> View Page Source (Ctrl+U) to see what bots actually see
      </div>
    </div>
  );
};

export default SEODebugger;
