// 型定義 — AWS サービス（Cognito / DynamoDB / S3）を模擬したデータモデル

export type MemberRank = 'platinum' | 'gold' | 'silver';
export type MemberStatus = 'active' | 'suspended';
export type Role = 'customer' | 'admin';
export type ProductCategory = 'apparel' | 'shoes' | 'accessories' | 'electronics';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  images: string[];
  isNew: boolean;
  favoriteCount: number;
  stock: number;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  rank: MemberRank;
  status: MemberStatus;
  newsletter: boolean;
  favoritedProductIds: string[];
  createdAt: string;
  activityLog: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  rank: MemberRank;
}

export interface AdminLogEntry {
  id: string;
  timestamp: string;
  action: string;
  memberId?: string;
  detail: string;
}

export const RANK_LABELS: Record<MemberRank, string> = {
  platinum: 'プラチナ会員',
  gold: 'ゴールド会員',
  silver: 'シルバー会員',
};

export const RANK_CASHBACK: Record<MemberRank, string> = {
  platinum: '還元率10%',
  gold: '還元率5%',
  silver: '還元率2%',
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  apparel: 'アパレル',
  shoes: 'シューズ',
  accessories: '雑貨',
  electronics: '家電',
};
