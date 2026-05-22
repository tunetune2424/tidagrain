// アプリ全体のルートレイアウト
// CartProvider だけを持ち、Header・Footer は (main)/layout.tsx に移した
// → checkout/ など Header・Footer が不要なページはこのままで済む

import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: {
    default: 'tidagrain. — 光の粒を、持ち歩く。',
    template: '%s | tidagrain.',
  },
  description: 'フィルムカメラで撮った自然・日常の写真を軸にしたライフスタイルブランド。写真プリント・ポストカード・グッズをお届けします。',
  openGraph: {
    siteName: 'tidagrain.',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      {/* flex column で Footer を画面下部に固定する */}
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* CartProvider を最上位に置くことで全ページから useCart() が使える */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
