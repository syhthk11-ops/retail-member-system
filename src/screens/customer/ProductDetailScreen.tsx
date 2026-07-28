// 画面3: 商品詳細画面
// 画像ギャラリー・詳細説明・在庫状況・お気に入りボタン・関連商品スライダー

import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Check, AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { CATEGORY_LABELS } from '../../types';
import { Spinner, formatPrice } from '../../components/ui';

export function ProductDetailScreen() {
  const { products, toggleFavorite, isFavorited, currentUser, showToast } = useAppStore();
  const { params, navigate } = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-400">商品が見つかりません</p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          商品一覧へ戻る
        </button>
      </div>
    );
  }

  const fav = isFavorited(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  const handleFavorite = async () => {
    if (!currentUser || currentUser.role !== 'customer') {
      showToast('ログインしてお気に入りに追加できます', 'info');
      navigate('/login');
      return;
    }
    setLoading(true);
    await toggleFavorite(product.id);
    setLoading(false);
    showToast(fav ? 'お気に入りを解除しました' : 'お気に入りに追加しました！', 'success');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* パンくず */}
        <button
          onClick={() => navigate('/products')}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          商品一覧に戻る
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 画像ギャラリー */}
          <div className="space-y-3">
            <div className="card relative aspect-square overflow-hidden bg-slate-100">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.isNew && (
                <span className="absolute left-3 top-3 rounded-md bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  NEW
                </span>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  </button>
                </>
              )}
            </div>
            {/* サムネイル */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                      activeImage === i ? 'border-brand-600 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 詳細 */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-brand-600">{CATEGORY_LABELS[product.category]}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>

            {/* 在庫 */}
            <div className="mt-4 flex items-center gap-2">
              {product.stock > 20 ? (
                <span className="badge bg-emerald-50 text-emerald-700">
                  <Check className="h-3 w-3" /> 在庫あり
                </span>
              ) : product.stock > 0 ? (
                <span className="badge bg-amber-50 text-amber-700">
                  <AlertCircle className="h-3 w-3" /> 残り{product.stock}点
                </span>
              ) : (
                <span className="badge bg-rose-50 text-rose-700">在庫切れ</span>
              )}
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Heart className="h-4 w-4 text-rose-400" />
                {product.favoriteCount}人がお気に入り
              </span>
            </div>

            {/* 説明 */}
            <div className="mt-5 flex-1">
              <h3 className="mb-2 text-sm font-bold text-slate-700">商品説明</h3>
              <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
            </div>

            {/* アクション */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleFavorite}
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 ${
                  fav
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Heart className={`h-5 w-5 ${fav ? 'fill-white' : ''}`} />
                    {fav ? 'お気に入り解除' : 'お気に入りに追加'}
                  </>
                )}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98]">
                <ShoppingBag className="h-5 w-5" />
                カートに追加
              </button>
            </div>
          </div>
        </div>

        {/* 関連商品 */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連商品</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    navigate(`/product/${rel.id}`);
                    setActiveImage(0);
                  }}
                  className="card w-44 shrink-0 cursor-pointer overflow-hidden transition-all hover:shadow-card hover:-translate-y-0.5"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img src={rel.images[0]} alt={rel.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-2.5">
                    <h3 className="line-clamp-1 text-xs font-semibold text-slate-700">{rel.name}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-900">{formatPrice(rel.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
