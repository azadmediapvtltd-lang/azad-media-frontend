import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Sidebar = ({ settings, recentNews, ads, onNewsClick }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  // Determine the active sidebar ad
  const activeSidebarAd = ads?.find(a => a.type === 'right_side_fix' && a.isActive);
  const activeSidebarAdUrl = activeSidebarAd?.contentUrl || settings?.sidebarAdUrl;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ThumbnailCollage = ({ item }) => {
    let coverImg = item.imageUrl;
    if (!coverImg) {
      const firstImgBlock = item.blocks?.find(b => b.type === 'image' && b.value);
      if (firstImgBlock) {
        const imgs = (Array.isArray(firstImgBlock.value) ? firstImgBlock.value : [firstImgBlock.value]).filter(v => v);
        coverImg = imgs.length > 0 ? imgs[0] : null;
      }
    }

    if (!coverImg) return null;

    const containerClass = "w-[120px] h-[80px] flex-shrink-0 group-hover:opacity-90 transition-opacity overflow-hidden";
    return <img src={coverImg} alt={item.title} className={`${containerClass} object-cover`} />;
  };

  return (
    <div className="w-full md:flex-1 md:sticky md:-top-[400px] lg:-top-[300px] xl:-top-[100px] self-start">
      <aside className="space-y-4">
        {/* Sidebar Top Ad (1080x1080) */}
        {(activeSidebarAd || settings?.sidebarAdUrl) && (
          <div className="text-center w-full flex flex-col items-center">
            <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
            {activeSidebarAd && activeSidebarAd.type.includes('video') ? (
              <div className="w-full aspect-video border border-gray-100 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeSidebarAd.contentUrl)}`}
                  title="Advertisement Video"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img src={activeSidebarAdUrl} alt="Advertisement" className="w-full max-w-[320px] md:max-w-full h-auto max-h-[250px] object-contain bg-gray-50 border border-gray-100 mx-auto" />
            )}
          </div>
        )}

        {/* Social Followers */}
        <div className="border border-gray-200">
          <h3 className="font-bold text-base m-3 mb-2 border-l-4 border-brand-red pl-2 text-gray-800">Connect With Us</h3>
          <div className="grid grid-cols-1 mb-3 mx-3 gap-2">
            {settings?.socialLinks?.facebook?.startsWith('http') && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] text-white flex items-center justify-between px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2"><FaFacebook className="w-4 h-4" /> <span className="text-sm font-semibold">120K</span></div>
                <div className="text-[11px] uppercase tracking-wider opacity-90">Fans</div>
              </a>
            )}
            {settings?.socialLinks?.twitter?.startsWith('http') && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-[#1DA1F2] text-white flex items-center justify-between px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2"><FaTwitter className="w-4 h-4" /> <span className="text-sm font-semibold">45K</span></div>
                <div className="text-[11px] uppercase tracking-wider opacity-90">Followers</div>
              </a>
            )}
            {(settings?.socialLinks?.instagram || "https://www.instagram.com/azadmedialive2026?igsi=MTNrMTRtbzhpZDZpbA==") && (
              <a href={settings?.socialLinks?.instagram || "https://www.instagram.com/azadmedialive2026?igsi=MTNrMTRtbzhpZDZpbA=="} target="_blank" rel="noopener noreferrer" className="bg-[#E4405F] text-white flex items-center justify-between px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2"><FaInstagram className="w-4 h-4" /> <span className="text-sm font-semibold">978</span></div>
                <div className="text-[11px] uppercase tracking-wider opacity-90">Followers</div>
              </a>
            )}
            {(settings?.socialLinks?.youtube || "https://youtube.com/@azadmedialive?si=wM41CSXhNnxtJg3P") && (
              <a href={settings?.socialLinks?.youtube || "https://youtube.com/@azadmedialive?si=wM41CSXhNnxtJg3P"} target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] text-white flex items-center justify-between px-3 py-1.5 rounded-sm hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2"><FaYoutube className="w-4 h-4" /> <span className="text-sm font-semibold">5.29K</span></div>
                <div className="text-[11px] uppercase tracking-wider opacity-90">Subscribers</div>
              </a>
            )}
          </div>
        </div>

        {/* Recent News Widget */}
        <div className="mb-4">
          <div className="bg-[#181818] text-white p-2.5 flex justify-between items-center border-l-4 border-brand-red">
            <h3 className="font-bold text-sm tracking-wide uppercase">Most Popular</h3>
          </div>
          <div className="pt-5 space-y-6">
            {recentNews?.length > 0 ? recentNews.slice(0, visibleCount).map((item) => {
              const d = new Date(item.createdAt);
              const timeStr = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
              const formattedDate = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${timeStr}`;

              return (
                <div
                  key={item._id}
                  className="flex gap-4 items-start cursor-pointer group"
                  onClick={() => onNewsClick && onNewsClick(item._id)}
                >
                  <ThumbnailCollage item={item} />
                  <div className="flex-1">
                    <h4 className="text-[15px] font-normal leading-snug text-gray-800 group-hover:text-brand-blue line-clamp-3 transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-[12px] text-gray-500 mt-1.5">
                      {formattedDate}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-gray-500">No news available</p>
            )}

            {recentNews?.length > 0 && (
              <div className="mt-6 pt-2">
                <button
                  onClick={() => {
                    window.location.href = '/all-news';
                  }}
                  className="border border-gray-300 text-gray-500 px-5 py-2 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm bg-white"
                >
                  Load more <span>&gt;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
