import React from 'react';
import { Share2, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { FaFacebook, FaTwitter, FaFacebookF, FaWhatsapp, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa';

const ArticleContent = ({ news, ads, settings, relatedNews, onNewsClick, isLoading }) => {
  const [relatedPage, setRelatedPage] = React.useState(0);

  React.useEffect(() => {
    setRelatedPage(0);
  }, [news?._id]);

  if (!news || isLoading) {
    return <article className="w-full bg-white p-4 lg:p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[600px] rounded-lg">
      <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-lg font-semibold animate-pulse">Loading latest news...</p>
    </article>;
  }

  // Helper to extract YouTube ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news.title);
    let shareUrl = '';

    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${title}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const hasBlocks = news.blocks && news.blocks.length > 0;

  return (
    <article className="w-full">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <a href="#" className="hover:text-brand-blue">Home</a> &raquo; 
        <span className="text-gray-800">News</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-[32px] font-bold leading-tight mb-4 text-gray-900">
        {news.title}
      </h1>

      {/* Author and Date */}
      <div className="flex flex-col sm:flex-row sm:items-center border-t border-b border-gray-200 py-3 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
             <img src="/logo.png" alt="Author" className="w-full h-full object-cover p-1" />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900">AZAD MEDIA LIVE</div>
            <div className="text-xs text-gray-500">{new Date(news.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Featured Image (Main Image) */}
      {news.imageUrl && (
        <div className="mb-8 w-full">
          <img src={news.imageUrl} alt={news.title} className="w-full h-auto max-h-[500px] object-cover bg-gray-50 rounded border border-gray-100" />
        </div>
      )}



      {hasBlocks ? (
        // New Block-based Renderer
        <div className="text-gray-800 text-[17px] leading-8 space-y-6">
          {news.blocks.map((block, index) => {
            let content = null;
            
            if (block.type === 'text') {
              content = <p className="whitespace-pre-wrap text-justify">{block.value}</p>;
            } 
            else if (block.type === 'image' && block.value) {
              const images = (Array.isArray(block.value) ? block.value : [block.value]).filter(v => v);
              const count = images.length;
              if (count > 0) {
                const Collage = () => {
                  if (count === 1) return <img src={images[0]} alt="News content" className="w-full h-auto max-h-[400px] md:max-h-[550px] object-contain bg-gray-50 rounded border border-gray-100" />;
                  
                  const gridClass = "w-full aspect-[4/3] md:aspect-[3/2] max-h-[500px] rounded overflow-hidden";
                  
                  if (count === 2) return (
                    <div className={`grid grid-cols-2 gap-1 ${gridClass}`}>
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      <img src={images[1]} alt="" className="w-full h-full object-cover" />
                    </div>
                  );
                  if (count === 3) return (
                    <div className={`grid grid-cols-2 grid-rows-2 gap-1 ${gridClass}`}>
                      <div className="row-span-2"><img src={images[0]} alt="" className="w-full h-full object-cover" /></div>
                      <div><img src={images[1]} alt="" className="w-full h-full object-cover" /></div>
                      <div><img src={images[2]} alt="" className="w-full h-full object-cover" /></div>
                    </div>
                  );
                  if (count === 4) return (
                    <div className={`grid grid-cols-2 grid-rows-2 gap-1 ${gridClass}`}>
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      <img src={images[1]} alt="" className="w-full h-full object-cover" />
                      <img src={images[2]} alt="" className="w-full h-full object-cover" />
                      <img src={images[3]} alt="" className="w-full h-full object-cover" />
                    </div>
                  );
                  if (count === 5) return (
                    <div className={`grid grid-cols-6 grid-rows-2 gap-1 ${gridClass}`}>
                       <div className="col-span-3"><img src={images[0]} alt="" className="w-full h-full object-cover" /></div>
                       <div className="col-span-3"><img src={images[1]} alt="" className="w-full h-full object-cover" /></div>
                       <div className="col-span-2"><img src={images[2]} alt="" className="w-full h-full object-cover" /></div>
                       <div className="col-span-2"><img src={images[3]} alt="" className="w-full h-full object-cover" /></div>
                       <div className="col-span-2"><img src={images[4]} alt="" className="w-full h-full object-cover" /></div>
                    </div>
                  );
                  return (
                    <div className={`grid grid-cols-3 grid-rows-2 gap-1 ${gridClass}`}>
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                      <img src={images[1]} alt="" className="w-full h-full object-cover" />
                      <img src={images[2]} alt="" className="w-full h-full object-cover" />
                      <img src={images[3]} alt="" className="w-full h-full object-cover" />
                      <img src={images[4]} alt="" className="w-full h-full object-cover" />
                      <img src={images[5]} alt="" className="w-full h-full object-cover" />
                    </div>
                  );
                };
                content = <div className="my-6 w-full"><Collage /></div>;
              }
            } 
            else if (block.type === 'youtube' && block.value) {
              const yId = getYouTubeId(block.value);
              if (yId) {
                content = (
                  <div className="my-8 w-full">
                    <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%]">
                      <iframe 
                        src={`https://www.youtube.com/embed/${yId}`}
                        title="YouTube video player" 
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>
                );
              }
            }
            else if (block.type === 'ad' && block.value) {
              if (block.value.startsWith('http') && !block.value.includes('youtube')) {
                content = (
                  <div className="my-10 w-full flex flex-col items-center">
                     <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                     <img src={block.value} alt="Advertisement" className="w-full h-auto object-contain" />
                  </div>
                );
              } else {
                const activeAd = ads?.find(a => a._id === block.value);
                if (activeAd) {
                  content = (
                    <div className="my-10 w-full flex flex-col items-center">
                       <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                       {activeAd.type.includes('video') ? (
                         <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%] bg-black border border-gray-100">
                            <iframe 
                              src={`https://www.youtube.com/embed/${getYouTubeId(activeAd.contentUrl)}`}
                              title="Advertisement Video" 
                              className="absolute top-0 left-0 w-full h-full"
                              allowFullScreen
                            ></iframe>
                         </div>
                       ) : (
                         <img src={activeAd.contentUrl} alt={activeAd.title} className="w-full h-auto object-contain" />
                       )}
                    </div>
                  );
                }
              }
            }

            // In-between ad insertion
            const inBetweenAdsList = ads?.filter(a => a.type.includes('in_between') && a.isActive) || [];
            let adElement = null;
            if (inBetweenAdsList.length > 0 && index % 2 === 1) { // Insert after every 2nd block
                const adIndex = Math.floor(index / 2);
                const activeAd = inBetweenAdsList[adIndex % inBetweenAdsList.length];
                if (activeAd) {
                    adElement = (
                        <div className="my-10 w-full flex flex-col items-center">
                           <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                           {activeAd.type.includes('video') ? (
                             <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%] bg-black border border-gray-100">
                                <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeAd.contentUrl)}`} title="Advertisement Video" className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                             </div>
                           ) : (
                             <img src={activeAd.contentUrl} alt={activeAd.title} className="w-full h-auto object-contain mx-auto" />
                           )}
                        </div>
                    );
                }
            }

            return (
              <React.Fragment key={index}>
                {content}
                {adElement}
              </React.Fragment>
            );
          })}
          
          {(() => {
             const inBetweenAdsList = ads?.filter(a => a.type.includes('in_between') && a.isActive) || [];
             const slotsUsed = Math.floor(news.blocks.length / 2);
             if (slotsUsed < inBetweenAdsList.length) {
                return inBetweenAdsList.slice(slotsUsed).map((activeAd, idx) => (
                    <div key={`unshown-${idx}`} className="my-10 w-full flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                        {activeAd.type.includes('video') ? (
                          <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%] bg-black border border-gray-100">
                             <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeAd.contentUrl)}`} title="Advertisement Video" className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                          </div>
                        ) : (
                          <img src={activeAd.contentUrl} alt={activeAd.title} className="w-full h-auto object-contain" />
                        )}
                    </div>
                ));
             }
             return null;
          })()}
        </div>
      ) : (
        // Old Legacy Renderer (Fallback)
        <>
          {news.youtubeUrl && getYouTubeId(news.youtubeUrl) && (
            <div className="my-8 w-full">
              <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%]">
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeId(news.youtubeUrl)}`}
                  title="YouTube video player" 
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          )}
          <div className="text-gray-800 text-[17px] leading-8 space-y-6">
            {news.content?.split('\n\n').map((paragraph, index, array) => {
              const isMiddle = index === Math.floor(array.length / 2);
              
              // In-between ad insertion for legacy
              const inBetweenAdsList = ads?.filter(a => a.type.includes('in_between') && a.isActive) || [];
              let adElement = null;
              if (inBetweenAdsList.length > 0 && index % 2 === 1) { // Insert after every 2nd paragraph
                  const adIndex = Math.floor(index / 2);
                  const activeAd = inBetweenAdsList[adIndex % inBetweenAdsList.length];
                  if (activeAd) {
                      adElement = (
                          <div className="my-10 w-full flex flex-col items-center">
                             <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                             {activeAd.type.includes('video') ? (
                               <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%] bg-black border border-gray-100">
                                  <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeAd.contentUrl)}`} title="Advertisement Video" className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                               </div>
                             ) : (
                               <img src={activeAd.contentUrl} alt={activeAd.title} className="w-full h-auto object-contain mx-auto" />
                             )}
                          </div>
                      );
                  }
              }

              return (
                <React.Fragment key={index}>
                  <p className="whitespace-pre-wrap text-justify">{paragraph}</p>
                  {isMiddle && news.middleAdUrl && (
                    <div className="my-10 w-full flex flex-col items-center">
                       <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                       <img src={news.middleAdUrl} alt="Advertisement" className="w-full h-auto object-contain" />
                    </div>
                  )}
                  {adElement}
                </React.Fragment>
              );
            })}
            
            {(() => {
               const paragraphsCount = news.content?.split('\n\n').length || 0;
               const inBetweenAdsList = ads?.filter(a => a.type.includes('in_between') && a.isActive) || [];
               const slotsUsed = Math.floor(paragraphsCount / 2);
               if (slotsUsed < inBetweenAdsList.length) {
                  return inBetweenAdsList.slice(slotsUsed).map((activeAd, idx) => (
                      <div key={`unshown-legacy-${idx}`} className="my-10 w-full flex flex-col items-center">
                          <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-widest">- Advertisement -</span>
                          {activeAd.type.includes('video') ? (
                            <div className="aspect-w-16 aspect-h-9 relative w-full pb-[56.25%] bg-black border border-gray-100">
                               <iframe src={`https://www.youtube.com/embed/${getYouTubeId(activeAd.contentUrl)}`} title="Advertisement Video" className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
                            </div>
                          ) : (
                            <img src={activeAd.contentUrl} alt={activeAd.title} className="w-full h-auto object-contain" />
                          )}
                      </div>
                  ));
               }
               return null;
            })()}
          </div>
        </>
      )}

      {/* Bottom Share */}
      <div className="mt-10 py-5 border-t border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {/* Facebook */}
          <button onClick={() => handleShare('facebook')} className="flex items-stretch bg-[#4d6ea6] text-white rounded-sm hover:opacity-90 transition-opacity text-[13px] font-medium tracking-wide">
            <div className="px-3 py-2 border-r border-white/30 flex items-center justify-center">
              <FaFacebookF className="w-[14px] h-[14px]" />
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center">Facebook</div>
          </button>
          
          {/* Twitter (X) */}
          <button onClick={() => handleShare('twitter')} className="flex items-stretch bg-[#24c4f4] text-white rounded-sm hover:opacity-90 transition-opacity text-[13px] font-medium tracking-wide">
            <div className="px-3 py-2 border-r border-white/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[13px] h-[13px] fill-current" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center">Twitter</div>
          </button>
          
          {/* WhatsApp */}
          <button onClick={() => handleShare('whatsapp')} className="flex items-stretch bg-[#7dc065] text-white rounded-sm hover:opacity-90 transition-opacity text-[13px] font-medium tracking-wide">
            <div className="px-3 py-2 border-r border-white/30 flex items-center justify-center">
              <FaWhatsapp className="w-[15px] h-[15px]" />
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center">WhatsApp</div>
          </button>
          
          {/* LinkedIn */}
          <button onClick={() => handleShare('linkedin')} className="flex items-stretch bg-[#006f9d] text-white rounded-sm hover:opacity-90 transition-opacity text-[13px] font-medium tracking-wide">
            <div className="px-3 py-2 border-r border-white/30 flex items-center justify-center">
              <FaLinkedinIn className="w-[14px] h-[14px]" />
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center">Linkedin</div>
          </button>
          
          {/* Telegram */}
          <button onClick={() => handleShare('telegram')} className="flex items-stretch bg-[#139aeb] text-white rounded-sm hover:opacity-90 transition-opacity text-[13px] font-medium tracking-wide">
            <div className="px-3 py-2 border-r border-white/30 flex items-center justify-center">
              <FaTelegramPlane className="w-[14px] h-[14px]" />
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center">Telegram</div>
          </button>
        </div>
      </div>

      {/* Related Articles */}
      {relatedNews && relatedNews.length > 0 && (() => {
        const itemsPerPage = 3;
        const totalPages = Math.ceil(relatedNews.length / itemsPerPage);
        const startIndex = relatedPage * itemsPerPage;
        const currentItems = relatedNews.slice(startIndex, startIndex + itemsPerPage);

        return (
          <div className="mt-12 mb-4">
            <div className="border-b-2 border-[#222222] mb-6 flex">
              <h3 className="bg-[#222222] text-white text-[13px] font-bold px-4 py-2 uppercase tracking-wide">
                Related Articles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentItems.map(item => {
                let thumb = item.imageUrl;
                if (!thumb) {
                  const firstImgBlock = item.blocks?.find(b => b.type === 'image' && b.value);
                  if (firstImgBlock) {
                    const imgs = (Array.isArray(firstImgBlock.value) ? firstImgBlock.value : [firstImgBlock.value]).filter(v => v);
                    thumb = imgs.length > 0 ? imgs[0] : null;
                  }
                }
                
                return (
                  <div key={item._id} className="flex flex-row md:flex-col gap-4 cursor-pointer group" onClick={() => onNewsClick && onNewsClick(item._id)}>
                    <div className="w-[40%] md:w-full shrink-0 relative">
                      {thumb ? (
                        <img src={thumb} alt={item.title} className="w-full aspect-[4/3] object-cover bg-gray-100" />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>
                      )}
                      <div className="absolute bottom-0 left-0 bg-[#222222] text-white text-[10px] font-bold px-1.5 py-0.5">
                        Gujarat
                      </div>
                    </div>
                    <div className="w-[60%] md:w-full flex flex-col justify-center md:justify-start">
                      <h4 className="text-[14px] md:text-[15px] font-semibold text-gray-800 group-hover:text-brand-blue line-clamp-3 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-start gap-2 mt-6">
              <button 
                onClick={() => setRelatedPage(p => Math.max(0, p - 1))}
                disabled={relatedPage === 0}
                className="w-8 h-8 flex items-center justify-center bg-[#222222] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue transition-colors font-bold"
              >
                &lt;
              </button>
              <button 
                onClick={() => setRelatedPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={relatedPage >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center bg-[#222222] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue transition-colors font-bold"
              >
                &gt;
              </button>
            </div>
          </div>
        );
      })()}
    </article>
  );
};

export default ArticleContent;
