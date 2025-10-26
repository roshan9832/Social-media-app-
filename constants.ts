
import { User, Post, Story, Conversation, Message, Notification, Reel } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Jane Doe', username: 'janedoe', avatarUrl: 'https://picsum.photos/id/237/200', posts: 12, followers: 242, following: 187, bio: 'Wanderlust in the pool. Food lover. Thanks for the good day ever, thanks! #specialist #pool #summer #party', hasStory: true },
  { id: 'u2', name: 'Berkay Erdinc', username: 'berkay', avatarUrl: 'https://picsum.photos/id/1005/200', posts: 5, followers: 154, following: 98, hasStory: true },
  { id: 'u3', name: 'Irma Nikola', username: 'irmanikola', avatarUrl: 'https://picsum.photos/id/1027/200', posts: 25, followers: 1074, following: 242, hasStory: false },
  { id: 'u4', name: 'Thomas', username: 'thomas', avatarUrl: 'https://picsum.photos/id/1011/200', posts: 8, followers: 88, following: 112, hasStory: true },
  { id: 'u5', name: 'Specialist', username: 'specialist', avatarUrl: 'https://picsum.photos/id/1012/200', posts: 3, followers: 302, following: 55, hasStory: false },
  { id: 'u6', name: 'John Smith', username: 'johnsmith', avatarUrl: 'https://picsum.photos/id/64/200', posts: 15, followers: 512, following: 201, hasStory: true },
];

export const CURRENT_USER_ID = 'u1';

export const POSTS: Post[] = [
  { id: 'p1', userId: 'u1', imageUrl: 'https://picsum.photos/id/103/600/800', caption: 'Wonderful time in the pool, best day ever, thanks! @specialist #pool #summer #party', likes: 54, comments: [{id: 'c1', userId: 'u2', text: 'Looks amazing!', replies: [{id: 'r1', userId: 'u1', text: 'Thanks! You should have been there.'}]}, {id: 'c2', userId: 'u3', text: 'So jealous!'}], timestamp: '5 mins ago' },
  { id: 'p6', userId: 'u3', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', imageUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg', caption: 'Fun times!', likes: 250, comments: [], timestamp: '4 hours ago' },
  { id: 'p2', userId: 'u2', imageUrl: 'https://picsum.photos/id/1043/600/800', caption: 'Today was so beautiful', likes: 32, comments: [], timestamp: '1 hour ago', isLive: true, viewerCount: 1342, liveComments: [{id: 'lc1', userId: 'u3', text: 'Wow amazing!'}, {id: 'lc2', userId: 'u4', text: 'Where is this??'}, {id: 'lc3', userId: 'u1', text: 'Looks so peaceful.'}] },
  { id: 'p3', userId: 'u3', imageUrl: 'https://picsum.photos/id/1047/600/800', caption: 'Exploring new heights!', likes: 120, comments: [], timestamp: '3 hours ago' },
  { id: 'p4', userId: 'u4', imageUrl: 'https://picsum.photos/id/1062/600/800', caption: 'City lights.', likes: 45, comments: [], timestamp: '1 day ago' },
  { id: 'p5', userId: 'u1', imageUrl: 'https://picsum.photos/id/122/600/800', caption: 'Another great day.', likes: 68, comments: [], timestamp: '2 days ago' },
];

export const STORIES: Story[] = [
  { id: 's1', userId: 'u1', imageUrl: 'https://picsum.photos/id/237/200' },
  { id: 's2', userId: 'u2', imageUrl: 'https://picsum.photos/id/1005/200' },
  { id: 's3', userId: 'u4', imageUrl: 'https://picsum.photos/id/1011/200' },
  { id: 's4', userId: 'u6', imageUrl: 'https://picsum.photos/id/64/200' },
  { id: 's5', userId: 'u5', imageUrl: 'https://picsum.photos/id/1012/200' },
];

export const CONVERSATIONS: Conversation[] = [
  { id: 'conv1', userId: 'u5', lastMessage: "Let's do it again next week!", timestamp: '10:02', unreadCount: 2 },
  { id: 'conv2', userId: 'u2', lastMessage: 'Okay, see you then.', timestamp: '09:45', unreadCount: 0 },
  { id: 'conv3', userId: 'u3', lastMessage: 'Sounds good!', timestamp: 'Yesterday', unreadCount: 0 },
  { id: 'conv4', userId: 'u4', lastMessage: 'You sent a photo.', timestamp: '2d ago', unreadCount: 1 },
];

export const MESSAGES: { [key: string]: Message[] } = {
  'conv1': [
    { id: 'm1', text: 'Hey, that was a great trip!', isSender: false, timestamp: '09:58' },
    { id: 'm2', text: 'Totally! We should do it again.', isSender: true, timestamp: '10:00' },
    { id: 'm3', text: "Let's do it again next week!", isSender: false, timestamp: '10:02' },
  ],
   'conv2': [
    { id: 'm4', text: 'Hey Berkay!', isSender: true, timestamp: '09:44' },
    { id: 'm5', text: 'Okay, see you then.', isSender: false, timestamp: '09:45' },
    { id: 'm6', text: 'Can you send me the photos?', isSender: true, timestamp: '09:46' },
  ],
   'conv4': [
    { id: 'm7', text: 'Check this out!', isSender: true, timestamp: '2d ago', imageUrl: 'https://picsum.photos/id/103/400/300'},
   ]
};

export const NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'follow', fromUserId: 'u2', timestamp: '10m ago' },
    { id: 'n2', type: 'like', fromUserId: 'u3', postId: 'p1', timestamp: '15m ago' },
    { id: 'n3', type: 'comment', fromUserId: 'u5', postId: 'p1', timestamp: '30m ago' },
    { id: 'n4', type: 'follow', fromUserId: 'u4', timestamp: '1h ago' },
    { id: 'n5', type: 'like', fromUserId: 'u6', postId: 'p5', timestamp: '2h ago' },
];

export const REELS: Reel[] = [
  { id: 'r1', userId: 'u2', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption: 'Walking into the weekend like...', likes: 12345, comments: 245, shares: 123, audioTitle: 'Original Audio - berkay' },
  { id: 'r2', userId: 'u3', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: 'Morning run vibes 🏃‍♀️ #fitness', likes: 5432, comments: 180, shares: 98, audioTitle: 'Upbeat Pop - Popular Sounds' },
  { id: 'r3', userId: 'u4', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption: 'Chasing waterfalls', likes: 25890, comments: 512, shares: 432, audioTitle: 'Nature Sounds - Waterfall' },
];
