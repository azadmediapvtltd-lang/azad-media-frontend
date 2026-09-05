import React, { useState, useEffect } from 'react';
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import ArticleContent from './components/ArticleContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PopupNews from './components/PopupNews';
import AllNews from './components/AllNews';

const MainLayout = () => {
  const [newsList, setNewsList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [ads, setAds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryNewsId = searchParams.get('newsId');
  const [selectedNewsId, setSelectedNewsId] = useState(queryNewsId || null);
  const [isChangingNews, setIsChangingNews] = useState(false);

  useEffect(() => {
    if (queryNewsId && !isChangingNews) setSelectedNewsId(queryNewsId);
  }, [queryNewsId]);

  useEffect(() => {
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

  const currentNews = newsList.find(n => n._id === selectedNewsId) || (newsList.length > 0 ? newsList[0] : null);
  const otherNews = newsList.filter(n => n._id !== currentNews?._id);

  const handleNewsClick = (id) => {
    setIsChangingNews(true);
    window.scrollTo({ top: 0 });
    
    setTimeout(() => {
      setSelectedNewsId(id);
      setSearchParams({ newsId: id });
      setIsChangingNews(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row  gap-6 md:gap-8">
          {/* Main Content Column (65%) */}
          <div className="w-full md:w-[65%] md:pr-4 flex flex-col">
            <ArticleContent news={currentNews} ads={ads} settings={settings} relatedNews={otherNews} onNewsClick={handleNewsClick} isLoading={isChangingNews} />
          </div>
          
          <Sidebar settings={settings} recentNews={otherNews} ads={ads} onNewsClick={handleNewsClick} />
        </div>
      </main>

      <Footer settings={settings} recentNews={newsList.slice(0, 3)} onNewsClick={handleNewsClick} />
      
      {otherNews.length > 0 && <PopupNews news={otherNews[Math.floor(Math.random() * otherNews.length)]} onNewsClick={handleNewsClick} />}
    </div>
  );
};


const ProtectedAdmin = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  if (!token) {
    return <Login onLogin={setToken} />;
  }
  
  // Intercept 401s to logout
  axios.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      setToken(null);
    }
    return Promise.reject(error);
  });

  return <AdminPanel onLogout={() => { localStorage.removeItem('adminToken'); setToken(null); }} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/all-news" element={<AllNews />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
