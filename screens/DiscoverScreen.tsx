import React, { useState, useMemo } from 'react';
import { Post } from '../types';
import { USERS } from '../constants';
import { VideoIcon } from '../components/Icons';

interface DiscoverScreenProps {
  posts: Post[];
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return posts.filter(post => {
      const user = USERS.find(u => u.id === post.userId);
      const captionMatch = post.caption.toLowerCase().includes(lowercasedQuery);
      const userMatch = user?.username.toLowerCase().includes(lowercasedQuery);
      return captionMatch || userMatch;
    });
  }, [posts, searchQuery]);

  const column1Posts = filteredPosts.filter((_, index) => index % 2 === 0);
  const column2Posts = filteredPosts.filter((_, index) => index % 2 !== 0);

  const PostItem: React.FC<{ post: Post }> = ({ post }) => (
    <div className="relative mb-2 rounded-lg overflow-hidden group cursor-pointer">
      <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover" />
      {post.videoUrl && (
        <div className="absolute top-2 right-2">
          <VideoIcon className="w-5 h-5 text-white drop-shadow-lg" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
         <p className="text-white text-sm text-center line-clamp-3">{post.caption}</p>
      </div>
    </div>
  );

  return (
    <div className="text-dumm-text-light p-4">
      <header className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search captions or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dumm-gray-200 text-dumm-text-light placeholder-dumm-text-dark px-10 py-2 rounded-lg focus:outline-none focus:border-dumm-pink focus:ring-1 focus:ring-dumm-pink"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-dumm-text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      {filteredPosts.length > 0 ? (
        <main className="flex space-x-2">
          <div className="flex-1 flex flex-col">
            {column1Posts.map(post => <PostItem key={post.id} post={post} />)}
          </div>
          <div className="flex-1 flex flex-col">
            {column2Posts.map(post => <PostItem key={post.id} post={post} />)}
          </div>
        </main>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold text-dumm-text-light">No results found</h3>
          <p className="text-dumm-text-dark mt-1">Try searching for something else.</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverScreen;
