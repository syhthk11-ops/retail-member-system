// 画面6: 管理者ログイン画面
// 管理者専用ログインUI + MFA確認ダイアログ

import { useState } from 'react';
import { Shield, Lock, Mail, KeyRound, Smartphone, Check } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { Modal, Spinner } from '../../components/ui';

export function AdminLoginScreen() {
  const { login, showToast } = useAppStore();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('admin@retail-demo.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerifying, setMfaVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 認証成功 → MFAダイアログを表示
      await login(email, password);
      setMfaOpen(true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'ログインに失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    setMfaVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    setMfaVerifying(false);
    setMfaOpen(false);
    showToast('MFA認証完了。ダッシュボードへようこそ！', 'success');
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg ring-1 ring-white/10">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">管理者コンソール</h1>
          <p className="mt-1 text-sm text-brand-300">システム管理者専用ログイン</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">管理者メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 pl-10 text-sm text-white placeholder:text-slate-500 shadow-sm transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  placeholder="admin@retail-demo.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">パスワード</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 pl-10 text-sm text-white placeholder:text-slate-500 shadow-sm transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" /> : <>
                <Shield className="h-4 w-4" /> 管理者ログイン
              </>}
            </button>
          </form>

          <div className="mt-4 rounded-lg bg-amber-500/10 px-4 py-3 ring-1 ring-amber-500/20">
            <p className="flex items-center gap-1.5 text-xs text-amber-300">
              <KeyRound className="h-3.5 w-3.5" />
              デモ用: admin@retail-demo.com / admin123
            </p>
          </div>
        </div>
      </div>

      {/* MFAダイアログ */}
      <Modal open={mfaOpen} onClose={() => {}} title="2要素認証 (MFA)" maxWidth="max-w-sm">
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Smartphone className="h-7 w-7 text-brand-600" />
          </div>
          <p className="text-center text-sm text-slate-600">
            認証アプリに表示された<br />
            6桁のコードを入力してください
          </p>
          <input
            type="text"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-slate-800 shadow-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            maxLength={6}
          />
          <button
            onClick={handleMfaVerify}
            disabled={mfaVerifying || mfaCode.length !== 6}
            className="btn-primary mt-4 w-full"
          >
            {mfaVerifying ? <Spinner size="sm" /> : <>
              <Check className="h-4 w-4" /> 認証してログイン
            </>}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            デモでは任意の6桁の数字で認証できます
          </p>
        </div>
      </Modal>
    </div>
  );
}
