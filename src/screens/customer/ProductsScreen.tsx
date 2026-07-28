// 画面2: 新着商品一覧画面
// カテゴリフィルタ・検索バー・商品カードグリッド・お気に入りトグル

import { useMemo, useState } from 'react';
import { Search, Heart, Sparkles, Package } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { CATEGORY_LABELS } from '../../types';
import type { ProductCategory } from '../../types';
import { formatPrice } from '../../components/ui';

const CATEGORIES: Array<'all' | ProductCategory> = ['all', 'apparel', 'shoes', 'accessories', 'electronics'];

export function ProductsScreen() {
  const { products, toggleFavorite, isFavorited, currentUser } = useAppStore();
  const { navigate } = useRouter();
  const [category, setCategory] = useState<'all' | ProductCategory>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catMatch = category === 'all' || p.category === category;
      const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [products, category, search]);

  const handleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!currentUser || currentUser.role !== 'customer') {
      navigate('/login');
      return;
    }
    await toggleFavorite(productId);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      {/* ヒーロー */}
      <div className="bg-gradient-to-br from-navy via-brand-800 to-brand-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-brand-200">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">New Arrivals</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold">新着商品一覧</h1>
          <p className="mt-1 text-sm text-brand-200">最新のアイテムをチェックしてお気に入りに追加しよう</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* 検索・フィルタ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="商品名で検索..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'すべて' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* 商品グリッド */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package className="h-12 w-12 mb-3" />
            <p className="text-sm">該当する商品が見つかりません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => {
              const fav = isFavorited(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group card cursor-pointer overflow-hidden transition-all hover:shadow-card hover:-translate-y-0.5"
                >
                  {/* 画像 */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <span className="absolute left-2 top-2 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        NEW
                      </span>
                    )}
                    <button
                      onClick={(e) => handleFavorite(e, product.id)}
                      className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110 ${
                        fav ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${fav ? 'fill-rose-500 animate-heart-pop' : ''}`} />
                    </button>
                  </div>
                  {/* 詳細 */}
                  <div className="p-3">
                    <p className="text-[10px] font-medium text-brand-500">{CATEGORY_LABELS[product.category]}</p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-800 leading-snug">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">{formatPrice(product.price)}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Heart className={`h-3 w-3 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        {product.favoriteCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
