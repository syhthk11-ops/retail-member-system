// 共通UI部品 — Toast・バッジ・モーダル・チャートなど

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { MemberRank, MemberStatus } from '../types';
import { RANK_LABELS, RANK_CASHBACK } from '../types';
import { useAppStore } from '../store/AppStore';

// ---------------------------------------------------------------------------
// Toast コンテナ
// ---------------------------------------------------------------------------
export function ToastContainer() {
  const { toasts, dismissToast } = useAppStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5">
      {toasts.map((t) => {
        const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;
        const color =
          t.type === 'success'
            ? 'text-emerald-600'
            : t.type === 'error'
              ? 'text-rose-600'
              : 'text-brand-600';
        const ring =
          t.type === 'success'
            ? 'border-l-emerald-500'
            : t.type === 'error'
              ? 'border-l-rose-500'
              : 'border-l-brand-500';
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-lg border border-slate-200 ${ring} border-l-4 bg-white px-4 py-3 shadow-card animate-slide-in-right min-w-[280px] max-w-sm`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <p className="flex-1 text-sm font-medium text-slate-700">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// モーダル
// ---------------------------------------------------------------------------
export function Modal({
  open,
  onClose,
  children,
  title,
  maxWidth = 'max-w-md',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} animate-scale-in`}>
        <div className="card overflow-hidden">
          {title && (
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-slate-800">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 会員ランクバッジ
// ---------------------------------------------------------------------------
export function RankBadge({ rank, size = 'sm' }: { rank: MemberRank; size?: 'sm' | 'md' }) {
  const styles: Record<MemberRank, string> = {
    platinum: 'bg-gradient-to-r from-slate-700 to-slate-900 text-white',
    gold: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
    silver: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800',
  };
  const sizeCls = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`badge ${sizeCls} ${styles[rank]} shadow-sm`}>
      {RANK_LABELS[rank]}
    </span>
  );
}

export function RankBadgeWithCashback({ rank }: { rank: MemberRank }) {
  const styles: Record<MemberRank, string> = {
    platinum: 'from-slate-700 to-slate-900',
    gold: 'from-amber-400 to-amber-600',
    silver: 'from-slate-300 to-slate-400',
  };
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${styles[rank]} px-4 py-2 shadow-sm`}>
      <span className="text-sm font-bold text-white">{RANK_LABELS[rank]}</span>
      <span className="text-xs font-medium text-white/80">· {RANK_CASHBACK[rank]}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ステータスバッジ
// ---------------------------------------------------------------------------
export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span
      className={`badge ${
        status === 'active'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-rose-50 text-rose-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      {status === 'active' ? '有効' : '一時停止'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// 価格フォーマット
// ---------------------------------------------------------------------------
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// 日時フォーマット
// ---------------------------------------------------------------------------
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (mins > 0) return `${mins}分前`;
  return 'たった今';
}

// ---------------------------------------------------------------------------
// バーチャート（CSS のみ）
// ---------------------------------------------------------------------------
export function BarChart({
  data,
  color = 'bg-brand-500',
  height = 160,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end justify-center">
            <div
              className={`w-full max-w-[40px] rounded-t-md ${color} transition-all duration-700 ease-out hover:opacity-80`}
              style={{ height: `${(d.value / max) * 100}%`, minHeight: '4px' }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{d.label}</span>
          <span className="text-xs font-bold text-slate-700">{d.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ラインチャート（SVG）
// ---------------------------------------------------------------------------
export function LineChart({
  data,
  height = 160,
  color = '#4f46e5',
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const width = 520;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((d.value - min) / range) * ch;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pad.left + cw} ${pad.top + ch} L ${pad.left} ${pad.top + ch} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* グリッド */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad.left}
          y1={pad.top + ch * t}
          x2={pad.left + cw}
          y2={pad.top + ch * t}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}
      {/* エリア */}
      <path d={areaD} fill="url(#lineGrad)" />
      {/* ライン */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* ポイント */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2.5" />
          <text x={p.x} y={pad.top + ch + 18} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>
            {p.label}
          </text>
        </g>
      ))}
      {/* Y軸ラベル */}
      {[0, 0.5, 1].map((t) => (
        <text
          key={t}
          x={pad.left - 8}
          y={pad.top + ch * (1 - t) + 4}
          textAnchor="end"
          className="fill-slate-400"
          style={{ fontSize: 10 }}
        >
          {Math.round(min + range * t).toLocaleString()}
        </text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ローディングスピナー
// ---------------------------------------------------------------------------
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <svg className={`animate-spin ${s} text-current`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ドーナツチャート（SVG）
// ---------------------------------------------------------------------------
export function DonutChart({
  data,
  size = 140,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="shrink-0">
        {data.map((d, i) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-slate-800 font-bold" style={{ fontSize: 18 }}>
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          合計
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-xs font-medium text-slate-600">{d.label}</span>
            <span className="text-xs font-bold text-slate-800">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
