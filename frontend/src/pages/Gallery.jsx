import React from "react";
import Gallery1 from '../assets/Gallery_1.png';
import Gallery2 from '../assets/Gallery_2.png';
import Gallery3 from '../assets/Gallery_3.png';
import Gallery4 from '../assets/Gallery_4.png';
import Gallery5 from '../assets/Gallery_5.png';
import Gallery6 from '../assets/Gallery_6.png';

const Gallery = () => {
  // Dummy image data
  const images = [Gallery1, Gallery2, Gallery3, Gallery4, Gallery5, Gallery6];

  return (
    <div className="min-h-screen p-6 ">
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>GALLERY</p>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mt-10 max-w-7xl mx-auto">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative group ${
              index % 3 === 0
                ? "col-span-2 row-span-2"
                : index % 2 === 0
                ? "col-span-1 row-span-3"
                : "col-span-1 row-span-1"
            }`}
          >
            <img
              src={img}
              alt={`gallery-img-${index}`}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0group-hover:opacity-0 rounded-lg transition-opacity duration-300 ease-in-out flex items-center justify-center">
              {/* Overlay content can go here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
