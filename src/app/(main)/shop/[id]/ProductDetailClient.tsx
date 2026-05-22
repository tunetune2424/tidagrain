'use client'

// Client Component：画像表示・カート追加など、ブラウザで動く処理を担当
// 商品データは page.tsx（Server Component）から props で受け取る

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'

// Supabase の英語カテゴリキー → 日本語表示に変換するマップ
const CATEGORY_LABEL: Record<string, string> = {
  print: 'フォトプリント',
  postcard: 'ポストカード',
  goods: 'グッズ',
  apparel: 'アパレル',
}

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const { addItem } = useCart()

  // カートに追加したときの一時的なフィードバック（2秒後に自動で元に戻る）
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, null, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      {/* パンくずリスト */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-5">
        <p className="text-[11px] text-muted tracking-[0.08em]">
          <Link href="/" className="hover:opacity-60 transition-opacity">home</Link>
          {' '}&nbsp;/{' '}&nbsp;
          <Link href="/shop" className="hover:opacity-60 transition-opacity">shop</Link>
          {' '}&nbsp;/{' '}&nbsp;
          {product.name}
        </p>
      </div>

      {/* 商品メインエリア：左に画像、右に情報 */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* 左：商品画像 */}
          <div className="border border-border overflow-hidden h-[320px] sm:h-[420px] md:h-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="film w-full h-full object-cover"
            />
          </div>

          {/* 右：商品情報・購入ボタン */}
          <div className="pt-2">
            <p className="text-[11px] text-muted tracking-[0.08em] mb-3">
              {CATEGORY_LABEL[product.category] ?? product.category}
            </p>
            <h1 className="font-serif-en text-[36px] font-normal leading-[1.3] mb-2">{product.name}</h1>
            <p className="text-[22px] mb-8 tracking-[0.04em]">
              ¥{product.price.toLocaleString()}{' '}
              <span className="text-[12px] text-muted">（税込）</span>
            </p>

            <div className="border-t border-border pt-7 mb-7">
              {/* added が true の間はテキストとスタイルが変わる */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 text-[13px] tracking-[0.1em] font-light transition-all duration-300 mb-3 ${
                  added
                    ? 'bg-transparent border border-t-text text-t-text cursor-default'
                    : 'bg-t-text text-bg hover:opacity-75'
                }`}
              >
                {added ? '✓ カートに追加しました' : 'カートに入れる'}
              </button>
              <button className="w-full py-4 bg-transparent text-t-text text-[13px] tracking-[0.1em] font-light border border-border transition-colors duration-300 hover:border-t-text">
                ♡ &nbsp;お気に入りに追加
              </button>
            </div>

            {/* 商品説明（Supabase の description カラム） */}
            {product.description && (
              <div className="border-t border-border pt-7">
                {/* whitespace-pre-line で \n を改行として表示 */}
                <p className="font-serif-jp text-[13px] leading-[2.8] text-muted2 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 関連商品 */}
      {related.length > 0 && (
        <section className="border-t border-border px-4 sm:px-8 py-16">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[15px] font-normal mb-8">関連商品</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/shop/${r.id}`}
                  className="group border border-border overflow-hidden block"
                >
                  <div className="h-[220px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="film w-full h-full object-cover transition-transform duration-[1400ms] ease-in-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="px-[18px] py-4">
                    <p className="text-[11px] text-muted mb-1">{CATEGORY_LABEL[r.category] ?? r.category}</p>
                    <p className="text-[14px] font-normal mb-2">{r.name}</p>
                    <p className="text-[13px]">¥{r.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
