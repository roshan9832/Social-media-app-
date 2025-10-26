
import React, { useState } from 'react';
import { Screen, User, Post, Story, UserStories, StoryItem, Comment } from './types';
import FeedScreen from './screens/FeedScreen';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReelsScreen from './screens/ReelsScreen';
import UploadScreen from './screens/UploadScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import GoLiveScreen from './screens/GoLiveScreen';
import LiveStreamScreen from './screens/LiveStreamScreen';
import StoryViewerScreen from './screens/StoryViewerScreen';
import { HomeIcon, ReelsIcon, AddIcon, DiscoverIcon, PlayCircleIcon } from './components/Icons';
import { CURRENT_USER_ID, USERS, POSTS as initialPosts, STORIES as initialStories, USER_STORIES as initialUserStories } from './constants';

const BottomNavBar: React.FC<{ activeScreen: Screen, navigate: (screen: Screen) => void, onProfileClick: () => void, onAddClick: () => void }> = ({ activeScreen, navigate, onProfileClick, onAddClick }) => {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-dumm-gray-100 border-t border-dumm-gray-300 max-w-sm mx-auto">
        <div className="flex justify-around items-center h-16">
            <button onClick={() => navigate(Screen.Feed)} className="flex flex-col items-center">
                <HomeIcon className={`w-7 h-7 ${activeScreen === Screen.Feed ? 'text-dumm-pink' : 'text-dumm-text-dark'}`} />
            </button>
            <button onClick={() => navigate(Screen.Discover)} className="flex flex-col items-center">
                <DiscoverIcon className={`w-7 h-7 ${activeScreen === Screen.Discover ? 'text-dumm-pink' : 'text-dumm-text-dark'}`} />
            </button>
            <button onClick={onAddClick} className="p-2 bg-dumm-pink rounded-full -translate-y-4 shadow-lg shadow-dumm-pink/30">
                <AddIcon className="w-8 h-8 text-white" />
            </button>
            <button onClick={() => navigate(Screen.Reels)} className="flex flex-col items-center">
                <ReelsIcon className={`w-7 h-7 ${activeScreen === Screen.Reels ? 'text-dumm-pink' : 'text-dumm-text-dark'}`} />
            </button>
            <button onClick={onProfileClick} className="flex flex-col items-center">
                <img src="https://picsum.photos/id/237/200" alt="Profile" className={`w-7 h-7 rounded-full border-2 ${activeScreen === Screen.Profile ? 'border-dumm-pink' : 'border-transparent'}`} />
            </button>
        </div>
      </nav>
    );
};
  

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for dev
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Feed);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>(['p2']);
  const [activeLiveStreamPostId, setActiveLiveStreamPostId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [userStories, setUserStories] = useState<UserStories[]>(initialUserStories);
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);


  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    if (screen !== Screen.Profile && screen !== Screen.EditProfile && screen !== Screen.Settings) setActiveProfileId(null);
    if (screen !== Screen.Chat) setActiveConversationId(null);
    if (screen !== Screen.LiveStream) setActiveLiveStreamPostId(null);
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarkedPostIds(prev =>
        prev.includes(postId)
            ? prev.filter(id => id !== postId)
            : [...prev, postId]
    );
  };

  const handleLogin = () => setIsAuthenticated(true);
  const handleSignUp = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const handleProfileClick = (userId: string) => {
    setActiveProfileId(userId);
    setCurrentScreen(Screen.Profile);
  };

  const handleMyProfileClick = () => {
    handleProfileClick(CURRENT_USER_ID);
  }

  const handleChatClick = (conversationId: string, userId: string) => {
    setActiveProfileId(userId); 
    setActiveConversationId(conversationId);
    setCurrentScreen(Screen.Chat);
  };
  
  const handleEditProfileClick = () => {
    setCurrentScreen(Screen.EditProfile);
  };
  
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSettingsClick = () => {
    setCurrentScreen(Screen.Settings);
  };
  
  const handleSharePost = (caption: string, imageUrl: string, videoUrl?: string) => {
    const newPost: Post = {
        id: `p${Date.now()}`,
        userId: CURRENT_USER_ID,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        caption: caption,
        likes: 0,
        comments: [],
        timestamp: 'Just now',
    };
    setPosts([newPost, ...posts]);
    navigate(Screen.Feed);
  };

  const handleSaveProfile = (updatedUser: User) => {
    const userIndex = USERS.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      USERS[userIndex] = updatedUser;
    }
    setCurrentScreen(Screen.Profile);
  };

  const handleLiveStreamClick = (postId: string) => {
    setActiveLiveStreamPostId(postId);
    setCurrentScreen(Screen.LiveStream);
  };

  const handleGoLive = (caption: string) => {
    const newLivePost: Post = {
      id: `p${Date.now()}`,
      userId: CURRENT_USER_ID,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/600/800`, // random thumbnail
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // placeholder stream
      caption: caption,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLive: true,
      viewerCount: 1, // The streamer themselves
      liveComments: [],
    };
    setPosts([newLivePost, ...posts]);
    setActiveLiveStreamPostId(newLivePost.id);
    setCurrentScreen(Screen.LiveStream);
    setIsAddModalOpen(false);
  };

  const handleStoryClick = (userId: string) => {
    setActiveStoryUserId(userId);
  };

  const handleCloseStoryViewer = () => {
      setActiveStoryUserId(null);
  };

  const handleStoryAdd = () => {
    // In a real app, this would open a camera/gallery UI.
    // Here, we simulate adding a new story.
    const newStoryItem: StoryItem = {
      id: `s_new_${Date.now()}`,
      type: 'image',
      url: `https://picsum.photos/seed/${Date.now()}/1080/1920`,
      duration: 5,
    };

    // Update user stories state
    setUserStories(prev => {
      const userStoriesIndex = prev.findIndex(us => us.userId === CURRENT_USER_ID);
      const newStoriesState = [...prev];
      if (userStoriesIndex > -1) {
        const updatedUserStories = { ...newStoriesState[userStoriesIndex] };
        updatedUserStories.stories = [...updatedUserStories.stories, newStoryItem];
        newStoriesState[userStoriesIndex] = updatedUserStories;
      } else {
        newStoriesState.unshift({
          userId: CURRENT_USER_ID,
          stories: [newStoryItem],
        });
      }
      return newStoriesState;
    });

    // Update story tray state
    setStories(prev => {
      if (!prev.some(s => s.userId === CURRENT_USER_ID)) {
        const currentUser = USERS.find(u => u.id === CURRENT_USER_ID);
        if (currentUser) {
          return [{ id: `s_${CURRENT_USER_ID}`, userId: CURRENT_USER_ID, imageUrl: currentUser.avatarUrl }, ...prev];
        }
      }
      return prev;
    });
    
    const user = USERS.find(u => u.id === CURRENT_USER_ID);
    if (user) user.hasStory = true;

    // Open the story viewer to the new story
    setActiveStoryUserId(CURRENT_USER_ID);
  };

  const handleStoryComment = (userId: string, storyId: string, commentText: string) => {
    setUserStories(prevUserStories => {
      return prevUserStories.map(userStory => {
        if (userStory.userId === userId) {
          const newStories = userStory.stories.map(story => {
            if (story.id === storyId) {
              const newComment: Comment = {
                id: `c-story-${Date.now()}`,
                userId: CURRENT_USER_ID,
                text: commentText,
              };
              return {
                ...story,
                comments: [...(story.comments || []), newComment],
              };
            }
            return story;
          });
          return { ...userStory, stories: newStories };
        }
        return userStory;
      });
    });
  };

  const handleBack = () => {
    if (currentScreen === Screen.Profile || currentScreen === Screen.Messages || currentScreen === Screen.Notifications || currentScreen === Screen.Reels || currentScreen === Screen.Upload || currentScreen === Screen.Discover) {
        setCurrentScreen(Screen.Feed);
        setActiveProfileId(null);
    } else if (currentScreen === Screen.Chat) {
        setCurrentScreen(Screen.Messages);
        setActiveConversationId(null);
        setActiveProfileId(null);
    } else if (currentScreen === Screen.EditProfile || currentScreen === Screen.Settings) {
        setCurrentScreen(Screen.Profile);
    } else if (currentScreen === Screen.LiveStream || currentScreen === Screen.GoLive) {
        setCurrentScreen(Screen.Feed);
        setActiveLiveStreamPostId(null);
    } else {
        setCurrentScreen(Screen.Feed);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-dumm-dark min-h-screen font-sans max-w-sm mx-auto">
        {isLoginView 
          ? <LoginScreen onLogin={handleLogin} onSwitchToSignUp={() => setIsLoginView(false)} /> 
          : <SignUpScreen onSignUp={handleSignUp} onSwitchToLogin={() => setIsLoginView(true)} />}
      </div>
    );
  }

  if (activeStoryUserId) {
    return (
        <div className="bg-dumm-dark min-h-screen font-sans max-w-sm mx-auto shadow-2xl shadow-dumm-pink/20">
            <StoryViewerScreen
                initialUserId={activeStoryUserId}
                onClose={handleCloseStoryViewer}
                userStories={userStories}
                onComment={handleStoryComment}
            />
        </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Feed:
        return <FeedScreen posts={posts} stories={stories} onStoryAdd={handleStoryAdd} onProfileClick={handleProfileClick} bookmarkedPostIds={bookmarkedPostIds} onToggleBookmark={handleToggleBookmark} navigate={navigate} onLiveStreamClick={handleLiveStreamClick} onStoryClick={handleStoryClick} />;
      case Screen.Profile:
        return <ProfileScreen userId={activeProfileId || CURRENT_USER_ID} posts={posts} onBack={handleBack} onEditProfileClick={handleEditProfileClick} onSettingsClick={handleSettingsClick} bookmarkedPostIds={bookmarkedPostIds} />;
      case Screen.Messages:
        return <MessagesScreen onBack={handleBack} onChatClick={handleChatClick} />;
      case Screen.Chat:
        return <ChatScreen conversationId={activeConversationId!} userId={activeProfileId!} onBack={handleBack} />;
      case Screen.Notifications:
        return <NotificationsScreen posts={posts} onBack={handleBack} onProfileClick={handleProfileClick} />;
      case Screen.EditProfile:
        return <EditProfileScreen userId={activeProfileId || CURRENT_USER_ID} onBack={handleBack} onSave={handleSaveProfile} />;
      case Screen.Settings:
        return <SettingsScreen onBack={handleBack} onLogout={handleLogout} onEditProfileClick={handleEditProfileClick} />;
      case Screen.Reels:
        return <ReelsScreen onProfileClick={handleProfileClick} onBack={handleBack} />;
      case Screen.Upload:
        return <UploadScreen onBack={handleBack} onShare={handleSharePost} />;
      case Screen.Discover:
        return <DiscoverScreen posts={posts} />;
      case Screen.GoLive:
        return <GoLiveScreen onBack={handleBack} onGoLive={handleGoLive} />;
      case Screen.LiveStream: {
        const post = posts.find(p => p.id === activeLiveStreamPostId);
        if (!post) {
            handleBack();
            return null;
        }
        return <LiveStreamScreen post={post} onBack={handleBack} isHost={post.userId === CURRENT_USER_ID} />;
      }
      default:
        return <FeedScreen posts={posts} stories={stories} onStoryAdd={handleStoryAdd} onProfileClick={handleProfileClick} bookmarkedPostIds={bookmarkedPostIds} onToggleBookmark={handleToggleBookmark} navigate={navigate} onLiveStreamClick={handleLiveStreamClick} onStoryClick={handleStoryClick} />;
    }
  };
  
  const showNavBar = ![Screen.Reels, Screen.Upload, Screen.Chat, Screen.Login, Screen.SignUp, Screen.Messages, Screen.Notifications, Screen.EditProfile, Screen.Settings, Screen.GoLive, Screen.LiveStream].includes(currentScreen);

  return (
    <div className="bg-dumm-dark min-h-screen font-sans max-w-sm mx-auto shadow-2xl shadow-dumm-pink/20">
      <div className={showNavBar ? "pb-16" : ""}> 
        {renderScreen()}
      </div>
      {showNavBar && <BottomNavBar activeScreen={currentScreen} navigate={navigate} onProfileClick={handleMyProfileClick} onAddClick={handleAddClick} />}
       {isAddModalOpen && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 z-50" onClick={() => setIsAddModalOpen(false)}>
            <div className="bg-dumm-gray-200 rounded-lg p-6 text-center shadow-lg w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg text-dumm-text-light mb-6">Create</h3>
                <div className="space-y-4">
                      <button
                        onClick={() => {
                            setIsAddModalOpen(false);
                            navigate(Screen.Upload);
                        }}
                        className="w-full bg-dumm-gray-300 text-dumm-text-light font-bold py-3 px-4 rounded-lg hover:bg-dumm-gray-100 transition-colors text-left flex items-center"
                    >
                        <AddIcon className="w-6 h-6 mr-3"/> Post
                    </button>
                      <button
                        onClick={() => {
                            setIsAddModalOpen(false);
                            navigate(Screen.GoLive);
                        }}
                        className="w-full bg-dumm-gray-300 text-dumm-text-light font-bold py-3 px-4 rounded-lg hover:bg-dumm-gray-100 transition-colors text-left flex items-center"
                    >
                        <PlayCircleIcon className="w-6 h-6 mr-3"/> Live
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;