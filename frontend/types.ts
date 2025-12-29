
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  totalViews?: number;
  totalLikes?: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: number;
}

export interface Snippet {
  id: string;
  slug: string;
  title: string;
  description: string;
  code: string;
  language: string;
  filename: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: number;
  updatedAt: number;
  likes: number;
  views: number;
  commentCount: number;
  tags: string[];
}

export type RouteParams = {
  slug?: string;
  username?: string;
};

export type PageView = 
  | 'home' 
  | 'detail' 
  | 'profile' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'create' 
  | 'edit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
