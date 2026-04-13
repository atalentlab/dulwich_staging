import React from 'react';
import IcoMoon from 'react-icomoon';
import iconSet from '../assets/icomoon/selection.json';

const Icon = ({ icon, size = 16, color, className, ...props }) => {
  return (
    <IcoMoon
      iconSet={iconSet}
      icon={icon}
      size={size}
      color={color}
      className={className}
      {...props}
    />
  );
};

export default Icon;
