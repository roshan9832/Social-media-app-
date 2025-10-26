import React, { useState, useRef, useEffect } from 'react';
import { BackIcon, TagIcon, MapPinIcon, RecordIcon, StopIcon } from '../components/Icons';

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

  // State for recording
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  // State and ref for recording timer
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
        alert("Could not access camera. Please check permissions.");
        setIsRecordingMode(false);
      }
    };

    if (isRecordingMode) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (isRecording) {
          mediaRecorderRef.current?.stop();
          setIsRecording(false);
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    };
  }, [isRecordingMode]);

  useEffect(() => {
    if (isRecording) {
        setRecordingTime(0);
        timerIntervalRef.current = window.setInterval(() => {
            setRecordingTime(prevTime => prevTime + 1);
        }, 1000);
    } else {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }

    return () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };
  }, [isRecording]);


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

  const handleStartRecording = () => {
    if (videoPreviewRef.current && videoPreviewRef.current.srcObject) {
      const stream = videoPreviewRef.current.srcObject as MediaStream;
      recordedChunksRef.current = [];
      const options = { mimeType: 'video/webm; codecs=vp9' };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setMediaPreview(videoUrl);
        setMediaType('video');
        setIsRecordingMode(false);

        const video = document.createElement('video');
        video.src = videoUrl;
        video.onloadeddata = () => { video.currentTime = 0.1; };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.8));
          }
        };
      };

      try {
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start recording:", err);
        alert("Sorry, could not start the recording. Please check browser permissions and try again.");
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
    if (isRecordingMode) {
      setIsRecordingMode(false);
    } else if (mediaPreview || caption.trim() !== '') {
      setShowDiscardDialog(true);
    } else {
      onBack();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    onBack();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  if (isRecordingMode) {
    return (
      <div className="relative h-screen w-full bg-black flex flex-col">
        <video ref={videoPreviewRef} className="w-full h-full object-cover" autoPlay playsInline muted />
        <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={() => setIsRecordingMode(false)} className="bg-black/30 p-2 rounded-full">
            <BackIcon className="w-6 h-6 text-white" />
          </button>
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1.5 rounded-full font-semibold shadow-lg border-2 border-red-400">
                <span className="animate-pulse font-bold text-sm">REC</span>
                <span className="font-mono text-sm tracking-wider">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center z-10">
          <button onClick={isRecording ? handleStopRecording : handleStartRecording} className="w-20 h-20 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm transition-transform active:scale-90">
            {isRecording 
              ? <StopIcon className="w-8 h-8 text-white" /> 
              : <RecordIcon className="w-12 h-12 text-red-500" />
            }
          </button>
        </div>
      </div>
    );
  }

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

      {!mediaPreview ? (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-dumm-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-dumm-text-light">Create a new post</h2>
            <p className="text-dumm-text-dark mt-2 mb-8">Choose a file from your gallery or record a new video clip.</p>
            <div className="w-full max-w-xs space-y-4">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-dumm-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                    Select from Gallery
                </button>
                 <button
                    onClick={() => setIsRecordingMode(true)}
                    className="w-full bg-dumm-pink text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                    Record Video
                </button>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
            />
        </main>
      ) : (
        <main className="p-4 flex-1 flex flex-col">
          <div className="flex space-x-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-dumm-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0"
            >
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Selected preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-dumm-pink rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="flex-1 h-24 bg-transparent text-dumm-text-light placeholder-dumm-text-dark focus:outline-none resize-none"
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
      )}

      {showDiscardDialog && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 z-50">
          <div className="bg-dumm-gray-200 rounded-lg p-6 text-center shadow-lg w-full max-w-sm">
            <h3 className="font-bold text-lg text-dumm-text-light">Discard post?</h3>
            <p className="text-sm text-dumm-text-dark mt-2 mb-6">If you go back now, you will lose your post.</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleConfirmDiscard}
                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => setShowDiscardDialog(false)}
                className="w-full bg-transparent text-dumm-text-light font-semibold py-2 px-4 rounded-lg"
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