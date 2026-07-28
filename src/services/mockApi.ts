// ============================================================================
// Mock API Service Layer
// AWS サービス（Cognito / DynamoDB / S3）を模擬したモックサービス層
// 将来の AWS クラウド移行時にインターフェースを維持したまま実装を差し替え可能
// ============================================================================

import type { AuthUser, Member, Product, ProductCategory, MemberRank } from '../types';
import {
  seedProducts,
  seedMembers,
  adminCredentials,
  demoCustomerCredentials,
} from '../data/seed';

// ---------------------------------------------------------------------------
// AuthService — Amazon Cognito を模擬
// JWTセッション・ロールベースアクセス制御を再現
// ---------------------------------------------------------------------------
const AuthService = {
  /**
   * Cognito の InitiateAuth フローを模擬したログイン処理
   * 成功時にモック JWT を発行し、ロール（customer/admin）を付与
   */
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(450);

    // 管理者認証
    if (email === adminCredentials.email && password === adminCredentials.password) {
      return {
        id: 'admin-0',
        name: adminCredentials.name,
        email: adminCredentials.email,
        role: 'admin',
        rank: 'platinum',
      };
    }

    // 一般会員認証（seed の会員データから照合）
    const member = _state.members.find((m) => m.email === email);
    if (!member) {
      throw new Error('アカウントが見つかりません。メールアドレスをご確認ください。');
    }

    // デモ用パスワード or seedパスワードの簡易チェック
    const isDemo = email === demoCustomerCredentials.email && password === demoCustomerCredentials.password;
    const isMemberPwd = password === 'demo123' || password === 'password123';
    if (!isDemo && !isMemberPwd) {
      throw new Error('パスワードが正しくありません。');
    }

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: 'customer',
      rank: member.rank,
    };
  },

  /**
   * Cognito の SignUp フローを模擬
   * 新規会員を DynamoDB Members テーブルへ登録
   */
  async register(input: {
    name: string;
    email: string;
    password: string;
    newsletter: boolean;
  }): Promise<AuthUser> {
    await delay(550);

    const exists = _state.members.some((m) => m.email === input.email);
    if (exists) {
      throw new Error('このメールアドレスは既に登録されています。');
    }

    const newMember: Member = {
      id: `m${_state.members.length + 1}-${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: '',
      rank: 'silver',
      status: 'active',
      newsletter: input.newsletter,
      favoritedProductIds: [],
      createdAt: new Date().toISOString(),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: '新規会員登録',
          detail: 'アカウントを作成しました',
        },
      ],
    };
    _state.members.push(newMember);

    return {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: 'customer',
      rank: newMember.rank,
    };
  },

  /**
   * Cognito の GetSession に相当 — モック JWT を生成
   */
  issueToken(user: AuthUser): string {
    const payload = { sub: user.id, email: user.email, role: user.role, iat: Date.now() };
    return `mock.jwt.${btoa(JSON.stringify(payload))}`;
  },
};

// ---------------------------------------------------------------------------
// DatabaseService — Amazon DynamoDB を模擬
// Members テーブル & Products テーブルの CRUD 操作
// ---------------------------------------------------------------------------
const DatabaseService = {
  // Products テーブル ------------------------------------------------------
  async listProducts(): Promise<Product[]> {
    await delay(200);
    return [..._state.products];
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay(150);
    return _state.products.find((p) => p.id === id);
  },

  async createProduct(input: Omit<Product, 'id' | 'createdAt' | 'favoriteCount'>): Promise<Product> {
    await delay(350);
    const product: Product = {
      ...input,
      id: `p${_state.products.length + 1}-${Date.now()}`,
      favoriteCount: 0,
      createdAt: new Date().toISOString(),
    };
    _state.products.unshift(product);
    return product;
  },

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
    await delay(200);
    const idx = _state.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    _state.products[idx] = { ..._state.products[idx], ...patch };
    return _state.products[idx];
  },

  // Members テーブル --------------------------------------------------------
  async listMembers(): Promise<Member[]> {
    await delay(200);
    return [..._state.members];
  },

  async getMember(id: string): Promise<Member | undefined> {
    await delay(150);
    return _state.members.find((m) => m.id === id);
  },

  async updateMember(id: string, patch: Partial<Member>): Promise<Member | undefined> {
    await delay(250);
    const idx = _state.members.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    _state.members[idx] = { ..._state.members[idx], ...patch };
    return _state.members[idx];
  },

  /**
   * お気に入りトグル — 会員の favoritedProductIds と商品の favoriteCount を
   * 同時に更新（DynamoDB トランザクション書き込みを模擬）
   */
  async toggleFavorite(memberId: string, productId: string): Promise<{ favorited: boolean; count: number }> {
    await delay(120);
    const member = _state.members.find((m) => m.id === memberId);
    const product = _state.products.find((p) => p.id === productId);
    if (!member || !product) throw new Error('データが見つかりません');

    const isFav = member.favoritedProductIds.includes(productId);
    if (isFav) {
      member.favoritedProductIds = member.favoritedProductIds.filter((id) => id !== productId);
      product.favoriteCount = Math.max(0, product.favoriteCount - 1);
    } else {
      member.favoritedProductIds = [...member.favoritedProductIds, productId];
      product.favoriteCount += 1;
      member.activityLog = [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'お気に入り追加',
          detail: product.name,
        },
        ...member.activityLog,
      ].slice(0, 20);
    }
    return { favorited: !isFav, count: product.favoriteCount };
  },

  async setMemberRank(memberId: string, rank: MemberRank): Promise<void> {
    await delay(200);
    const member = _state.members.find((m) => m.id === memberId);
    if (member) {
      member.rank = rank;
      member.activityLog = [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: '会員ランク変更',
          detail: `ランクを${rank}に変更しました`,
        },
        ...member.activityLog,
      ].slice(0, 20);
    }
  },

  async setMemberStatus(memberId: string, status: 'active' | 'suspended'): Promise<void> {
    await delay(200);
    const member = _state.members.find((m) => m.id === memberId);
    if (member) {
      member.status = status;
      member.activityLog = [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: status === 'suspended' ? 'アカウント一時停止' : 'アカウント再有効化',
          detail: `ステータスを${status === 'suspended' ? '一時停止' : '有効'}に変更しました`,
        },
        ...member.activityLog,
      ].slice(0, 20);
    }
  },
};

// ---------------------------------------------------------------------------
// StorageService — Amazon S3 を模擬
// 画像アップロードのプレビュー処理を担当
// ---------------------------------------------------------------------------
const StorageService = {
  /**
   * S3 PutObject を模擬 — ファイルを受け取り、ローカルObjectURLを生成
   * 実際のアップロードは行わず、プレビュー用URLを返す
   */
  async uploadImage(file: File): Promise<string> {
    await delay(400);
    // 実環境では S3 Presigned URL → PUT → CDN URL のフロー
    return URL.createObjectURL(file);
  },
};

// ---------------------------------------------------------------------------
// 内部状態 — インメモリストア（DynamoDB テーブルを模擬）
// ---------------------------------------------------------------------------
interface MockState {
  products: Product[];
  members: Member[];
}

const _state: MockState = {
  products: JSON.parse(JSON.stringify(seedProducts)),
  members: JSON.parse(JSON.stringify(seedMembers)),
};

/** データリセット — seed データで状態を復元 */
function resetData(): void {
  _state.products = JSON.parse(JSON.stringify(seedProducts));
  _state.members = JSON.parse(JSON.stringify(seedMembers));
}

// ユーティリティ --------------------------------------------------------------
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { AuthService, DatabaseService, StorageService, resetData };
export type { ProductCategory };
