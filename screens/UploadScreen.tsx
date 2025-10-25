
import React, { useState, useRef } from 'react';
import { BackIcon, TagIcon, MapPinIcon } from '../components/Icons';

interface UploadScreenProps {
  onBack: () => void;
  onShare: (caption: string, imageUrl: string, videoUrl?: string) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onBack, onShare }) => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaUrl = e.target?.result as string;
        setMediaPreview(mediaUrl);
        if (file.type.startsWith('video')) {
          setMediaType('video');
          const video = document.createElement('video');
          video.src = mediaUrl;
          video.onloadeddata = () => {
            video.currentTime = 1; // Seek to 1s to get a better frame
          };
          video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumb = canvas.toDataURL('image/jpeg', 0.8);
              setThumbnailUrl(thumb);
            }
          };
        } else {
          setMediaType('image');
          setThumbnailUrl(mediaUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    if (mediaType === 'image' && mediaPreview) {
      onShare(caption, mediaPreview);
    } else if (mediaType === 'video' && mediaPreview && thumbnailUrl) {
      onShare(caption, thumbnailUrl, mediaPreview);
    }
  };

  const handleBackPress = () => {
    if (mediaPreview || caption.trim() !== '') {
      setShowDiscardDialog(true);
    } else {
      onBack();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    onBack();
  };

  return (
    <div className="text-dumm-text-light flex flex-col h-screen">
      <header className="p-4 flex justify-between items-center">
        <button onClick={handleBackPress}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg">New Post</h2>
        <button
          onClick={handleShare}
          disabled={!thumbnailUrl}
          className={`font-bold ${thumbnailUrl ? 'text-dumm-blue' : 'text-dumm-text-dark'}`}
        >
          Share
        </button>
      </header>

      <main className="p-4 flex-1 flex flex-col">
        <div className="flex space-x-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 bg-dumm-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt="Selected preview" className="w-full h-full object-cover" />
            ) : mediaPreview ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-dumm-pink rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dumm-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleMediaSelect}
              className="hidden"
            />
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="flex-1 bg-transparent text-dumm-text-light placeholder-dumm-text-dark focus:outline-none resize-none"
          />
        </div>
        
        <div className="mt-6 border-y border-dumm-gray-300">
            <button className="w-full flex items-center py-3 text-left">
                <TagIcon className="w-6 h-6 text-dumm-text-light" />
                <span className="ml-4">Tag People</span>
            </button>
        </div>
        <div className="border-b border-dumm-gray-300">
            <button className="w-full flex items-center py-3 text-left">
                <MapPinIcon className="w-6 h-6 text-dumm-text-light" />
                <span className="ml-4">Add Location</span>
            </button>
        </div>
      </main>

      {showDiscardDialog && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 z-50">
          <div className="bg-dumm-gray-200 rounded-lg p-6 text-center shadow-lg w-full max-w-sm">
            <h3 className="font-bold text-lg text-dumm-text-light">Discard changes?</h3>
            <p className="text-sm text-dumm-text-dark mt-2 mb-6">If you go back now, you will lose all your changes.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmDiscard}
                className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => setShowDiscardDialog(false)}
                className="flex-1 bg-dumm-gray-300 text-dumm-text-light font-bold py-2 px-4 rounded-lg hover:bg-dumm-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;