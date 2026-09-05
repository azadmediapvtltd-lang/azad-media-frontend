import React, { useState, useEffect } from 'react';
import { X, ChevronUp } from 'lucide-react';

const PopupNews = ({ news, onNewsClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 300px, hide if at top
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!news || !isVisible) return null;

  const ThumbnailCollage = ({ item }) => {
    const blockImages = item.blocks?.filter(b => b.type === 'image' && b.value).flatMap(b => Array.isArray(b.value) ? b.value : [b.value]).filter(v => v) || [];
    let images = blockImages.length > 1 ? blockImages : (item.imageUrl ? [item.imageUrl] : blockImages);
    
    if (images.length === 0) return null;
    const count = images.length;
    const containerClass = "w-full h-36 object-cover rounded mb-2 overflow-hidden";
    
    if (count === 1) return <img src={images[0]} alt={item.title} className={`${containerClass}`} />;
    
    if (count === 2) return (
      <div className={`${containerClass} grid grid-cols-2 gap-[1px]`}>
        <img src={images[0]} alt="" className="w-full h-full object-cover" />
        <img src={images[1]} alt="" className="w-full h-full object-cover" />
      </div>
    );
    
    if (count === 3) return (
      <div className={`${containerClass} grid grid-cols-2 grid-rows-2 gap-[1px]`}>
        <div className="row-span-2"><img src={images[0]} alt="" className="w-full h-full object-cover" /></div>
        <div><img src={images[1]} alt="" className="w-full h-full object-cover" /></div>
        <div><img src={images[2]} alt="" className="w-full h-full object-cover" /></div>
      </div>
    );
    
    if (count === 4) return (
      <div className={`${containerClass} grid grid-cols-2 grid-rows-2 gap-[1px]`}>
        <img src={images[0]} alt="" className="w-full h-full object-cover" />
        <img src={images[1]} alt="" className="w-full h-full object-cover" />
        <img src={images[2]} alt="" className="w-full h-full object-cover" />
        <img src={images[3]} alt="" className="w-full h-full object-cover" />
      </div>
    );
    
    return (
      <div className={`${containerClass} grid grid-cols-3 grid-rows-2 gap-[1px]`}>
        {images.slice(0, 6).map((img, idx) => (
          <img key={idx} src={img} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
    );
  };

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white border border-gray-200 shadow-2xl w-72 md:w-80 rounded flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">More Stories</span>
          <button 
            onClick={() => {
              setIsDismissed(true);
              setIsVisible(false);
            }} 
            className="text-gray-500 hover:text-black hover:bg-gray-200 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* News Content */}
        <div 
          className="p-3 cursor-pointer hover:bg-gray-50 group transition-colors"
          onClick={() => {
            if (onNewsClick) onNewsClick(news._id);
            setIsDismissed(true);
          }}
        >
          <ThumbnailCollage item={news} />
          <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand-blue line-clamp-3 leading-tight mb-2">
            {news.title}
          </h4>
          <div className="flex justify-between items-center mt-2">
             <span className="text-xs font-bold text-brand-red">AZAD MEDIA LIVE</span>
             <span className="text-xs text-gray-500">{new Date(news.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Scroll to Top Button attached to popup */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute -top-10 right-0 bg-brand-blue text-white p-2 shadow hover:bg-blue-700 transition-colors"
          title="Scroll to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PopupNews;
