
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  posts: number;
  followers: number;
  following: number;
  bio?: string;
  hasStory: boolean;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLive?: boolean;
}

export interface Comment {
  id:string;
  userId: string;
  text: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  fromUserId: string;
  postId?: string;
  timestamp: string;
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  audioTitle: string;
}

export enum Screen {
  Feed,
  Profile,
  Messages,
  Chat,
  Notifications,
  Discover,
  EditProfile,
  Login,
  SignUp,
  Settings,
  Reels,
  Upload,
}