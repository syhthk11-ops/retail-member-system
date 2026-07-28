// 画面8: 会員管理一覧画面
// 検索・ステータス絞り込み・ランク絞り込み・アクション（ステータス切替・詳細・CSV）

import { useMemo, useState } from 'react';
import { Search, Users, Download, Eye, Power, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { RankBadge, StatusBadge, formatDate } from '../../components/ui';
import type { MemberRank, MemberStatus, Member } from '../../types';

type SortKey = 'name' | 'rank' | 'createdAt' | 'favorites' | 'status';
type SortDir = 'asc' | 'desc';

const RANK_ORDER: Record<MemberRank, number> = { platinum: 0, gold: 1, silver: 2 };
const STATUS_ORDER: Record<MemberStatus, number> = { active: 0, suspended: 1 };

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp className="h-3 w-3 opacity-30" />;
  return dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

export function MembersScreen() {
  const { members, setMemberStatus, showToast, currentUser } = useAppStore();
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all');
  const [rankFilter, setRankFilter] = useState<'all' | MemberRank>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortMembers = (list: Member[]) => {
    const sorted = [...list];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name, 'ja');
          break;
        case 'rank':
          cmp = RANK_ORDER[a.rank] - RANK_ORDER[b.rank];
          break;
        case 'createdAt':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'favorites':
          cmp = a.favoritedProductIds.length - b.favoritedProductIds.length;
          break;
        case 'status':
          cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  };

  const filtered = useMemo(() => {
    const result = members.filter((m) => {
      const sMatch = statusFilter === 'all' || m.status === statusFilter;
      const rMatch = rankFilter === 'all' || m.rank === rankFilter;
      const searchMatch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());
      return sMatch && rMatch && searchMatch;
    });
    return sortMembers(result);
  }, [members, search, statusFilter, rankFilter, sortKey, sortDir]);

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

  const handleToggleStatus = async (memberId: string, current: MemberStatus) => {
    const newStatus: MemberStatus = current === 'active' ? 'suspended' : 'active';
    await setMemberStatus(memberId, newStatus);
    showToast(`ステータスを「${newStatus === 'active' ? '有効' : '一時停止'}」に変更しました`, 'success');
  };

  const handleCsvExport = () => {
    showToast('CSVエクスポートを開始しました（デモ）', 'info');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">会員管理</h1>
            <p className="mt-1 text-sm text-slate-500">会員データの検索・絞り込み・管理ができます</p>
          </div>
          <button onClick={handleCsvExport} className="btn-secondary">
            <Download className="h-4 w-4" />
            CSVエクスポート
          </button>
        </div>

        {/* フィルタバー */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="名前・メールアドレスで検索..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | MemberStatus)}
              className="input-field w-auto cursor-pointer"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="suspended">一時停止</option>
            </select>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value as 'all' | MemberRank)}
              className="input-field w-auto cursor-pointer"
            >
              <option value="all">すべてのランク</option>
              <option value="platinum">プラチナ</option>
              <option value="gold">ゴールド</option>
              <option value="silver">シルバー</option>
            </select>
          </div>
        </div>

        {/* テーブル */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-4 py-3">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                    >
                      会員
                      <SortIcon active={sortKey === 'name'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 md:table-cell">
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                    >
                      ランク
                      <SortIcon active={sortKey === 'rank'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 lg:table-cell">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                    >
                      登録日
                      <SortIcon active={sortKey === 'createdAt'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 sm:table-cell">
                    <button
                      onClick={() => handleSort('favorites')}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                    >
                      お気に入り
                      <SortIcon active={sortKey === 'favorites'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-700"
                    >
                      ステータス
                      <SortIcon active={sortKey === 'status'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                      <Users className="mx-auto mb-2 h-8 w-8" />
                      該当する会員が見つかりません
                    </td>
                  </tr>
                ) : (
                  filtered.map((member) => (
                    <tr key={member.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{member.name}</p>
                            <p className="truncate text-xs text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <RankBadge rank={member.rank} />
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-slate-500 lg:table-cell">
                        {formatDate(member.createdAt)}
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">
                        {member.favoritedProductIds.length}件
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(member.id, member.status)}
                            title={member.status === 'active' ? '一時停止' : '再有効化'}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              member.status === 'active'
                                ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'
                                : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'
                            }`}
                          >
                            <Power className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/member/${member.id}`)}
                            title="詳細表示"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/member/${member.id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            {filtered.length}件 / 全{members.length}件
          </div>
        </div>
      </div>
    </div>
  );
}
