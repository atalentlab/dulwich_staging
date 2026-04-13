import React from 'react';
import curriculumImage from '../assets/images/DCSZ/DCSZ_Holistic_Curriculum.JPG';
const ImageBlock = () => {
  return (
    <div className="w-full">
      <img
        src={curriculumImage}
        alt="Curriculum"
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default ImageBlock;
