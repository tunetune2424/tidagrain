import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 32px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <span
          className="font-serif-en"
          style={{ fontSize: 18, letterSpacing: '0.04em' }}
        >
          tidagrain.
        </span>

        <nav style={{ display: 'flex', gap: 28 }}>
          <Link href="/shop" className="footer-link">ショップ</Link>
          <Link href="/gallery" className="footer-link">ギャラリー</Link>
          <Link href="/about" className="footer-link">私たちについて</Link>
          <Link href="/cart" className="footer-link">カート</Link>
        </nav>

        <p style={{ fontSize: 11, color: 'var(--muted2)', letterSpacing: '0.1em' }}>
          © 2026 tidagrain. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
