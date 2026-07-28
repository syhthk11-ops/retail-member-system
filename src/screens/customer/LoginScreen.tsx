// 画面1: ログイン・新規登録画面
// Amazon Cognito の認証フローを意識した UI

import { useState } from 'react';
import { Mail, Lock, User, Tag, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { Spinner } from '../../components/ui';

export function LoginScreen() {
  const { login, register, showToast } = useAppStore();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // ログインフォーム
  const [loginEmail, setLoginEmail] = useState('taro@example.com');
  const [loginPassword, setLoginPassword] = useState('demo123');

  // 登録フォーム
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNewsletter, setRegNewsletter] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPassword);
      showToast(`ようこそ、${user.name}さん！`, 'success');
      navigate('/products');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'ログインに失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('すべての項目を入力してください', 'error');
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: regName, email: regEmail, password: regPassword, newsletter: regNewsletter });
      showToast(`会員登録完了！ようこそ、${user.name}さん`, 'success');
      navigate('/products');
    } catch (err) {
      showToast(err instanceof Error ? err.message : '登録に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('taro@example.com', 'demo123');
      showToast('デモログイン成功！Taroとしてログインしました', 'success');
      navigate('/products');
    } catch {
      showToast('ログインに失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Retail Member Cloud</h1>
          <p className="mt-1 text-sm text-slate-500">AWS クラウド対応メンバーシップシステム</p>
        </div>

        <div className="card overflow-hidden">
          {/* タブ */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                tab === 'login'
                  ? 'border-b-2 border-brand-600 text-brand-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                tab === 'register'
                  ? 'border-b-2 border-brand-600 text-brand-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              新規会員登録
            </button>
          </div>

          <div className="p-6">
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">メールアドレス</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">パスワード</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Spinner size="sm" /> : <>ログイン <ArrowRight className="h-4 w-4" /></>}
                </button>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="btn-secondary w-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  <Sparkles className="h-4 w-4" /> デモログイン（ワンタップ）
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">お名前</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="山田 太郎"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">メールアドレス</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">パスワード</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="8文字以上"
                    />
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setRegNewsletter((v) => !v)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                      regNewsletter ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {regNewsletter && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </button>
                  <div>
                    <span className="text-sm font-medium text-slate-700">メルマガを購読する</span>
                    <p className="text-xs text-slate-500">新着商品やお得な情報をお届けします</p>
                  </div>
                </label>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Spinner size="sm" /> : <>新規登録 <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <Tag className="h-3 w-3" />
          Amazon Cognito 認証基盤との連携を想定したデモ画面です
        </p>
      </div>
    </div>
  );
}
