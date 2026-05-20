'use client'

// Client Component：カテゴリフィルターと並び替えを useState で管理する
// 商品データは page.tsx（Server Component）から props で受け取る

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'

// Supabase の英語カテゴリキー → 日本語表示に変換するマップ
const CATEGORY_LABEL: Record<string, string> = {
  print: 'フォトプリント',
  postcard: 'ポストカード',
  goods: 'グッズ',
  apparel: 'アパレル',
}

// フィルターボタンの一覧（key: フィルター処理用、label: 画面表示用）
const CATEGORIES = [
  { key: 'all', label: 'すべて' },
  { key: 'print', label: 'フォトプリント' },
  { key: 'postcard', label: 'ポストカード' },
  { key: 'goods', label: 'グッズ' },
  { key: 'apparel', label: 'アパレル' },
]

export default function ShopClient({ products }: { products: Product[] }) {
  // 選択中のカテゴリ（'all' はすべて表示）
  const [activeCategory, setActiveCategory] = useState('all')
  // 選択中の並び替え
  const [sort, setSort] = useState('新着順')

  // カテゴリで絞り込み → 並び替えの順で処理する
  const filtered = products
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === '価格が安い順') return a.price - b.price  // 昇順
      if (sort === '価格が高い順') return b.price - a.price  // 降順
      return 0  // 「新着順」は取得時の並び順をそのまま使う
    })

  return (
    <>
      <section className="border-b border-border px-8 pt-12 pb-10">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[11px] text-muted tracking-[0.1em] mb-[10px]">
            <Link href="/" className="hover:opacity-60 transition-opacity">home</Link>
            {' '}&nbsp;/{' '}&nbsp;shop
          </p>
          <h1 className="font-serif-en text-[40px] font-normal">shop</h1>
        </div>
      </section>

      <section className="border-b border-border px-8 py-5">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`text-[12px] px-4 py-[6px] border transition-colors duration-200 ${
                  activeCategory === cat.key
                    ? 'border-t-text text-t-text'
                    : 'border-border text-muted2 hover:border-t-text hover:text-t-text'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted">並び替え：</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-[12px] border border-border bg-transparent px-3 py-[6px] text-t-text outline-none font-sans"
            >
              <option>新着順</option>
              <option>価格が安い順</option>
              <option>価格が高い順</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-8 pt-12 pb-20">
        <p className="text-[12px] text-muted mb-8">{filtered.length}件</p>
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group border border-border overflow-hidden block transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              <div className="overflow-hidden h-[280px] bg-[#ede9e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="film w-full h-full object-cover transition-transform duration-[1400ms] ease-in-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-5 py-[18px]">
                <p className="text-[11px] text-muted mb-[5px]">{CATEGORY_LABEL[product.category]}</p>
                <h4 className="text-[14px] font-normal mb-1">{product.name}</h4>
                <p className="text-[11px] text-muted mb-[10px]">{product.description}</p>
                <p className="text-[13px]">¥{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-14">
          <button className="border border-border px-12 py-[14px] text-[12px] tracking-[0.1em] bg-transparent text-t-text transition-all duration-300 hover:bg-t-text hover:text-bg">
            もっと見る
          </button>
        </div>
      </section>
    </>
  )
}
