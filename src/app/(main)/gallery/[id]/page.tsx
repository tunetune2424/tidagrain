'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ギャラリー写真データ（後でSupabaseに差し替える）
// product: null → 購入ボタンを表示しない / product: {...} → 購入ボタンを表示する
const PHOTOS = [
  {
    id: 1,
    src: 'https://i.imgur.com/EnZcuHD.jpeg',
    title: '光の向こう側',
    tags: '沖縄 · 日常',
    description: `今帰仁村の坂道を歩いていたら、\nふと海が見えた。\n夕方の光が建物の隙間から差し込んで、\n空気ごと金色に溶けていく感じがした。`,
    specs: [
      { label: '撮影日', value: '2024年11月03日' },
      { label: '場所', value: '沖縄県 今帰仁村' },
      { label: 'カメラ', value: 'Nikon FM2' },
      { label: 'フィルム', value: 'Kodak Portra 400' },
      { label: '現像', value: '写真屋さん（那覇）' },
    ],
    // この写真はショップの商品と紐づいている（productId = shop/[id] の id）
    product: { name: '光の向こう側 #01', sub: 'A4 / フレーム付き', price: 4200, productId: 1 },
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop',
    title: '朝の光',
    tags: '日常',
    description: `東京の朝、\nカーテン越しに差し込む光。\nこういう何気ない瞬間が好きだ。`,
    specs: [
      { label: '撮影日', value: '2024年09月' },
      { label: '場所', value: '東京' },
      { label: 'カメラ', value: 'Nikon FM2' },
      { label: 'フィルム', value: 'Kodak Portra 400' },
    ],
    product: { name: '日常の光 #02', sub: 'A4 / フレーム付き', price: 1200, productId: 2 },
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
    title: '路地の猫',
    tags: '旅',
    description: `京都の路地で出会った猫。\nじっとこちらを見ていた。`,
    specs: [
      { label: '撮影日', value: '2024年08月' },
      { label: '場所', value: '京都' },
      { label: 'カメラ', value: 'Canon AE-1' },
      { label: 'フィルム', value: 'Kodak Gold 200' },
    ],
    product: null,
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    title: '海岸の朝',
    tags: '沖縄',
    description: `朝早く海へ出た。\n誰もいない砂浜に、波の音だけが続いていた。`,
    specs: [
      { label: '撮影日', value: '2024年11月' },
      { label: '場所', value: '沖縄県' },
      { label: 'カメラ', value: 'Nikon FM2' },
      { label: 'フィルム', value: 'Kodak Portra 400' },
    ],
    product: null,
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc45?q=80&w=800&auto=format&fit=crop',
    title: '野の花',
    tags: '自然',
    description: `道端に咲いていた花。\n名前は知らないけれど、光を受けて輝いていた。`,
    specs: [
      { label: '撮影日', value: '2024年07月' },
      { label: '場所', value: '長野県' },
      { label: 'カメラ', value: 'Nikon FM2' },
      { label: 'フィルム', value: 'Fuji Superia 400' },
    ],
    product: null,
  },
]

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  // URLの [id] を数値に変換して該当写真を取得
  const id = Number(params.id)
  const photo = PHOTOS.find((p) => p.id === id)

  // 前後の写真（存在しなければ undefined → 矢印ボタンをグレーアウト）
  const prevPhoto = PHOTOS.find((p) => p.id === id - 1)
  const nextPhoto = PHOTOS.find((p) => p.id === id + 1)

  // 「他の写真」= 今表示中の写真を除いた最大4枚
  const related = PHOTOS.filter((p) => p.id !== id).slice(0, 4)

  // 該当写真が見つからない場合のフォールバック
  if (!photo) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-20 text-center text-muted">
        写真が見つかりません。
      </div>
    )
  }

  // 現在のページURLをクリップボードにコピー
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <>
      {/* パンくずリスト */}
      <div className="max-w-[1100px] mx-auto px-8 py-5">
        <p className="text-[11px] text-muted tracking-[0.08em]">
          <Link href="/" className="hover:opacity-60 transition-opacity">home</Link>
          {' '}&nbsp;/{' '}&nbsp;
          <Link href="/gallery" className="hover:opacity-60 transition-opacity">gallery</Link>
          {' '}&nbsp;/{' '}&nbsp;
          {photo.title}
        </p>
      </div>

      {/* メインコンテンツ：左に写真 / 右に情報 */}
      <section className="max-w-[1100px] mx-auto px-8 pb-20">
        {/* grid-cols-[1fr_400px] = 左は可変幅、右は固定400px */}
        <div className="grid grid-cols-[1fr_400px] gap-16 items-start">

          {/* 左カラム：写真エリア */}
          <div>
            {/* 上部ナビ：戻るリンク + 前後矢印 */}
            <div className="flex justify-between items-center mb-4">
              <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-[6px] hover:opacity-60 transition-opacity">
                <ChevronLeft size={14} strokeWidth={1.5} />
                ギャラリーに戻る
              </Link>
              <div className="flex gap-2">
                {/* 前の写真がある → Linkとして機能 / ない → グレーアウトしたdiv */}
                {prevPhoto ? (
                  <Link href={`/gallery/${prevPhoto.id}`} className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-t-text hover:text-t-text transition-colors">
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-muted/30">
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </div>
                )}
                {/* 次の写真がある → Linkとして機能 / ない → グレーアウトしたdiv */}
                {nextPhoto ? (
                  <Link href={`/gallery/${nextPhoto.id}`} className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-t-text hover:text-t-text transition-colors">
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-muted/30">
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>

            {/* メイン写真（高さ固定なし → 縦横比をそのまま保つ） */}
            <div className="border border-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.title} className="film w-full block" />
            </div>
          </div>

          {/* 右カラム：写真情報 */}
          <div className="pt-12">
            <p className="text-[11px] text-muted tracking-[0.08em] mb-3">{photo.tags}</p>
            <h1 className="font-serif-en text-[32px] font-normal leading-[1.3] mb-6">{photo.title}</h1>

            {/* whitespace-pre-line = \n を改行として表示する */}
            <p className="font-serif-jp text-[13px] leading-[2.8] text-muted2 mb-9 whitespace-pre-line">
              {photo.description}
            </p>

            {/* 撮影情報テーブル（last:border-b = 最後の行だけ下線を追加） */}
            <table className="w-full text-[12px] border-collapse mb-9">
              <tbody>
                {photo.specs.map((spec) => (
                  <tr key={spec.label} className="border-t border-border last:border-b">
                    <td className="py-3 text-muted w-[40%]">{spec.label}</td>
                    <td className="py-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* プリント購入ボックス：product が null でない写真だけ表示 */}
            {photo.product && (
              <div className="bg-[#f0ede8] border border-border p-6 mb-4">
                <p className="text-[12px] text-muted mb-2">この写真をプリントで購入</p>
                <p className="font-serif-en text-[22px] font-normal mb-4">{photo.product.name}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px]">{photo.product.sub}</span>
                  <span className="text-[15px]">¥{photo.product.price.toLocaleString()}</span>
                </div>
                {/* /shop/[productId] に遷移する */}
                <Link
                  href={`/shop/${photo.product.productId}`}
                  className="block w-full py-[14px] bg-t-text text-bg text-[12px] text-center tracking-[0.1em] font-light transition-opacity hover:opacity-75"
                >
                  プリントを購入する
                </Link>
              </div>
            )}

            {/* リンクコピーボタン */}
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-[10px] border border-border text-[11px] tracking-[0.08em] text-muted2 hover:border-t-text transition-colors"
              >
                リンクをコピー
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 他の写真セクション */}
      <section className="border-t border-border px-8 py-14">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-[15px] font-normal">他の写真</h2>
            <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
              ギャラリーをすべて見る <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-[10px]">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/gallery/${r.id}`}
                className="group h-[180px] border border-border overflow-hidden block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.src}
                  alt={r.title}
                  className="film w-full h-full object-cover transition-transform duration-[1600ms] ease-in-out group-hover:scale-[1.04]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
