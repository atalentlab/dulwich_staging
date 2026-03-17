import React from 'react';

/**
 * Default/Fallback Block Component
 * Displayed when block type is not recognized
 * Helps with debugging and prevents crashes
 */
const DefaultBlock = ({ block }) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <section className="py-8 px-4 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Placeholder Block: "{block.type}"
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This block type is using a placeholder component. Create a specific component to customize its rendering.
                </p>
                <p className="mt-2">Block ID: {block.id}</p>
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">
                    View block data
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
                    {JSON.stringify(block, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // In production, render nothing for unknown blocks
  return null;
};

export default DefaultBlock;
