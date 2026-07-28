// ============================================================================
// AppStore — 全アプリ状態を一元管理する React Context
// 認証セッション・商品・会員データを保持し、モックAPIと連携する
// ============================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, Member, Product } from '../types';
import { AuthService, DatabaseService, resetData } from '../services/mockApi';

export type ViewMode = 'customer' | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppStoreValue {
  // 認証
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: { name: string; email: string; password: string; newsletter: boolean }) => Promise<AuthUser>;
  logout: () => void;
  quickLoginCustomer: () => Promise<void>;
  quickLoginAdmin: () => Promise<void>;

  // データ
  products: Product[];
  members: Member[];
  refreshProducts: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorited: (productId: string) => boolean;
  createProduct: (input: Omit<Product, 'id' | 'createdAt' | 'favoriteCount'>) => Promise<Product>;
  updateMemberProfile: (patch: Partial<Member>) => Promise<void>;
  setMemberRank: (memberId: string, rank: Member['rank']) => Promise<void>;
  setMemberStatus: (memberId: string, status: Member['status']) => Promise<void>;

  // UI状態
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // データリセット
  resetAllData: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 初期ロード
  useEffect(() => {
    void loadAll();
  }, []);

  const loadAll = async () => {
    const [p, m] = await Promise.all([
      DatabaseService.listProducts(),
      DatabaseService.listMembers(),
    ]);
    setProducts(p);
    setMembers(m);
  };

  const refreshProducts = async () => {
    const p = await DatabaseService.listProducts();
    setProducts(p);
  };

  const refreshMembers = async () => {
    const m = await DatabaseService.listMembers();
    setMembers(m);
  };

  // --- 認証 ---------------------------------------------------------------
  const login = async (email: string, password: string) => {
    const user = await AuthService.login(email, password);
    setCurrentUser(user);
    setViewMode(user.role);
    return user;
  };

  const register = async (input: { name: string; email: string; password: string; newsletter: boolean }) => {
    const user = await AuthService.register(input);
    setCurrentUser(user);
    setViewMode('customer');
    await loadAll();
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLoginCustomer = async () => {
    const user = await login('taro@example.com', 'demo123');
    return;
  };

  const quickLoginAdmin = async () => {
    await login('admin@retail-demo.com', 'admin123');
  };

  // --- お気に入り ---------------------------------------------------------
  const toggleFavorite = async (productId: string) => {
    if (!currentUser || currentUser.role !== 'customer') return;
    await DatabaseService.toggleFavorite(currentUser.id, productId);
    // 双方のテーブルを即時反映（リアルタイム同期）
    await Promise.all([refreshProducts(), refreshMembers()]);
  };

  const isFavorited = useCallback(
    (productId: string) => {
      if (!currentUser || currentUser.role !== 'customer') return false;
      const member = members.find((m) => m.id === currentUser.id);
      return !!member?.favoritedProductIds.includes(productId);
    },
    [currentUser, members],
  );

  // --- 商品作成（管理者） -------------------------------------------------
  const createProduct = async (input: Omit<Product, 'id' | 'createdAt' | 'favoriteCount'>) => {
    const product = await DatabaseService.createProduct(input);
    await refreshProducts();
    return product;
  };

  // --- 会員プロフィール更新（会員本人） -----------------------------------
  const updateMemberProfile = async (patch: Partial<Member>) => {
    if (!currentUser) return;
    await DatabaseService.updateMember(currentUser.id, patch);
    await refreshMembers();
  };

  // --- 会員管理（管理者） -------------------------------------------------
  const setMemberRank = async (memberId: string, rank: Member['rank']) => {
    await DatabaseService.setMemberRank(memberId, rank);
    await refreshMembers();
  };

  const setMemberStatus = async (memberId: string, status: Member['status']) => {
    await DatabaseService.setMemberStatus(memberId, status);
    await refreshMembers();
  };

  // --- Toast --------------------------------------------------------------
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- リセット -----------------------------------------------------------
  const resetAllData = () => {
    resetData();
    setCurrentUser(null);
    setViewMode('customer');
    void loadAll();
    showToast('モックデータをリセットしました', 'info');
  };

  const value: AppStoreValue = useMemo(
    () => ({
      currentUser,
      login,
      register,
      logout,
      quickLoginCustomer,
      quickLoginAdmin,
      products,
      members,
      refreshProducts,
      refreshMembers,
      toggleFavorite,
      isFavorited,
      createProduct,
      updateMemberProfile,
      setMemberRank,
      setMemberStatus,
      viewMode,
      setViewMode,
      toasts,
      showToast,
      dismissToast,
      resetAllData,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, products, members, viewMode, toasts, isFavorited],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
