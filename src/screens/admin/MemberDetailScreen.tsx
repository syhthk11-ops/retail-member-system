// 画面9: 会員詳細プロファイル画面
// 基本情報・ランク変更・お気に入り商品一覧・アカウント操作ログ

import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Heart, Crown, Clock, Power, Check } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { RankBadge, StatusBadge, formatPrice, formatDateTime, timeAgo } from '../../components/ui';
import { CATEGORY_LABELS, RANK_LABELS } from '../../types';
import type { MemberRank } from '../../types';
import { Modal, Spinner } from '../../components/ui';

export function MemberDetailScreen() {
  const { members, products, currentUser, setMemberRank, setMemberStatus, showToast } = useAppStore();
  const { params, navigate } = useRouter();
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<MemberRank>('silver');
  const [loading, setLoading] = useState(false);

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

  const member = members.find((m) => m.id === params.id);

  if (!member) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-400">会員が見つかりません</p>
        <button onClick={() => navigate('/admin/members')} className="btn-primary mt-4">
          会員一覧へ戻る
        </button>
      </div>
    );
  }

  const favProducts = products.filter((p) => member.favoritedProductIds.includes(p.id));

  const handleRankChange = async () => {
    setLoading(true);
    try {
      await setMemberRank(member.id, selectedRank);
      setRankModalOpen(false);
      showToast(`${member.name}のランクを${RANK_LABELS[selectedRank]}に変更しました`, 'success');
    } catch {
      showToast('ランク変更に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = member.status === 'active' ? 'suspended' : 'active';
    await setMemberStatus(member.id, newStatus);
    showToast(`ステータスを「${newStatus === 'active' ? '有効' : '一時停止'}」に変更しました`, 'success');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button
          onClick={() => navigate('/admin/members')}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          会員一覧に戻る
        </button>

        {/* プロファイルヘッダー */}
        <div className="card mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-navy to-brand-800 px-6 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold backdrop-blur ring-1 ring-white/20">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{member.name}</h1>
                <p className="text-sm text-brand-200">ID: {member.id}</p>
                <div className="mt-2 flex items-center gap-2">
                  <RankBadge rank={member.rank} size="md" />
                  <StatusBadge status={member.status} />
                </div>
              </div>
              <div className="hidden gap-2 sm:flex">
                <button
                  onClick={() => {
                    setSelectedRank(member.rank);
                    setRankModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur transition-all hover:bg-white/20"
                >
                  <Crown className="h-3.5 w-3.5" />
                  ランク変更
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ring-1 backdrop-blur transition-all ${
                    member.status === 'active'
                      ? 'bg-rose-500/20 text-rose-200 ring-rose-400/30 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30 hover:bg-emerald-500/30'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  {member.status === 'active' ? '停止' : '有効化'}
                </button>
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">メールアドレス</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">{member.email}</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">電話番号</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">{member.phone || '未登録'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* お気に入り商品 */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Heart className="h-5 w-5 text-rose-500" />
                <h2 className="text-base font-bold text-slate-800">お気に入り商品</h2>
                <span className="ml-auto text-sm text-slate-400">{favProducts.length}件</span>
              </div>
              {favProducts.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">お気に入り商品はありません</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                  {favProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="card cursor-pointer overflow-hidden transition-all hover:shadow-card hover:-translate-y-0.5"
                    >
                      <div className="aspect-square overflow-hidden bg-slate-100">
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[10px] font-medium text-brand-500">{CATEGORY_LABELS[product.category]}</p>
                        <h3 className="line-clamp-1 text-xs font-semibold text-slate-700">{product.name}</h3>
                        <p className="text-sm font-bold text-slate-900">{formatPrice(product.price)}</p>
                      </div>
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
                <h2 className="text-base font-bold text-slate-800">操作ログ</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {member.activityLog.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">ログはありません</p>
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
          </div>
        </div>
      </div>

      {/* ランク変更モーダル */}
      <Modal open={rankModalOpen} onClose={() => setRankModalOpen(false)} title="会員ランク変更" maxWidth="max-w-sm">
        <div className="p-5">
          <p className="mb-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{member.name}</span> さんのランクを選択してください
          </p>
          <div className="space-y-2">
            {(['platinum', 'gold', 'silver'] as MemberRank[]).map((rank) => (
              <button
                key={rank}
                onClick={() => setSelectedRank(rank)}
                className={`flex w-full items-center justify-between rounded-lg border-2 p-3 transition-all ${
                  selectedRank === rank ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={rank} size="md" />
                </div>
                {selectedRank === rank && <Check className="h-5 w-5 text-brand-600" />}
              </button>
            ))}
          </div>
          <button onClick={handleRankChange} disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? <Spinner size="sm" /> : <>ランクを変更する</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}
