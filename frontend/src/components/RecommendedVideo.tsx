import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface VideoItem {
  title: string;
  url: string;
  thumbnail_url: string;
}

interface RecommendedVideosProps {
  topic: string;
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({ topic }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, getToken } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!topic || !isAuthenticated) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const token = await getToken();
        
        if (!token) {
          setError('Authentication failed. Please log in again.');
          return;
        }
        
        const response = await fetch('http://localhost:8000/api/video-links/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify({ topic }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        
        const data = await response.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error('Error fetching recommended videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommended videos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [topic, isAuthenticated, getToken]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="bg-[#2f3136] rounded-xl shadow-lg border border-[#202225] overflow-hidden mb-6">
      <div className="p-6 border-b border-[#40444b]">
        <h3 className="text-xl font-bold flex items-center">
          <span className="text-[#8e6bff] mr-2">🎬</span> Learning Resources
        </h3>
        <p className="text-[#b9bbbe] mt-2 text-sm">
          Explore these curated videos about {topic} <span className="text-xs ml-2">(scroll horizontally to see more)</span>
        </p>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin h-10 w-10 border-3 border-[#8e6bff] border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-[#202225] p-4 rounded-lg border border-[#40444b] text-center">
            <p className="text-[#dcddde]">
              <span className="text-[#8e6bff] mr-2">⚠️</span>
              {error}
            </p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-[#202225] p-6 rounded-lg border border-[#40444b] text-center">
            <p className="text-[#dcddde]">
              <span className="text-[#8e6bff] mr-2">📺</span>
              No recommended videos found for this topic
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Left fade indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#2f3136] to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable container */}
            <div className="flex overflow-x-auto pb-4 space-x-6 scrollbar-thin scrollbar-thumb-[#40444b] scrollbar-track-transparent scrollbar-thumb-rounded-full">
              {videos.map((video, index) => (
                <a 
                  key={index}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-[#40444b] hover:border-[#8e6bff] flex-shrink-0"
                  style={{ width: '380px' }}
                >
                  <div className="relative">
                    <div className="aspect-video bg-[#202225] w-full overflow-hidden">
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Modified overlay to make it less dark on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 bg-[#8e6bff] rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#202225]">
                    <p className="text-sm text-[#dcddde] line-clamp-2 font-medium group-hover:text-white transition-colors duration-200">
                      {video.title}
                    </p>
                    <div className="flex items-center mt-2">
                      <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      <span className="ml-1 text-xs text-[#b9bbbe]">YouTube</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Right fade indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#2f3136] to-transparent z-10 pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedVideos;