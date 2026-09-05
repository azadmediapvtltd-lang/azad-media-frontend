import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const ThumbnailCollage = ({ item, className }) => {
  let coverImg = item.imageUrl;
  if (!coverImg) {
    const firstImgBlock = item.blocks?.find(b => b.type === 'image' && b.value);
    if (firstImgBlock) {
      const imgs = (Array.isArray(firstImgBlock.value) ? firstImgBlock.value : [firstImgBlock.value]).filter(v => v);
      coverImg = imgs.length > 0 ? imgs[0] : null;
    }
  }
  
  if (!coverImg) return <div className={`${className} bg-gray-200`}></div>;
  
  return <img src={coverImg} alt={item.title} className={`${className} object-cover`} />;
};

const AllNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchData = async () => {
      try {
        const [newsRes, settingsRes, adsRes] = await Promise.all([
          axios.get(`${API_URL}/api/news`),
          axios.get(`${API_URL}/api/settings`),
          axios.get(`${API_URL}/api/ads`)
        ]);
        setNewsList(newsRes.data);
        setSettings(settingsRes.data);
        setAds(adsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleNewsClick = (id) => {
    navigate(`/?newsId=${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row  gap-6 md:gap-8">
          
          {/* Main Content Column (65%) */}
          <div className="w-full md:w-[65%] md:pr-4 flex flex-col">
            <div className="bg-white p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 rounded">
               <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-brand-red pl-3 uppercase tracking-wide">All News</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                 {newsList.map((news) => {
                    const d = new Date(news.createdAt);
                    const timeStr = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
                    const formattedDate = `${d.toLocaleString('en-US', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${timeStr}`;

                    return (
                        <div key={news._id} className="group cursor-pointer flex flex-col" onClick={() => handleNewsClick(news._id)}>
                            <ThumbnailCollage item={news} className="w-full aspect-[4/3] rounded overflow-hidden mb-3 bg-gray-100" />
                            <h3 className="text-[17px] font-bold text-gray-800 group-hover:text-brand-blue leading-tight mb-2 line-clamp-3 transition-colors">
                                {news.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-auto">
                                <span className="text-xs font-bold text-gray-900">AZAD MEDIA LIVE</span>
                                <span className="text-[11px] text-gray-500">- {formattedDate}</span>
                            </div>
                        </div>
                    );
                 })}
               </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <Sidebar settings={settings} recentNews={newsList} ads={ads} onNewsClick={handleNewsClick} />
        </div>
      </main>
      
      <Footer settings={settings} recentNews={newsList.slice(0, 3)} onNewsClick={handleNewsClick} />
    </div>
  );
};

export default AllNews;
