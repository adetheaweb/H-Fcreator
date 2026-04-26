export type UserRole = 'Admin' | 'Operator';

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  status: 'Draft' | 'Published';
  thumbnail?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface App {
  id: string;
  name: string;
  version: string;
  platform: 'Web' | 'Mobile' | 'Desktop';
  url?: string;
  description?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  type: 'Event' | 'Educational' | 'Misc';
  createdAt: any;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: any;
}

export interface Contact {
  id: string;
  platform: string;
  value: string;
  icon?: string;
  order?: number;
  createdAt: any;
}

export interface SiteConfig {
  adminPhotoUrl: string;
  adminName: string;
  adminStatus: string;
  youtubeVideoId: string;
  primaryColor?: string;
  accentColor?: string;
  updatedAt?: any;
}

export interface Download {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  type: string;
  createdAt: any;
}
