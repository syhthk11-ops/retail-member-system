// ============================================================================
// DemoBar — プレゼン用デモコントロールバー
// 固定表示のダークインディゴヘッダーでロール切替・画面ジャンプ・クイックログイン
// ============================================================================

import { useState } from 'react';
import {
  User,
  Shield,
  ChevronDown,
  LogIn,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAppStore } from '../store/AppStore';
import { useRouter } from '../store/Router';

interface ScreenOption {
  path: string;
  label: string;
  group: 'customer' | 'admin';
}

const SCREENS: ScreenOption[] = [
  { path: '/login', label: '1. ログイン・新規登録', group: 'customer' },
  { path: '/products', label: '2. 新着商品一覧', group: 'customer' },
  { path: '/product/p1', label: '3. 商品詳細', group: 'customer' },
  { path: '/mypage', label: '4. マイページ / お気に入り', group: 'customer' },
  { path: '/mypage/edit', label: '5. 会員情報編集', group: 'customer' },
  { path: '/admin/login', label: '6. 管理者ログイン', group: 'admin' },
  { path: '/admin/dashboard', label: '7. エグゼクティブ・ダッシュボード', group: 'admin' },
  { path: '/admin/members', label: '8. 会員管理一覧', group: 'admin' },
  { path: '/admin/member/m1', label: '9. 会員詳細プロファイル', group: 'admin' },
  { path: '/admin/products/new', label: '10. 新作商品投稿・編集', group: 'admin' },
];

export function DemoBar() {
  const { viewMode, setViewMode, currentUser, quickLoginCustomer, quickLoginAdmin, logout, resetAllData, showToast } =
    useAppStore();
  const { path, navigate } = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleScreenJump = (target: string) => {
    navigate(target);
    setDropdownOpen(false);
  };

  const handleQuickLogin = async (type: 'customer' | 'admin') => {
    try {
      if (type === 'customer') {
        await quickLoginCustomer();
        navigate('/products');
      } else {
        await quickLoginAdmin();
        navigate('/admin/dashboard');
      }
      showToast(type === 'customer' ? '一般会員（Taro）でログインしました' : 'システム管理者でログインしました', 'success');
    } catch {
      showToast('ログインに失敗しました', 'error');
    }
  };

  const currentScreen = SCREENS.find((s) => s.path === path);

  return (
    <div className="sticky top-0 z-[100] border-b border-brand-950/50 bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        {/* ブランド */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-white">Retail Member Cloud</p>
            <p className="text-[10px] leading-tight text-brand-300">Presales Demo Console</p>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-brand-700/60 sm:block" />

        {/* ロール切替 */}
        <div className="flex items-center rounded-lg bg-brand-950/60 p-0.5 ring-1 ring-brand-700/50">
          <button
            onClick={() => setViewMode('customer')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'customer'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-brand-300 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            会員視点
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'admin'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-brand-300 hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            管理者視点
          </button>
        </div>

        {/* 画面ジャンプ */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-brand-950/60 px-3 py-2 text-xs font-medium text-brand-200 ring-1 ring-brand-700/50 transition-all hover:bg-brand-900 hover:text-white"
          >
            <span className="hidden sm:inline">画面ジャンプ</span>
            <span className="sm:hidden">画面</span>
            <span className="hidden max-w-[140px] truncate font-semibold text-white md:inline">
              {currentScreen?.label ?? '選択'}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 top-full z-20 mt-1 w-72 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  会員用画面
                </div>
                {SCREENS.filter((s) => s.group === 'customer').map((s) => (
                  <button
                    key={s.path}
                    onClick={() => handleScreenJump(s.path)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-brand-50 ${
                      path === s.path ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-700'
                    }`}
                  >
                    {s.label}
                    {path === s.path && <Check className="h-4 w-4 text-brand-600" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  管理者用画面
                </div>
                {SCREENS.filter((s) => s.group === 'admin').map((s) => (
                  <button
                    key={s.path}
                    onClick={() => handleScreenJump(s.path)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-brand-50 ${
                      path === s.path ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-700'
                    }`}
                  >
                    {s.label}
                    {path === s.path && <Check className="h-4 w-4 text-brand-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* クイックログイン */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickLogin('customer')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 active:scale-95"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">一般会員</span>
            <span className="sm:hidden">会員</span>
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/90 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-500 active:scale-95"
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">管理者</span>
            <span className="sm:hidden">管理</span>
          </button>
        </div>

        {/* 右側 */}
        <div className="ml-auto flex items-center gap-2">
          {currentUser && (
            <div className="hidden items-center gap-2 rounded-lg bg-brand-950/60 px-3 py-1.5 text-xs text-brand-200 ring-1 ring-brand-700/50 lg:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
              <span className="font-medium">{currentUser.name}</span>
            </div>
          )}
          {currentUser && (
            <button
              onClick={() => {
                logout();
                navigate(viewMode === 'admin' ? '/admin/login' : '/login');
                showToast('ログアウトしました', 'info');
              }}
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-brand-300 transition-all hover:bg-brand-800 hover:text-white"
            >
              ログアウト
            </button>
          )}
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30 transition-all hover:bg-rose-500/30 hover:text-rose-200 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">データリセット</span>
            <span className="sm:hidden">リセット</span>
          </button>
        </div>
      </div>
    </div>
  );
}
