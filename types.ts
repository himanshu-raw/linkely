export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: string[]; // Array of user IDs
  comments: Comment[];
}
