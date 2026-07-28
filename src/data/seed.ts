import type { Member, Product } from '../types';

// Pexels の高品質ストック画像を使用（実際のAWS S3アップロードを模擬）
const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

export const seedProducts: Product[] = [
  {
    id: 'p1',
    name: 'プレミアム コットン オーバーシャツ',
    category: 'apparel',
    price: 12800,
    description:
      '厳選されたオーガニックコットン100%で織り上げた、ワンランク上の日常着。シルキーな肌触りと上品なドレープが特徴で、ビジネスからカジュアルまで幅広く活躍します。',
    images: [img(7679720), img(6311392), img(6311622)],
    isNew: true,
    favoriteCount: 142,
    stock: 38,
    createdAt: '2026-07-20T09:00:00Z',
  },
  {
    id: 'p2',
    name: 'レザートレーナー スニーカー',
    category: 'shoes',
    price: 24800,
    description:
      'イタリア製のフルレザーアッパーを採用したプレミアムスニーカー。カスタムラバーのアウトソールが歩行性を支え、あらゆるスタイルに馴染む洗練されたシルエットです。',
    images: [img(2529148), img(1456736), img(1598505)],
    isNew: true,
    favoriteCount: 98,
    stock: 22,
    createdAt: '2026-07-22T10:30:00Z',
  },
  {
    id: 'p3',
    name: 'ミニマル クロスボディバッグ',
    category: 'accessories',
    price: 9800,
    description:
      'コンパクトでありながら収納力抜群。イタリアンレザーの質感と真鍮製金具が上品さを演出。デイリー使いから旅行先まで、あらゆるシーンで活躍する一着です。',
    images: [img(904350), img(1152077), img(1203746)],
    isNew: false,
    favoriteCount: 76,
    stock: 54,
    createdAt: '2026-06-15T09:00:00Z',
  },
  {
    id: 'p4',
    name: 'ノイズキャンセリング ワイヤレスイヤホン',
    category: 'electronics',
    price: 34800,
    description:
      '業界最高クラスのハイブリッドノイズキャンセリングを搭載。最大40時間の連続再生と、快適な装着感で通勤・リラックスの両方を支えます。',
    images: [img(3394650), img(3780681), img(3740740)],
    isNew: true,
    favoriteCount: 215,
    stock: 17,
    createdAt: '2026-07-25T14:00:00Z',
  },
  {
    id: 'p5',
    name: 'カシミアブレンド ニットセーター',
    category: 'apparel',
    price: 16800,
    description:
      '最高級カシミアとメリノウールをブレンドした、軽やかで温かいニット。肌に触れる瞬間から分かる上質な滑らかさと、着るほどに馴染むシルエットです。',
    images: [img(7679720), img(6311392), img(6311622)],
    isNew: false,
    favoriteCount: 64,
    stock: 41,
    createdAt: '2026-05-28T09:00:00Z',
  },
  {
    id: 'p6',
    name: 'チタン ブレスレットウォッチ',
    category: 'accessories',
    price: 42000,
    description:
      '軽量で傷つきにくいチタン素材を採用したメカニカルウォッチ。スイス製ムーブメントを搭載し、日常のあらゆる場面で頼れる一本です。',
    images: [img(904350), img(1152077), img(1203746)],
    isNew: false,
    favoriteCount: 53,
    stock: 12,
    createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'p7',
    name: 'ランニング パフォーマンスシューズ',
    category: 'shoes',
    price: 15800,
    description:
      '超軽量フォームと通気性の高いメッシュアッパーで、長距離ランニングも快適。反発力のあるミッドソールが走りを後押しします。',
    images: [img(2529148), img(1456736), img(1598505)],
    isNew: false,
    favoriteCount: 89,
    stock: 63,
    createdAt: '2026-06-02T09:00:00Z',
  },
  {
    id: 'p8',
    name: 'スマートホーム ハブ mini',
    category: 'electronics',
    price: 9800,
    description:
      '照明・エアコン・音楽を声で操作。コンパクト設計でどんなスペースにも馴染み、家庭のあらゆる家電を一元管理します。',
    images: [img(3394650), img(3780681), img(3740740)],
    isNew: false,
    favoriteCount: 47,
    stock: 88,
    createdAt: '2026-03-18T09:00:00Z',
  },
];

