// ============================================================================
// 軽量ルーター — React Router を使わずシンプルなパスベースのルーティングを提供
// デモバーの画面ジャンプ機能と連携
// ============================================================================

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouteState | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/login';
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setPath(hash || '/login');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((newPath: string) => {
    window.location.hash = newPath;
    setPath(newPath);
    // 画面遷移時にトップへスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // パスからパラメータを抽出（例: /product/p1 → { id: 'p1' }）
  const params = extractParams(path);

  return (
    <RouterContext.Provider value={{ path, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouteState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

function extractParams(path: string): Record<string, string> {
  const productMatch = path.match(/^\/product\/(.+)$/);
  if (productMatch) return { id: productMatch[1] };
  const memberMatch = path.match(/^\/admin\/member\/(.+)$/);
  if (memberMatch) return { id: memberMatch[1] };
  return {};
}
