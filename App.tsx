import React, { useState } from 'react';
import { Screen, User, Post } from './types';
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
import { HomeIcon, ReelsIcon, AddIcon, DiscoverIcon } from './components/Icons';
import { CURRENT_USER_ID, USERS, POSTS as initialPosts } from './constants';

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

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    if (screen !== Screen.Profile && screen !== Screen.EditProfile && screen !== Screen.Settings) setActiveProfileId(null);
    if (screen !== Screen.Chat) setActiveConversationId(null);
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
    setActiveProfileId(CURRENT_USER_ID);
    setCurrentScreen(Screen.Profile);
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
    setCurrentScreen(Screen.Upload);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Feed:
        return <FeedScreen posts={posts} onProfileClick={handleProfileClick} bookmarkedPostIds={bookmarkedPostIds} onToggleBookmark={handleToggleBookmark} navigate={navigate} />;
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
      default:
        return <FeedScreen posts={posts} onProfileClick={handleProfileClick} bookmarkedPostIds={bookmarkedPostIds} onToggleBookmark={handleToggleBookmark} navigate={navigate} />;
    }
  };
  
  const showNavBar = ![Screen.Reels, Screen.Upload, Screen.Chat, Screen.Login, Screen.SignUp, Screen.Messages, Screen.Notifications, Screen.EditProfile, Screen.Settings].includes(currentScreen);

  return (
    <div className="bg-dumm-dark min-h-screen font-sans max-w-sm mx-auto shadow-2xl shadow-dumm-pink/20">
      <div className={showNavBar ? "pb-16" : ""}> 
        {renderScreen()}
      </div>
      {showNavBar && <BottomNavBar activeScreen={currentScreen} navigate={navigate} onProfileClick={handleMyProfileClick} onAddClick={handleAddClick} />}
    </div>
  );
};

export default App;
