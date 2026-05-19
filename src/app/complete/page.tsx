'use client'

// 注文完了ページ（/complete）
// Stripe の決済完了後にリダイレクトされる
// URL に ?session_id=... が付いてくる（将来 Webhook と照合するために使う）

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

// useSearchParams は Suspense で囲む必要があるため中身を別コンポーネントに分離
function CompleteContent() {
  const searchParams = useSearchParams()
  // Stripe から渡されるセッションID（将来の注文照合・Webhook処理に使う）
  const sessionId = searchParams.get('session_id')

  const { clearCart } = useCart()

  // ページ表示時にカートを空にする
  // ※ 依存配列を空にすることで初回レンダリング時に1回だけ実行される
  useEffect(() => {
    clearCart()
  }, [])

  // session_id の末尾8文字を注文番号として表示（視覚的なわかりやすさのため）
  const orderNumber = sessionId ? sessionId.slice(-8).toUpperCase() : '--------'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* シンプルヘッダー（ロゴのみ） */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" className="font-serif-en" style={{ fontSize: 22, letterSpacing: '0.04em' }}>
            tidagrain.
          </Link>
        </div>
      </header>

      {/* 完了メッセージ */}
      <section style={{ maxWidth: 640, margin: '0 auto', padding: '96px 32px', textAlign: 'center', flex: 1 }}>

        {/* チェックアイコン（フェードアップアニメーション） */}
        <div style={{
          width: 56, height: 56,
          border: '1px solid var(--accent)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          animation: 'fadeUp 0.9s ease-out forwards',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{
          fontSize: 11, letterSpacing: '0.2em', color: 'var(--muted)',
          textTransform: 'uppercase', marginBottom: 20,
          animation: 'fadeUp 0.9s ease-out forwards',
        }}>
          order confirmed
        </p>

        <h1 className="font-serif-en" style={{
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.3, marginBottom: 24,
          animation: 'fadeUp 0.9s ease-out 0.2s both',
        }}>
          ご注文ありがとう<br />ございます。
        </h1>

        <p className="font-serif-jp" style={{
          fontSize: 13, lineHeight: 3, color: 'var(--muted2)', marginBottom: 48,
          animation: 'fadeUp 0.9s ease-out 0.4s both',
        }}>
          ご注文を承りました。<br />
          商品は受注生産のため、2〜3週間でお届けします。<br />
          光の粒が、あなたのもとへ届きますように。
        </p>

        {/* 注文情報ボックス */}
        <div style={{
          border: '1px solid var(--border)', padding: 24, marginBottom: 48, textAlign: 'left',
          animation: 'fadeUp 0.9s ease-out 0.4s both',
        }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16, letterSpacing: '0.08em' }}>注文内容</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--muted2)' }}>注文番号</span>
              {/* session_id の末尾を注文番号として表示 */}
              <span style={{ fontWeight: 400, letterSpacing: '0.06em' }}>#{orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--muted2)' }}>注文日</span>
              <span>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--muted2)' }}>お支払い</span>
              <span>クレジットカード（Stripe）</span>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          animation: 'fadeUp 0.9s ease-out 0.4s both',
        }}>
          <Link
            href="/shop"
            style={{
              display: 'block', padding: 15,
              background: 'var(--text)', color: 'var(--bg)',
              fontSize: 12, letterSpacing: '0.1em', textAlign: 'center',
            }}
          >
            ショッピングを続ける
          </Link>
          <Link
            href="/gallery"
            style={{
              display: 'block', padding: 15,
              border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 12, letterSpacing: '0.1em', textAlign: 'center',
            }}
          >
            ギャラリーを見る
          </Link>
        </div>

      </section>

      {/* フッター */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--muted2)' }}>© 2026 tidagrain. All rights reserved.</p>
      </footer>

      {/* フェードアップアニメーションの CSS */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  )
}

// Suspense で囲むことで useSearchParams のビルドエラーを回避
export default function CompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  )
}
