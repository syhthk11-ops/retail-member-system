// 画面5: 会員情報編集画面
// 氏名・メール・電話番号・メルマガ購読設定の更新フォーム

import { useState } from 'react';
import { User, Mail, Phone, Save, ArrowLeft, Check, Bell } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { Spinner } from '../../components/ui';

export function EditProfileScreen() {
  const { currentUser, members, updateMemberProfile, showToast } = useAppStore();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  const member = members.find((m) => m.id === currentUser?.id);

  const [name, setName] = useState(member?.name ?? '');
  const [email, setEmail] = useState(member?.email ?? '');
  const [phone, setPhone] = useState(member?.phone ?? '');
  const [newsletter, setNewsletter] = useState(member?.newsletter ?? true);

  if (!currentUser || currentUser.role !== 'customer' || !member) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500">ログインが必要です</p>
        <button onClick={() => navigate('/login')} className="btn-primary mt-4">
          ログイン画面へ
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMemberProfile({ name, email, phone, newsletter });
      showToast('会員情報を更新しました', 'success');
    } catch {
      showToast('更新に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate('/mypage')}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          マイページに戻る
        </button>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h1 className="text-lg font-bold text-slate-800">会員情報編集</h1>
            <p className="mt-0.5 text-sm text-slate-500">プロフィール情報を更新できます</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 p-6">
            {/* 氏名 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">お名前</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" />
              </div>
            </div>

            {/* メール */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" />
              </div>
            </div>

            {/* 電話番号 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">電話番号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="090-1234-5678"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* メルマガ */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">通知設定</label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                <button
                  type="button"
                  onClick={() => setNewsletter((v) => !v)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                    newsletter ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {newsletter && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-brand-500" />
                    <span className="text-sm font-semibold text-slate-700">メルマガを購読する</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">新着商品、セール情報、限定クーポンをお届けします</p>
                </div>
              </label>
            </div>

            {/* 保存ボタン */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? <Spinner size="sm" /> : <>
                  <Save className="h-4 w-4" /> 保存する
                </>}
              </button>
              <button type="button" onClick={() => navigate('/mypage')} className="btn-secondary">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
