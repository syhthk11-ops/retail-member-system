// 画面4: マイページ / お気に入り一覧画面
// 会員ランクバッジ・お気に入り商品一覧・アクティビティログ

import { Heart, Edit, Trash2, Clock, ShoppingBag, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { RankBadgeWithCashback, formatPrice, timeAgo } from '../../components/ui';
import { CATEGORY_LABELS } from '../../types';

export function MyPageScreen() {
  const { currentUser, members, products, toggleFavorite, showToast } = useAppStore();
  const { navigate } = useRouter();

  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500">ログインが必要です</p>
        <button onClick={() => navigate('/login')} className="btn-primary mt-4">
          ログイン画面へ
        </button>
      </div>
    );
  }

  const member = members.find((m) => m.id === currentUser.id);
  if (!member) return null;

  const favProducts = products.filter((p) => member.favoritedProductIds.includes(p.id));

  const handleRemove = async (productId: string, productName: string) => {
    await toggleFavorite(productId);
    showToast(`「${productName}」をお気に入りから削除しました`, 'info');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      {/* プロフィールヘッダー */}
      <div className="bg-gradient-to-br from-navy via-brand-800 to-brand-900 px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold backdrop-blur ring-1 ring-white/20">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <p className="text-sm text-brand-200">{member.email}</p>
              <div className="mt-2">
                <RankBadgeWithCashback rank={member.rank} />
              </div>
            </div>
            <button
              onClick={() => navigate('/mypage/edit')}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-all hover:bg-white/20"
            >
              <Edit className="h-4 w-4" />
              会員情報編集
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* 統計カード */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-2 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
              <span className="text-xs font-medium text-slate-500">お気に入り</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900">{member.favoritedProductIds.length}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-brand-500">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-medium text-slate-500">注文履歴</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900">12</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium text-slate-500">会員歴</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {Math.floor((Date.now() - new Date(member.createdAt).getTime()) / 86400000 / 30)}ヶ月
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* お気に入り一覧 */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Heart className="h-5 w-5 text-rose-500" />
                <h2 className="text-base font-bold text-slate-800">お気に入り商品</h2>
                <span className="ml-auto text-sm text-slate-400">{favProducts.length}件</span>
              </div>
              {favProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Heart className="mb-2 h-10 w-10" />
                  <p className="text-sm">お気に入り商品はまだありません</p>
                  <button onClick={() => navigate('/products')} className="btn-secondary mt-4">
                    商品を見に行く
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {favProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-4 transition-colors hover:bg-slate-50">
                      <div
                        className="h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-100"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-brand-500">{CATEGORY_LABELS[product.category]}</p>
                        <h3
                          className="cursor-pointer truncate text-sm font-semibold text-slate-800 hover:text-brand-600"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-sm font-bold text-slate-900">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(product.id, product.name)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* アクティビティログ */}
          <div>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Clock className="h-5 w-5 text-brand-500" />
                <h2 className="text-base font-bold text-slate-800">アクティビティ</h2>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {member.activityLog.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">アクティビティはまだありません</p>
                ) : (
                  <div className="relative px-5 py-4">
                    <div className="absolute bottom-4 left-[26px] top-4 w-px bg-slate-200" />
                    <div className="space-y-4">
                      {member.activityLog.map((log) => (
                        <div key={log.id} className="relative flex gap-3">
                          <div className="z-10 mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-brand-500 ring-4 ring-white" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">{log.action}</p>
                            <p className="text-xs text-slate-500">{log.detail}</p>
                            <p className="mt-0.5 text-[10px] text-slate-400">{timeAgo(log.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ランク特典 */}
            <div className="mt-4 card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-800">ランク特典</h2>
              </div>
              <div className="space-y-2 p-4 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  購入時に{member.rank === 'platinum' ? '10%' : member.rank === 'gold' ? '5%' : '2%'}ポイント還元
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  誕生日月500円クーポン進呈
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  新着商品の先行アクセス
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
