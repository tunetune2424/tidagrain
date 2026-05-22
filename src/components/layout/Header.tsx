'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export default function Header() {
  const { totalCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,244,239,0.92)',
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ロゴ */}
        <Link href="/" className="font-serif-en" style={{ fontSize: 22, letterSpacing: '0.04em' }}>
          tidagrain.
        </Link>

        {/* デスクトップ用ナビ */}
        <nav className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
          <Link href="/shop" className="nav-link">ショップ</Link>
          <Link href="/gallery" className="nav-link">ギャラリー</Link>
          <Link href="/about" className="nav-link">私たちについて</Link>
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <ShoppingBag size={15} strokeWidth={1.5} />
            カート
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -12,
                background: 'var(--text)', color: 'var(--bg)',
                fontSize: 10, width: 18, height: 18,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalCount}
              </span>
            )}
          </Link>
        </nav>

        {/* モバイル用：カートアイコン + ハンバーガー */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: 'var(--text)', color: 'var(--bg)',
                fontSize: 9, width: 16, height: 16,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {menuOpen && (
        <nav
          className="md:hidden"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(247,244,239,0.98)',
            padding: '12px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {[
            { href: '/shop', label: 'ショップ' },
            { href: '/gallery', label: 'ギャラリー' },
            { href: '/about', label: '私たちについて' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '14px 0',
                fontSize: 13,
                borderBottom: '1px solid var(--border)',
                color: 'var(--text)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
