import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Plus, X, Trash2, Edit2, LogOut, ArrowUp, ArrowDown } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsList, setNewsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Forms
  const [newsTitle, setNewsTitle] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsBlocks, setNewsBlocks] = useState([{ id: Date.now(), type: 'text', value: '' }]);

  const [editingNewsId, setEditingNewsId] = useState(null);

  const [settingsForm, setSettingsForm] = useState({ 
      footerAbout: '', footerTagline: '', contactEmail: '', contactAddress: '', contactPhone: '', copyrightText: '', sidebarAdUrl: '', sidebarAdId: '', 
      inBetweenAds: [],
      socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' } 
  });

  const [adsList, setAdsList] = useState([]);
  const [adForm, setAdForm] = useState({ title: '', type: 'in_between_banner', contentUrl: '' });

  useEffect(() => {
    fetchNews();
    fetchSettings();
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ads');
      setAdsList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/ads', adForm);
      setAdForm({ title: '', type: 'in_between_banner', contentUrl: '' });
      fetchAds();
    } catch (err) {
      alert('Error saving ad');
    }
  };

  const deleteAd = async (id) => {
    if(window.confirm('Are you sure you want to delete this ad?')) {
        try {
            await axios.delete(`http://localhost:5000/api/ads/${id}`);
            fetchAds();
        } catch(err) {
            alert('Error deleting ad');
        }
    }
  };

  const toggleAdActive = async (ad) => {
    try {
      if (ad.type === 'right_side_fix' && !ad.isActive) {
        // If turning ON a right side ad, turn off all other right side ads first
        const otherActive = adsList.filter(a => a.type === 'right_side_fix' && a.isActive && a._id !== ad._id);
        for (let other of otherActive) {
          await axios.put(`http://localhost:5000/api/ads/${other._id}`, { isActive: false });
        }
      }
      await axios.put(`http://localhost:5000/api/ads/${ad._id}`, { isActive: !ad.isActive });
      fetchAds();
    } catch (err) {
      alert('Error toggling ad status');
    }
  };

  const handleAdImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAdForm({ ...adForm, contentUrl: res.data.url });
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/news');
      setNewsList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/settings');
      if (res.data) setSettingsForm(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const insertBlock = (index) => {
    const newBlocks = [...newsBlocks];
    newBlocks.splice(index + 1, 0, { id: Date.now(), type: 'text', value: '' });
    setNewsBlocks(newBlocks);
  };

  const updateBlock = (id, value) => {
    setNewsBlocks(newsBlocks.map(b => b.id === id ? { ...b, value } : b));
  };

  const updateBlockType = (id, newType) => {
    setNewsBlocks(newsBlocks.map(b => b.id === id ? { ...b, type: newType, value: newType === 'image' ? [''] : '' } : b));
  };

  const addImageToBlock = (id) => {
    setNewsBlocks(newsBlocks.map(b => {
      if (b.id === id) {
        const valArray = Array.isArray(b.value) ? [...b.value] : (b.value ? [b.value] : []);
        if (valArray.length < 6) return { ...b, value: [...valArray, ''] };
      }
      return b;
    }));
  };

  const removeImageFromBlock = (id, imgIndex) => {
    setNewsBlocks(newsBlocks.map(b => {
      if (b.id === id && Array.isArray(b.value)) {
        return { ...b, value: b.value.filter((_, idx) => idx !== imgIndex) };
      }
      return b;
    }));
  };

  const updateImageInBlock = (id, imgIndex, url) => {
    setNewsBlocks(newsBlocks.map(b => {
      if (b.id === id) {
        const valArray = Array.isArray(b.value) ? [...b.value] : (b.value ? [b.value] : ['']);
        valArray[imgIndex] = url;
        return { ...b, value: valArray };
      }
      return b;
    }));
  };

  const handleMainImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewsImageUrl(res.data.url);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateBlock(id, res.data.url);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const handleMultiFileUpload = async (id, imgIndex, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateImageInBlock(id, imgIndex, res.data.url);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const handleSettingsFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettingsForm({ ...settingsForm, sidebarAdUrl: res.data.url });
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const removeBlock = (id) => {
    setNewsBlocks(newsBlocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newBlocks = [...newsBlocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setNewsBlocks(newBlocks);
    } else if (direction === 'down' && index < newsBlocks.length - 1) {
      const newBlocks = [...newsBlocks];
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      setNewsBlocks(newBlocks);
    }
  };

  const resetNewsForm = () => {
    setNewsTitle('');
    setNewsImageUrl('');
    setNewsBlocks([{ id: Date.now(), type: 'text', value: '' }]);
    setEditingNewsId(null);
    setIsModalOpen(false);
  };

  const editNews = (news) => {
    setNewsTitle(news.title);
    setNewsImageUrl(news.imageUrl || '');
    if (news.blocks && news.blocks.length > 0) {
      setNewsBlocks(news.blocks.map((b, i) => {
        let val = b.value;
        if (b.type === 'image' && !Array.isArray(val)) val = val ? [val] : [''];
        return { id: Date.now() + i, type: b.type, value: val };
      }));
    } else {
      setNewsBlocks([{ id: Date.now(), type: 'text', value: news.content || '' }]); // fallback for legacy
    }
    setEditingNewsId(news._id);
    setIsModalOpen(true);
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newsTitle,
        imageUrl: newsImageUrl,
        blocks: newsBlocks.map(b => ({ type: b.type, value: b.value }))
      };
      
      if (editingNewsId) {
        await axios.put(`http://localhost:5000/api/news/${editingNewsId}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/news', payload);
      }
      
      resetNewsForm();
      fetchNews();
    } catch (err) {
      alert('Error saving news');
    }
  };

  const deleteNews = async (id) => {
    if(window.confirm('Are you sure you want to delete this news?')) {
        try {
            await axios.delete(`http://localhost:5000/api/news/${id}`);
            fetchNews();
        } catch(err) {
            alert('Error deleting news');
        }
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/settings', settingsForm);
      alert('Settings updated successfully!');
    } catch (err) {
      alert('Error updating settings');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-brand-red">AZAD</h2>
          <p className="text-xs tracking-widest text-gray-400">ADMIN PANEL</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'news' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" /> All News
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'settings' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === 'ads' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Advertisements
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
            <LogOut className="w-4 h-4" /> View Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab === 'news' ? 'Manage News' : activeTab === 'settings' ? 'Website Settings' : 'Manage Advertisements'}
          </h1>
          
          {activeTab === 'news' && (
            <button 
              onClick={() => { resetNewsForm(); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create News
            </button>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          
          {/* News Tab */}
          {activeTab === 'news' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {newsList.map(news => (
                    <tr key={news._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-800 line-clamp-1">{news.title}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{new Date(news.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => editNews(news)} 
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteNews(news._id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newsList.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No news found. Click "Create News" to add some.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Global Settings</h3>
                  <p className="text-sm text-gray-500 mb-4">Manage footer content and social media links.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Tagline</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" 
                    value={settingsForm.footerTagline || ''} 
                    onChange={e => setSettingsForm({...settingsForm, footerTagline: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Footer About Text</label>
                  <textarea 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all h-24 resize-none" 
                    value={settingsForm.footerAbout} 
                    onChange={e => setSettingsForm({...settingsForm, footerAbout: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={settingsForm.contactEmail} 
                      onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={settingsForm.contactPhone || ''} 
                      onChange={e => setSettingsForm({...settingsForm, contactPhone: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Address</label>
                  <textarea 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none h-16 resize-none" 
                    value={settingsForm.contactAddress || ''} 
                    onChange={e => setSettingsForm({...settingsForm, contactAddress: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Copyright Text</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none text-sm text-gray-600" 
                    value={settingsForm.copyrightText || ''} 
                    onChange={e => setSettingsForm({...settingsForm, copyrightText: e.target.value})} 
                    placeholder="© 2024 AZAD MEDIA LIVE. All Rights Reserved."
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                      <input type="url" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={settingsForm.socialLinks?.facebook || ''} onChange={e => setSettingsForm({...settingsForm, socialLinks: {...settingsForm.socialLinks, facebook: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter URL</label>
                      <input type="url" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={settingsForm.socialLinks?.twitter || ''} onChange={e => setSettingsForm({...settingsForm, socialLinks: {...settingsForm.socialLinks, twitter: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                      <input type="url" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={settingsForm.socialLinks?.instagram || ''} onChange={e => setSettingsForm({...settingsForm, socialLinks: {...settingsForm.socialLinks, instagram: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                      <input type="url" className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={settingsForm.socialLinks?.youtube || ''} onChange={e => setSettingsForm({...settingsForm, socialLinks: {...settingsForm.socialLinks, youtube: e.target.value}})} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-800">Create New Advertisement</h3>
                <form onSubmit={handleAdSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Title</label>
                    <input type="text" required className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} placeholder="e.g. Navratri Special Banner" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Type</label>
                    <select className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={adForm.type} onChange={e => setAdForm({...adForm, type: e.target.value})}>
                      <option value="in_between_banner">In-between News (Banner)</option>
                      <option value="in_between_video">In-between News (Video)</option>
                      <option value="right_side_fix">Right Side Fix Ad</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{(adForm.type === 'in_between_banner' || adForm.type === 'right_side_fix') ? 'Image URL or Upload' : 'YouTube Video URL'}</label>
                    <div className="flex gap-2">
                      <input type="url" required className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" value={adForm.contentUrl} onChange={e => setAdForm({...adForm, contentUrl: e.target.value})} placeholder={(adForm.type === 'in_between_banner' || adForm.type === 'right_side_fix') ? "https://..." : "https://youtube.com/watch?v=..."} />
                      {(adForm.type === 'in_between_banner' || adForm.type === 'right_side_fix') && (
                        <input type="file" accept="image/*" onChange={e => handleAdImageUpload(e.target.files[0])} className="text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:cursor-pointer" />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                      Create Ad
                    </button>
                  </div>
                </form>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Active</th>
                    <th className="p-4 font-semibold">Ad Title</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {adsList.map(ad => (
                    <tr key={ad._id} className={`hover:bg-gray-50 transition-colors ${ad.isActive ? 'bg-blue-50/30' : ''}`}>
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={ad.isActive || false}
                          onChange={() => toggleAdActive(ad)}
                          className="w-5 h-5 cursor-pointer accent-brand-blue"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-800">{ad.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-sm uppercase ${ad.type.includes('video') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {ad.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteAd(ad._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {adsList.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500">No ads created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit News Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-gray-800">{editingNewsId ? 'Edit News' : 'Create New News'}</h2>
              <button onClick={resetNewsForm} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                
                {/* Meta */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">News Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" 
                    value={newsTitle} 
                    onChange={e => setNewsTitle(e.target.value)} 
                    placeholder="Enter news headline"
                  />
                </div>



                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-800 mb-4">News Content Builder</h3>
                  <p className="text-sm text-gray-500 mb-4">Add and arrange paragraphs, images, videos, and ads exactly how you want them to appear.</p>
                  
                  <div className="space-y-4 mb-6">
                    {newsBlocks.map((block, index) => (
                      <React.Fragment key={block.id}>
                        <div className="border border-gray-200 rounded bg-gray-50 p-4 relative flex gap-4">
                        <div className="flex flex-col gap-1 items-center justify-center border-r border-gray-200 pr-4">
                           <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-black disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                           <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                           <button onClick={() => moveBlock(index, 'down')} disabled={index === newsBlocks.length - 1} className="text-gray-400 hover:text-black disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <select 
                               className="text-xs font-bold uppercase text-brand-blue tracking-wider bg-transparent outline-none cursor-pointer border-b border-brand-blue/30 pb-1"
                               value={block.type}
                               onChange={(e) => updateBlockType(block.id, e.target.value)}
                             >
                               <option value="text">TEXT BLOCK</option>
                               <option value="image">IMAGE BLOCK</option>
                              </select>
                             <button onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Delete Block"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          
                          {block.type === 'text' && (
                            <textarea 
                              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none h-32 resize-none" 
                              value={block.value} 
                              onChange={e => updateBlock(block.id, e.target.value)}
                              placeholder="Type paragraph here..."
                            />
                          )}
                          
                          {block.type === 'image' && (
                            <div className="flex flex-col gap-4">
                              {(Array.isArray(block.value) ? block.value : [block.value]).map((url, imgIdx) => (
                                <div key={imgIdx} className="border border-gray-200 p-3 rounded bg-white relative">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Image {imgIdx + 1}</span>
                                    {(Array.isArray(block.value) ? block.value.length : 1) > 1 && (
                                      <button onClick={() => removeImageFromBlock(block.id, imgIdx)} className="text-red-500 text-xs hover:underline">Remove</button>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <input 
                                      type="url" 
                                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-brand-blue outline-none text-sm" 
                                      value={url || ''} 
                                      onChange={e => updateImageInBlock(block.id, imgIdx, e.target.value)}
                                      placeholder="Image URL (e.g. https://domain.com/img.jpg)"
                                    />
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-gray-500">OR Upload:</span>
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => handleMultiFileUpload(block.id, imgIdx, e.target.files[0])}
                                        className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-700"
                                      />
                                    </div>
                                    {url && (
                                      <div className="mt-2">
                                        <img src={url} alt="Preview" className="h-20 w-auto object-cover rounded border border-gray-200" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {(Array.isArray(block.value) ? block.value.length : 1) < 6 && (
                                <button 
                                  onClick={() => addImageToBlock(block.id)}
                                  className="text-sm text-brand-blue font-semibold hover:underline self-start"
                                >
                                  + Add Another Image (Max 6)
                                </button>
                              )}
                            </div>
                          )}
                          
                          {block.type === 'youtube' && (
                            <input 
                              type="url" 
                              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-brand-blue outline-none" 
                              value={block.value} 
                              onChange={e => updateBlock(block.id, e.target.value)}
                              placeholder="YouTube Video URL (e.g. https://youtube.com/watch?v=...)"
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Insert Block Button */}
                      {index < newsBlocks.length - 1 && (
                        <div className="flex justify-center -my-3 relative z-10">
                           <button 
                             onClick={() => insertBlock(index)}
                             title={`Insert block here`}
                             className="bg-brand-blue text-white rounded-full p-1 shadow hover:scale-110 transition-transform"
                           >
                             <Plus className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                  <div className="flex justify-center mb-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setNewsBlocks([...newsBlocks, { id: Date.now(), type: 'text', value: '' }]);
                      }}
                      className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium hover:bg-black transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add New Block
                    </button>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={resetNewsForm}
                className="px-6 py-2.5 rounded-md font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleNewsSubmit}
                disabled={!newsTitle}
                className="px-6 py-2.5 rounded-md font-medium bg-brand-blue text-white hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {editingNewsId ? 'Update News' : 'Publish News'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