const now = new Date('2026-07-28T09:00:00Z');
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const seedMembers: Member[] = [
  {
    id: 'm1',
    name: '山田 太郎',
    email: 'taro@example.com',
    phone: '090-1234-5678',
    rank: 'gold',
    status: 'active',
    newsletter: true,
    favoritedProductIds: ['p1', 'p4', 'p3'],
    createdAt: daysAgo(420),
    activityLog: [
      { id: 'a1', timestamp: daysAgo(1), action: 'お気に入り追加', detail: 'プレミアム コットン オーバーシャツ' },
      { id: 'a2', timestamp: daysAgo(3), action: 'ログイン', detail: 'モバイルアプリからログイン' },
      { id: 'a3', timestamp: daysAgo(5), action: 'お気に入り追加', detail: 'ノイズキャンセリング ワイヤレスイヤホン' },
    ],
  },
  {
    id: 'm2',
    name: '佐藤 花子',
    email: 'hanako@example.com',
    phone: '090-2345-6789',
    rank: 'platinum',
    status: 'active',
    newsletter: true,
    favoritedProductIds: ['p2', 'p4', 'p6', 'p1'],
    createdAt: daysAgo(800),
    activityLog: [
      { id: 'a4', timestamp: daysAgo(0), action: 'お気に入り追加', detail: 'レザートレーナー スニーカー' },
      { id: 'a5', timestamp: daysAgo(2), action: 'プロフィール更新', detail: '電話番号を変更しました' },
    ],
  },
  {
    id: 'm3',
    name: '鈴木 一郎',
    email: 'ichiro@example.com',
    phone: '090-3456-7890',
    rank: 'silver',
    status: 'active',
    newsletter: false,
    favoritedProductIds: ['p7', 'p3'],
    createdAt: daysAgo(120),
    activityLog: [
      { id: 'a6', timestamp: daysAgo(4), action: 'お気に入り追加', detail: 'ランニング パフォーマンスシューズ' },
    ],
  },
  {
    id: 'm4',
    name: '高橋 美咲',
    email: 'misaki@example.com',
    phone: '090-4567-8901',
    rank: 'gold',
    status: 'active',
    newsletter: true,
    favoritedProductIds: ['p5', 'p1', 'p8'],
    createdAt: daysAgo(310),
    activityLog: [
      { id: 'a7', timestamp: daysAgo(2), action: 'お気に入り追加', detail: 'カシミアブレンド ニットセーター' },
      { id: 'a8', timestamp: daysAgo(6), action: 'ログイン', detail: 'Webブラウザからログイン' },
    ],
  },
  {
    id: 'm5',
    name: '渡辺 健太',
    email: 'kenta@example.com',
    phone: '090-5678-9012',
    rank: 'silver',
    status: 'suspended',
    newsletter: false,
    favoritedProductIds: [],
    createdAt: daysAgo(60),
    activityLog: [
      { id: 'a9', timestamp: daysAgo(30), action: 'アカウント一時停止', detail: '管理者による一時停止' },
    ],
  },
  {
    id: 'm6',
    name: '伊藤 さくら',
    email: 'sakura@example.com',
    phone: '090-6789-0123',
    rank: 'platinum',
    status: 'active',
    newsletter: true,
    favoritedProductIds: ['p6', 'p2', 'p4', 'p3', 'p1'],
    createdAt: daysAgo(950),
    activityLog: [
      { id: 'a10', timestamp: daysAgo(1), action: 'お気に入り追加', detail: 'チタン ブレスレットウォッチ' },
    ],
  },
  {
    id: 'm7',
    name: '中村 大輔',
    email: 'daisuke@example.com',
    phone: '090-7890-1234',
    rank: 'gold',
    status: 'active',
    newsletter: true,
    favoritedProductIds: ['p8', 'p4'],
    createdAt: daysAgo(200),
    activityLog: [
      { id: 'a11', timestamp: daysAgo(3), action: 'お気に入り追加', detail: 'スマートホーム ハブ mini' },
    ],
  },
  {
    id: 'm8',
    name: '小林 結衣',
    email: 'yui@example.com',
    phone: '090-8901-2345',
    rank: 'silver',
    status: 'active',
    newsletter: false,
    favoritedProductIds: ['p5'],
    createdAt: daysAgo(45),
    activityLog: [
      { id: 'a12', timestamp: daysAgo(7), action: '新規会員登録', detail: 'アカウントを作成しました' },
    ],
  },
];

// 管理者アカウント（Cognito 管理者プールを模擬）
export const adminCredentials = {
  email: 'admin@retail-demo.com',
  password: 'admin123',
  name: 'システム管理者',
};

// デモ用一般会員（Taro）
export const demoCustomerCredentials = {
  email: 'taro@example.com',
  password: 'demo123',
};
