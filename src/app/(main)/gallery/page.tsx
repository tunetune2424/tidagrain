'use client'

// ギャラリー一覧ページ（/gallery）
// タグフィルター付きのマソンリー（段組み）レイアウトで写真を表示する

import { useState } from 'react'
import Link from 'next/link'

// ギャラリーに表示する写真データ（今後は Supabase から取得予定）
const PHOTOS = [
  { id: 1, src: 'https://i.imgur.com/EnZcuHD.jpeg', location: '沖縄県 今帰仁村 · 2024.11', camera: 'Nikon FM2 / Portra 400', tag: '沖縄' },
  { id: 2, src: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop', location: '東京 · 2024.09', camera: 'Nikon FM2 / Portra 400', tag: '日常' },
  { id: 3, src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop', location: '京都 · 2024.08', camera: 'Canon AE-1 / Kodak Gold 200', tag: '旅' },
  { id: 4, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', location: '沖縄県 · 2024.11', camera: 'Nikon FM2 / Portra 400', tag: '沖縄' },
  { id: 5, src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc45?q=80&w=800&auto=format&fit=crop', location: '長野県 · 2024.07', camera: 'Nikon FM2 / Fuji Superia 400', tag: '自然' },
  { id: 6, src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop', location: '沖縄県 名護市 · 2024.11', camera: 'Nikon FM2 / Portra 400', tag: '沖縄' },
  { id: 7, src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', location: '東京 · 2024.10', camera: 'Canon AE-1 / Kodak Gold 200', tag: '日常' },
  { id: 8, src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop', location: '北海道 · 2024.06', camera: 'Nikon FM2 / Portra 400', tag: '旅' },
  { id: 9, src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=800&auto=format&fit=crop', location: '長野県 · 2024.07', camera: 'Nikon FM2 / Fuji Superia 400', tag: '自然' },
  { id: 10, src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop', location: '京都 · 2024.08', camera: 'Canon AE-1 / Kodak Gold 200', tag: '旅' },
  { id: 11, src: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=800&auto=format&fit=crop', location: '沖縄県 · 2024.11', camera: 'Nikon FM2 / Portra 400', tag: '沖縄' },
  { id: 12, src: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=800&auto=format&fit=crop', location: '東京 · 2024.09', camera: 'Canon AE-1 / Kodak Gold 200', tag: '日常' },
]

// フィルタータグ一覧（「すべて」は全写真を表示する特殊値）
const TAGS = ['すべて', '沖縄', '日常', '旅', '自然']

export default function GalleryPage() {
  // アクティブなタグ（デフォルトは「すべて」）
  const [activeTag, setActiveTag] = useState('すべて')

  // タグで絞り込み（「すべて」のときは全件返す）
  const filtered = PHOTOS.filter((p) => activeTag === 'すべて' || p.tag === activeTag)

  return (
    <>
      {/* ページヘッダー */}
      <section className="border-b border-border px-8 pt-12 pb-10">
        <div className="max-w-[1100px] mx-auto flex items-end justify-between">
          <div>
            <h1 className="font-serif-en text-[40px] font-normal mb-2">gallery</h1>
            <p className="text-[13px] text-muted leading-[2]">フィルムで切り取った、日常のかけら。</p>
          </div>
          {/* 絞り込み後の件数 */}
          <p className="text-[12px] text-muted">{filtered.length}点</p>
        </div>
      </section>

      {/* タグフィルター */}
      <section className="border-b border-border px-8 py-[18px]">
        <div className="max-w-[1100px] mx-auto flex gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-[12px] px-4 py-[6px] border transition-colors duration-200 ${
                activeTag === tag
                  ? 'border-t-text text-t-text'
                  : 'border-border text-muted2 hover:border-t-text hover:text-t-text'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* マソンリーレイアウト（段組み）
          columns-3 で3カラムに分割し、各写真の高さが違っても自然に詰められる
          break-inside-avoid で写真が列をまたいで分断されるのを防ぐ */}
      <section className="max-w-[1100px] mx-auto px-8 pt-10 pb-20">
        <div className="columns-3 gap-3">
          {filtered.map((photo) => (
            <Link
              key={photo.id}
              href={`/gallery/${photo.id}`}
              className="group relative block break-inside-avoid mb-3 border border-border overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.location}
                className="film w-full block transition-transform duration-[1800ms] ease-in-out group-hover:scale-[1.04]"
              />
              {/* ホバー時に下からフェードインするオーバーレイ（撮影情報を表示） */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(to top, rgba(20,16,12,0.65) 0%, transparent 50%)' }}
              >
                <p className="text-[11px] text-white/70 mb-1">{photo.location}</p>
                <p className="text-[13px] text-white">{photo.camera}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* TODO: 「もっと見る」はページネーションまたは無限スクロールに差し替え予定 */}
        <div className="text-center mt-12">
          <button className="border border-border px-12 py-[14px] text-[12px] tracking-[0.1em] bg-transparent text-t-text transition-all duration-300 hover:bg-t-text hover:text-bg">
            もっと見る
          </button>
        </div>
      </section>
    </>
  )
}
