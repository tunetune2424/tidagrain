export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { listMediaImages } from './actions'
import { MediaUploadForm } from './MediaUploadForm'

export default async function AdminMediaPage() {
  let images: Awaited<ReturnType<typeof listMediaImages>> = []
  let loadError: string | null = null

  try {
    images = await listMediaImages()
  } catch (err) {
    loadError = err instanceof Error ? err.message : '画像一覧の取得に失敗しました。'
  }

  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>

      {/* ヘッダー */}
      <header style={{ borderBottom: '1px solid #E5E1DC', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '0.04em' }}>tidagrain.</p>
          <p style={{ fontSize: '10px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin / media library</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>← 管理画面に戻る</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px, 6vw, 48px) clamp(16px, 4vw, 32px)' }}>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0, marginBottom: '8px' }}>
            Media Library / 画像ライブラリ
          </h2>
          <p style={{ fontSize: '12px', color: '#8B7B6A' }}>
            ここでアップロードした画像は、商品追加フォームの「画像ライブラリから選択」で使えます。
          </p>
        </div>

        <MediaUploadForm />

        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
              Uploaded / アップロード済み
            </h2>
            <span style={{ fontSize: '11px', color: '#8B7B6A' }}>{images.length}件</span>
          </div>

          <div style={{ border: '1px solid #E5E1DC', padding: '20px' }}>
            {loadError ? (
              <p style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: '#B4453C' }}>
                {loadError}
              </p>
            ) : images.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                アップロード済みの画像がありません
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                {images.map((img) => (
                  <div key={img.key} style={{ border: '1px solid #E5E1DC', background: '#EEEBE5' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.key}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
