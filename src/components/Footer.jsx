import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = ({ settings, recentNews, onNewsClick }) => {
  return (
    <footer className="bg-[#111111] text-white pt-12 pb-6 mt-12 border-t-4 border-brand-blue relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <div className="flex flex-col mb-4">
              {settings?.footerTagline && (
                <p className="text-brand-blue font-semibold text-sm mb-2">{settings.footerTagline}</p>
              )}
              <div className="flex items-center">
                <img src="/logo.png" alt="AZAD MEDIA LIVE" className="h-16 w-auto bg-white rounded p-1" />
                <div className="flex flex-col ml-3">
                   <span className="text-white font-bold text-3xl leading-none">AZAD</span>
                   <span className="text-sm text-gray-300 tracking-widest">MEDIA LIVE</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed text-justify">
              {settings?.footerAbout || 'AZAD MEDIA LIVE is a leading news portal. We deliver the latest news, business, sports, and entertainment information first.'}
            </p>
          </div>

          {/* Column 2: Popular Posts */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">Popular Posts</h4>
            <div className="space-y-4">
              {recentNews?.length > 0 ? recentNews.map((item) => {
                let thumb = item.imageUrl;
                if (!thumb) {
                  const firstImgBlock = item.blocks?.find(b => b.type === 'image' && b.value);
                  if (firstImgBlock) {
                    const imgs = (Array.isArray(firstImgBlock.value) ? firstImgBlock.value : [firstImgBlock.value]).filter(v => v);
                    thumb = imgs.length > 0 ? imgs[0] : null;
                  }
                }
                return (
                  <div 
                    key={item._id} 
                    className="flex gap-4 items-center group cursor-pointer"
                    onClick={() => onNewsClick && onNewsClick(item._id)}
                  >
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="w-20 h-14 object-cover rounded opacity-90 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-20 h-14 bg-gray-800 rounded flex items-center justify-center overflow-hidden text-[8px] text-gray-500 p-1 text-center border border-gray-700">No Image</div>
                    )}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-300 group-hover:text-white line-clamp-2 leading-snug transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                 <p className="text-sm text-gray-500">No popular posts.</p>
              )}
            </div>
          </div>

          {/* Column 3: Follow Us & Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-white">Follow Us</h4>
            <div className="flex space-x-3 mb-6">
              {settings?.socialLinks?.facebook?.startsWith('http') && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#181818] p-3 rounded border border-gray-800 hover:bg-brand-blue hover:border-brand-blue transition-colors"><FaFacebook className="w-4 h-4" /></a>
              )}
              {(settings?.socialLinks?.instagram || "https://www.instagram.com/azadmedialive2026?igsi=MTNrMTRtbzhpZDZpbA==") && (
                <a href={settings?.socialLinks?.instagram || "https://www.instagram.com/azadmedialive2026?igsi=MTNrMTRtbzhpZDZpbA=="} target="_blank" rel="noopener noreferrer" className="bg-[#181818] p-3 rounded border border-gray-800 hover:bg-pink-600 hover:border-pink-600 transition-colors"><FaInstagram className="w-4 h-4" /></a>
              )}
              {settings?.socialLinks?.twitter?.startsWith('http') && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="bg-[#181818] p-3 rounded border border-gray-800 hover:bg-blue-400 hover:border-blue-400 transition-colors"><FaTwitter className="w-4 h-4" /></a>
              )}
              {(settings?.socialLinks?.youtube || "https://youtube.com/@azadmedialive?si=wM41CSXhNnxtJg3P") && (
                <a href={settings?.socialLinks?.youtube || "https://youtube.com/@azadmedialive?si=wM41CSXhNnxtJg3P"} target="_blank" rel="noopener noreferrer" className="bg-[#181818] p-3 rounded border border-gray-800 hover:bg-red-600 hover:border-red-600 transition-colors"><FaYoutube className="w-4 h-4" /></a>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-400 mb-6">
              {settings?.contactAddress && (
                <p><span className="text-gray-200">Address:</span> {settings.contactAddress}</p>
              )}
              {settings?.contactEmail && (
                <p><span className="text-gray-200">Email:</span> <a href={`mailto:${settings.contactEmail}`} className="text-brand-blue hover:underline">{settings.contactEmail}</a></p>
              )}
              {settings?.contactPhone && (
                <p><span className="text-gray-200">Phone No:</span> {settings.contactPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs mt-4">
          <p>{settings?.copyrightText || '© 2024 AZAD MEDIA LIVE. All Rights Reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
