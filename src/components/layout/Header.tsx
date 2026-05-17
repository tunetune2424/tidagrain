'use client'

// グローバルヘッダー
// position: sticky + backdrop-filter でスクロールしても上部に残り、背景が半透明になる

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  // カート内の合計個数（0のときはバッジを非表示）
  const { totalCount } = useCart()
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,244,239,0.92)',  // 半透明の背景（下のコンテンツが透けて見える）
        backdropFilter: 'blur(6px)',            // 背景をぼかしてガラス風に
        position: 'sticky',                     // スクロールしても画面上部に固定
        top: 0,
        zIndex: 50,                             // 他のコンテンツより前面に表示
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '18px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ロゴ：クリックでトップページへ */}
        <Link
          href="/"
          className="font-serif-en"
          style={{ fontSize: 22, letterSpacing: '0.04em' }}
        >
          tidagrain.
        </Link>

        <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          <Link href="/shop" className="nav-link">ショップ</Link>
          <Link href="/gallery" className="nav-link">ギャラリー</Link>
          <Link href="/about" className="nav-link">私たちについて</Link>
          {/* カートアイコン：個数が1以上のときだけバッジを表示 */}
          <Link
            href="/cart"
            style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
            カート
            {/* totalCount > 0 のときだけバッジを表示（0のときは何も表示しない） */}
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -12,
                background: 'var(--text)',
                color: 'var(--bg)',
                fontSize: 10,
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
