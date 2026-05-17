'use client'

// カートページ（/cart）
// useCart() でグローバルなカート状態を取得して表示・操作する

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

// 送料の計算ロジック（小計が10,000円以上なら無料）
// const calcShipping = (subtotal: number) => subtotal >= 10000 ? 0 : 600
const calcShipping = (subtotal: number) => subtotal >= 10000 ? 0 : subtotal >= 5000 ? 400 : 800

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCount, subtotal } = useCart()

  const shipping = calcShipping(subtotal)
  const tax = Math.floor(subtotal * 0.1)       // 消費税10%（小数点以下切り捨て）
  const total = subtotal + shipping + tax

  // カートが空のとき
  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 16 }}>cart</p>
        <p style={{ fontSize: 13, color: '#8B7B6A', marginBottom: 40 }}>カートに商品がありません</p>
        <Link
          href="/shop"
          style={{ fontSize: 12, color: '#8B7B6A', borderBottom: '1px solid #8B7B6A', paddingBottom: 2 }}
        >
          ショップへ戻る
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* ページヘッダー */}
      <section style={{ borderBottom: '1px solid #E5E1DC', padding: '48px 32px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 400 }}>cart</h1>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64, alignItems: 'start' }}>

          {/* 左：カートアイテム一覧 */}
          <div>
            <p style={{ fontSize: 12, color: '#8B7B6A', marginBottom: 24 }}>{totalCount}点</p>

            {items.map(item => {
              // バリアントに price_override があればそちら、なければ商品の基本価格
              const price = item.variant?.price_override ?? item.product.price
              // アイテムを一意に識別するキー（バリアントありなしに対応）
              const key = `${item.product.id}-${item.variant?.id ?? 'no-variant'}`

              return (
                <div
                  key={key}
                  style={{ borderTop: '1px solid #E5E1DC', padding: '28px 0', display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, alignItems: 'start' }}
                >
                  {/* 商品画像 */}
                  <div style={{ border: '1px solid #E5E1DC', overflow: 'hidden', height: 100, position: 'relative' }}>
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover', filter: 'sepia(18%) saturate(82%) contrast(96%) brightness(98%)' }}
                    />
                  </div>

                  {/* 商品情報 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 11, color: '#8B7B6A', marginBottom: 4 }}>{item.product.category}</p>
                        <h3 style={{ fontSize: 15, fontWeight: 400, marginBottom: 4 }}>{item.product.name}</h3>
                        {/* バリアント情報（サイズ・フレームなど）があれば表示 */}
                        {item.variant && (
                          <p style={{ fontSize: 12, color: '#6B6157' }}>
                            {[item.variant.size, item.variant.frame].filter(Boolean).join(' / ')}
                          </p>
                        )}
                      </div>
                      <p style={{ fontSize: 15, whiteSpace: 'nowrap' }}>¥{(price * item.quantity).toLocaleString()}</p>
                    </div>

                    {/* 数量変更 & 削除 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                      {/* 数量ボタン */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity - 1)}
                          style={{ width: 32, height: 32, border: '1px solid #E5E1DC', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
                        >
                          −
                        </button>
                        <span style={{ width: 40, textAlign: 'center', fontSize: 13, borderTop: '1px solid #E5E1DC', borderBottom: '1px solid #E5E1DC', height: 32, lineHeight: '32px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity + 1)}
                          style={{ width: 32, height: 32, border: '1px solid #E5E1DC', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
                        >
                          ＋
                        </button>
                      </div>

                      {/* 削除ボタン（0にすると updateQuantity の中で removeItem が呼ばれる） */}
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id ?? null)}
                        style={{ fontSize: 11, color: '#8B7B6A', cursor: 'pointer', border: 'none', background: 'none' }}
                      >
                        削除する
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* ショッピングを続けるリンク */}
            <div style={{ borderTop: '1px solid #E5E1DC', paddingTop: 24 }}>
              <Link href="/shop" style={{ fontSize: 12, color: '#8B7B6A', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                ショッピングを続ける
              </Link>
            </div>
          </div>

          {/* 右：注文サマリー（スクロールしてもついてくる） */}
          <div style={{ border: '1px solid #E5E1DC', padding: 32, position: 'sticky', top: 80 }}>
            <h2 style={{ fontSize: 15, fontWeight: 400, marginBottom: 28, letterSpacing: '0.04em' }}>注文内容</h2>

            {/* 金額内訳 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B6157' }}>小計（{totalCount}点）</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B6157' }}>送料</span>
                {/* 10,000円以上なら送料無料と表示 */}
                <span>{shipping === 0 ? '無料' : `¥${shipping.toLocaleString()}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B6157' }}>消費税（10%）</span>
                <span>¥{tax.toLocaleString()}</span>
              </div>
            </div>

            {/* 合計 */}
            <div style={{ borderTop: '1px solid #E5E1DC', paddingTop: 20, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>合計</span>
                <span style={{ fontSize: 20 }}>¥{total.toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 11, color: '#8B7B6A', marginTop: 6, textAlign: 'right' }}>（税込・送料込）</p>
            </div>

            {/* 購入手続きボタン */}
            <Link
              href="/checkout"
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: '#1E1814', color: '#F7F4EF',
                fontSize: 13, letterSpacing: '0.1em',
                textAlign: 'center', textDecoration: 'none',
              }}
            >
              購入手続きへ
            </Link>

            {/* 支払い方法 */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <p style={{ fontSize: 11, color: '#8B7B6A', marginBottom: 10 }}>使えるお支払い方法</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {['VISA', 'Mastercard', 'AMEX', 'PayPay'].map(method => (
                  <span key={method} style={{ border: '1px solid #E5E1DC', padding: '4px 10px', fontSize: 10, color: '#6B6157', letterSpacing: '0.06em' }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
