// 画面7: エグゼクティブ・ダッシュボード
// KPIカード・会員数推移ラインチャート・カテゴリ別人気バーチャート・お気に入りランキングTop5

import { useMemo } from 'react';
import { Users, Heart, TrendingUp, Activity, Crown, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { BarChart, LineChart, RankBadge, formatPrice, DonutChart } from '../../components/ui';
import { CATEGORY_LABELS } from '../../types';
import type { ProductCategory } from '../../types';

export function DashboardScreen() {
  const { members, products, currentUser } = useAppStore();
  const { navigate } = useRouter();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500">管理者ログインが必要です</p>
        <button onClick={() => navigate('/admin/login')} className="btn-primary mt-4">
          管理者ログイン画面へ
        </button>
      </div>
    );
  }

  // KPI計算
  const totalMembers = 12480; // デモ用の大規模数値
  const activeThisMonth = members.filter((m) => m.status === 'active').length;
  const todayFavorites = products.reduce((sum, p) => sum + p.favoriteCount, 0);

  // 会員数推移（モックデータ）
  const memberTrend = [
    { label: '1月', value: 8200 },
    { label: '2月', value: 8900 },
    { label: '3月', value: 9500 },
    { label: '4月', value: 10100 },
    { label: '5月', value: 10800 },
    { label: '6月', value: 11600 },
    { label: '7月', value: 12480 },
  ];

  // カテゴリ別人気（お気に入り合計）
  const categoryPopularity = useMemo(() => {
    const cats: ProductCategory[] = ['apparel', 'shoes', 'accessories', 'electronics'];
    return cats.map((cat) => {
      const total = products.filter((p) => p.category === cat).reduce((s, p) => s + p.favoriteCount, 0);
      return { label: CATEGORY_LABELS[cat], value: total };
    });
  }, [products]);

  // お気に入りランキング Top5
  const ranking = useMemo(() => {
    return [...products].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 5);
  }, [products]);

  // ランク別会員分布
  const rankDistribution = useMemo(() => {
    const platinum = members.filter((m) => m.rank === 'platinum').length;
    const gold = members.filter((m) => m.rank === 'gold').length;
    const silver = members.filter((m) => m.rank === 'silver').length;
    return [
      { label: 'プラチナ', value: platinum, color: '#334155' },
      { label: 'ゴールド', value: gold, color: '#d97706' },
      { label: 'シルバー', value: silver, color: '#94a3b8' },
    ];
  }, [members]);

  const kpis = [
    { label: '総会員数', value: totalMembers.toLocaleString(), unit: '人', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50', trend: '+5.9%' },
    { label: '今月のアクティブ', value: activeThisMonth.toLocaleString(), unit: '人', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3.2%' },
    { label: 'お気に入り登録数', value: todayFavorites.toLocaleString(), unit: '件', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+12.4%' },
    { label: '掲載商品数', value: products.length.toLocaleString(), unit: '件', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+2' },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">エグゼクティブ・ダッシュボード</h1>
          <p className="mt-1 text-sm text-slate-500">リアルタイムで更新される経営指標ダッシュボード</p>
        </div>

        {/* KPIカード */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="card p-5 transition-all hover:shadow-card">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.bg}`}>
                    <Icon className={`h-5.5 w-5.5 ${kpi.color}`} />
                  </div>
                  <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.trend}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {kpi.value}
                  <span className="ml-1 text-sm font-medium text-slate-400">{kpi.unit}</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 会員数推移 */}
          <div className="card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-500" />
              <h2 className="text-base font-bold text-slate-800">会員数推移</h2>
              <span className="ml-auto text-xs text-slate-400">過去7ヶ月</span>
            </div>
            <LineChart data={memberTrend} height={200} showTooltip tooltipUnit="件" />
          </div>

          {/* ランク分布 */}
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800">会員ランク分布</h2>
            </div>
            <div className="flex items-center justify-center py-4">
              <DonutChart data={rankDistribution} size={160} />
            </div>
          </div>

          {/* カテゴリ別人気 */}
          <div className="card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-500" />
              <h2 className="text-base font-bold text-slate-800">カテゴリ別お気に入り人気</h2>
              <span className="ml-auto text-xs text-slate-400">リアルタイム集計</span>
            </div>
            <BarChart data={categoryPopularity} height={180} />
          </div>

          {/* お気に入りランキング */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
              <Heart className="h-5 w-5 text-rose-500" />
              <h2 className="text-base font-bold text-slate-800">お気に入り Top 5</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {ranking.map((product, i) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-slate-50"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      i === 0
                        ? 'bg-amber-100 text-amber-700'
                        : i === 1
                          ? 'bg-slate-200 text-slate-600'
                          : i === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-400">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-rose-500">
                    <Heart className="h-3.5 w-3.5 fill-rose-500" />
                    {product.favoriteCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
