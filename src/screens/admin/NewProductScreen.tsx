// 画面10: 新作商品投稿・編集画面
// 商品名・カテゴリ・価格・説明・ドラッグ＆ドロップ画像プレビュー・新着公開トグル

import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, Check, Save, Package } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';
import { useRouter } from '../../store/Router';
import { StorageService } from '../../services/mockApi';
import { CATEGORY_LABELS } from '../../types';
import type { ProductCategory } from '../../types';
import { Spinner } from '../../components/ui';

export function NewProductScreen() {
  const { createProduct, showToast, currentUser } = useAppStore();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('apparel');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [isNew, setIsNew] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const urls = await Promise.all(Array.from(files).slice(0, 4).map((f) => StorageService.uploadImage(f)));
      setImages((prev) => [...prev, ...urls].slice(0, 4));
      showToast('画像をアップロードしました', 'success');
    } catch {
      showToast('画像のアップロードに失敗しました', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) {
      showToast('必須項目を入力してください', 'error');
      return;
    }
    setLoading(true);
    try {
      const fallbackImg = 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=900';
      await createProduct({
        name,
        category,
        price: parseInt(price, 10) || 0,
        description,
        images: images.length > 0 ? images : [fallbackImg],
        isNew,
        stock: parseInt(stock, 10) || 0,
      });
      showToast(isNew ? '新着商品として公開しました！会員画面に即時反映されます' : '商品を公開しました', 'success');
      navigate('/admin/dashboard');
    } catch {
      showToast('公開に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">新作商品投稿</h1>
          <p className="mt-1 text-sm text-slate-500">新商品を登録して会員画面に公開できます</p>
        </div>

        <form onSubmit={handlePublish} className="space-y-5">
          {/* 画像アップロード */}
          <div className="card p-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">商品画像</label>
            <p className="mb-3 text-xs text-slate-500">最大4枚までアップロードできます（Amazon S3 に保存されます）</p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors ${
                dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                <Upload className="h-6 w-6 text-brand-600" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">画像をドラッグ＆ドロップ</p>
              <p className="text-xs text-slate-400">またはクリックしてファイルを選択</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void handleFiles(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        メイン
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 商品情報 */}
          <div className="card p-5">
            <div className="space-y-4">
              {/* 商品名 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">商品名 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: プレミアム コットン オーバーシャツ"
                  className="input-field"
                />
              </div>

              {/* カテゴリ・価格 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">カテゴリ <span className="text-rose-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="input-field cursor-pointer"
                  >
                    {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">価格（税抜） <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">¥</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="12800"
                      className="input-field pl-7"
                    />
                  </div>
                </div>
              </div>

              {/* 在庫 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">在庫数</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="input-field w-32"
                />
              </div>

              {/* 商品説明 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">商品説明 <span className="text-rose-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="商品の特徴や魅力を記載してください..."
                  className="input-field resize-none"
                />
              </div>

              {/* 新着公開トグル */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isNew ? 'bg-rose-100' : 'bg-slate-200'}`}>
                    <Sparkles className={`h-5 w-5 ${isNew ? 'text-rose-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">新着商品として公開</p>
                    <p className="text-xs text-slate-500">オンにすると会員の新着商品一覧に即時表示されます</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNew((v) => !v)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${isNew ? 'bg-brand-600' : 'bg-slate-300'}`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                      isNew ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* アクション */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <Spinner size="sm" /> : <>
                <Save className="h-4 w-4" /> {isNew ? '新着商品として公開' : '商品を公開'}
              </>}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
