import React from 'react';
import Icon from './Icon';

/**
 * Example component showing how to use IcoMoon icons
 *
 * Available icons (43 total):
 * - Close-Button, Age-Range, Arrow-Small, Shield
 * - Icon-Camera, Icon-Menu, Icon-Social-RedNote
 * - Icon---PDF, Icon---Download, Icon-Chevron-small
 * - Icon-Minimize, Icon-AI, Icon-Add, Icon-Info
 * - Icon-Alert, Icon-Star, Icon-Chevron-Large
 * - Icon-Cycle, Icon-Cross-Solid, Icon_Tick-Solid
 * - Icon-Hourglass, Icon_External, Icon_Email
 * - Icon-Pin, Icon_Copy, Icon_Phone, Icon-Search
 * - Icon-Arrow, Icon---Lang, Icon-Clock
 * - Icon-Social-WC, Icon-Social-YK, Icon-Social-YT
 * - Icon-Social-LI, Icon-Profile_Add, Icon-Social-FB
 * - Icon-Social-IG, Button-Accordion-Large
 * - Button-Expand, Icon-Home, Icon-Lang-En
 * - Icon-Schools, Icon---Expand
 */

const IconExample = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">IcoMoon Icons Examples</h2>

      {/* Basic Usage */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Basic Icons</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon-Home" size={24} />
          <Icon icon="Icon-Menu" size={24} />
          <Icon icon="Icon-Search" size={24} />
          <Icon icon="Icon-Camera" size={24} />
          <Icon icon="Icon-Star" size={24} />
        </div>
      </section>

      {/* With Colors */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Colored Icons</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon-Alert" size={32} color="#D30013" />
          <Icon icon="Icon-Info" size={32} color="#0066cc" />
          <Icon icon="Icon_Tick-Solid" size={32} color="#00aa00" />
          <Icon icon="Icon-Cross-Solid" size={32} color="#ff0000" />
        </div>
      </section>

      {/* Different Sizes */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Different Sizes</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon-Add" size={16} />
          <Icon icon="Icon-Add" size={24} />
          <Icon icon="Icon-Add" size={32} />
          <Icon icon="Icon-Add" size={48} />
        </div>
      </section>

      {/* Social Icons */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Social Media Icons</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon-Social-FB" size={28} color="#1877f2" />
          <Icon icon="Icon-Social-IG" size={28} color="#E4405F" />
          <Icon icon="Icon-Social-YT" size={28} color="#FF0000" />
          <Icon icon="Icon-Social-LI" size={28} color="#0A66C2" />
        </div>
      </section>

      {/* With Tailwind Classes */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">With Tailwind Classes</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon-Arrow" className="text-red-600 hover:text-red-800 cursor-pointer" size={24} />
          <Icon icon="Icon-Chevron-Large" className="text-blue-500 rotate-90" size={24} />
          <Icon icon="Icon_Email" className="text-gray-700" size={24} />
        </div>
      </section>

      {/* Action Icons */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Action Icons</h3>
        <div className="flex gap-6 items-center">
          <Icon icon="Icon---Download" size={24} />
          <Icon icon="Icon---PDF" size={24} />
          <Icon icon="Icon_Copy" size={24} />
          <Icon icon="Icon_External" size={24} />
          <Icon icon="Icon---Expand" size={24} />
        </div>
      </section>
    </div>
  );
};

export default IconExample;
