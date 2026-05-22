'use client'

// Client Component：タグフィルター + マソンリーグリッド
// タグボタンのクリックで useState が更新されるため Client Component にしている

import { useState } from 'react'
import Link from 'next/link'
import type { Photo } from '@/types'

type Props = {
  photos: Photo[]
  tags: string[]  // Supabase から取得した写真を元に動的生成したタグ一覧
}

export function GalleryClient({ photos, tags }: Props) {
  const [activeTag, setActiveTag] = useState('すべて')

  const filtered = photos.filter((p) => activeTag === 'すべて' || p.tag === activeTag)

  return (
    <>
      {/* ページヘッダー */}
      <section className="border-b border-border px-4 sm:px-8 pt-12 pb-10">
        <div className="max-w-[1100px] mx-auto flex items-end justify-between">
          <div>
            <h1 className="font-serif-en text-[40px] font-normal mb-2">gallery</h1>
            <p className="text-[13px] text-muted leading-[2]">フィルムで切り取った、日常のかけら。</p>
          </div>
          <p className="text-[12px] text-muted">{filtered.length}点</p>
        </div>
      </section>

      {/* タグフィルター */}
      <section className="border-b border-border px-4 sm:px-8 py-[18px]">
        <div className="max-w-[1100px] mx-auto flex gap-2 flex-wrap">
          {['すべて', ...tags].map((tag) => (
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

      {/* マソンリーレイアウト */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-10 pb-20">
        {filtered.length === 0 ? (
          <p className="text-center text-[13px] text-muted py-20">写真はまだありません</p>
        ) : (
          <div className="columns-2 sm:columns-3 gap-3">
            {filtered.map((photo) => (
              <Link
                key={photo.id}
                href={`/gallery/${photo.id}`}
                className="group relative block break-inside-avoid mb-3 border border-border overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image_url}
                  alt={photo.location ?? photo.title}
                  className="film w-full block transition-transform duration-[1800ms] ease-in-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] flex flex-col justify-end p-5"
                  style={{ background: 'linear-gradient(to top, rgba(20,16,12,0.65) 0%, transparent 50%)' }}
                >
                  {photo.location && <p className="text-[11px] text-white/70 mb-1">{photo.location}</p>}
                  {photo.camera && <p className="text-[13px] text-white">{photo.camera}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
