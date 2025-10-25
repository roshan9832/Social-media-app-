import React from 'react';
import { Post } from '../types';
import { VideoIcon } from '../components/Icons';

interface DiscoverScreenProps {
  posts: Post[];
}

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ posts }) => {
  // Simple masonry-like layout with 2 columns
  const column1Posts = posts.filter((_, index) => index % 2 === 0);
  const column2Posts = posts.filter((_, index) => index % 2 !== 0);

  const PostItem: React.FC<{ post: Post }> = ({ post }) => (
    <div className="relative mb-2 rounded-lg overflow-hidden">
      <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover" />
      {post.videoUrl && (
        <div className="absolute top-2 right-2">
          <VideoIcon className="w-5 h-5 text-white drop-shadow-lg" />
        </div>
      )}
    </div>
  );

  return (
    <div className="text-dumm-text-light p-4">
      <header className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-dumm-gray-200 text-dumm-text-light placeholder-dumm-text-dark px-10 py-2 rounded-lg focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-dumm-text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="flex space-x-2">
        <div className="flex-1 flex flex-col">
          {column1Posts.map(post => <PostItem key={post.id} post={post} />)}
        </div>
        <div className="flex-1 flex flex-col">
          {column2Posts.map(post => <PostItem key={post.id} post={post} />)}
        </div>
      </main>
    </div>
  );
};

export default DiscoverScreen;
