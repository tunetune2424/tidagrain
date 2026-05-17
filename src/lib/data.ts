// ショップ・トップページで使う仮の商品データ
// ※ 今後は Supabase の products テーブルから取得する予定
// ※ id は数値型（Supabase 移行後は string の UUID になる）

export const PRODUCTS = [
  { id: 1, category: 'フォトプリント', name: '光の向こう側 #01', sub: 'A4 / フレーム付き', price: 4200, image: 'https://i.imgur.com/F3hrntK.jpeg', alt: 'フォトプリント' },
  { id: 2, category: 'ポストカード', name: '旅の光 ポストカードセット', sub: '5枚組', price: 1200, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop', alt: 'ポストカード' },
  { id: 3, category: 'トートバッグ', name: '海辺の朝 トートバッグ', sub: 'キャンバス地 / ナチュラル', price: 3800, image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=800&auto=format&fit=crop', alt: 'トートバッグ' },
  { id: 4, category: 'アパレル', name: '夕凪 フォトTシャツ', sub: 'S / M / L', price: 6200, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop', alt: 'Tシャツ' },
  { id: 5, category: 'フォトプリント', name: '朝凪 #03', sub: 'A3 / フレームなし', price: 3200, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', alt: 'フォトプリント' },
  { id: 6, category: 'ポストカード', name: '日常の光 ポストカードセット', sub: '5枚組', price: 1200, image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop', alt: 'ポストカード' },
  { id: 7, category: 'フォトプリント', name: '路地裏の午後 #02', sub: 'A4 / フレームなし', price: 2800, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop', alt: 'フォトプリント' },
  { id: 8, category: 'トートバッグ', name: '砂浜の記憶 トートバッグ', sub: 'キャンバス地 / ナチュラル', price: 3800, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', alt: 'トートバッグ' },
  { id: 9, category: 'アパレル', name: '野の花 フォトTシャツ', sub: 'S / M / L', price: 6200, image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc45?q=80&w=800&auto=format&fit=crop', alt: 'アパレル' },
  { id: 10, category: 'アパレル', name: '朝霧 フォトTシャツ', sub: 'S / M / L', price: 6200, image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=800&auto=format&fit=crop', alt: 'アパレル' },
  { id: 11, category: 'アパレル', name: '朝霧 フォトTシャツ', sub: 'S / M / L', price: 6200, image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=800&auto=format&fit=crop', alt: 'アパレル' },
]
