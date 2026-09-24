'use client'

// Client Component：商品追加フォーム
// 送信完了後に formRef.current?.reset() でフォームをクリアするため Client Component にしている

import { useRef, useState } from 'react'
import Link from 'next/link'
import { addProduct } from './actions'
import { listMediaImages } from './media/actions'
import type { R2Object } from '@/lib/r2'
import { SubmitButton } from './SubmitButton'

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

// 商品画像はCloudflare R2に保存する（'products/' プレフィックス、詳細は src/lib/r2.ts 参照）
// アップロードそのものは「画像ライブラリ」（/admin/media）で行い、
// このフォームではライブラリから選ぶか、URLを直接貼り付ける

export function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mediaImages, setMediaImages] = useState<R2Object[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  async function openPicker() {
    setPickerOpen(true)
    setLoadingMedia(true)
    setMediaError(null)

    try {
      const images = await listMediaImages()
      setMediaImages(images)
    } catch (err) {
      console.error(err)
      setMediaError(err instanceof Error ? err.message : '画像一覧の取得に失敗しました。')
    } finally {
      setLoadingMedia(false)
    }
  }

  function selectImage(url: string) {
    setImageUrl(url)
    setPickerOpen(false)
  }

  // Server Action を呼び出し、完了後にフォームをクリアする
  async function handleSubmit(formData: FormData) {
    // 選んだ画像URL（またはユーザーが直接入力したURL）をセットして送信
    formData.set('image_url', imageUrl)
    await addProduct(formData)
    formRef.current?.reset()
    setImageUrl('')
  }

  return (
    <div style={{ borderTop: '1px solid #E5E1DC', padding: '24px 20px', position: 'relative' }}>
      <p style={{ fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
        新規商品を追加
      </p>
      <form ref={formRef} action={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        <input name="name" placeholder="商品名" required style={inputStyle} />
        <select name="category" required style={inputStyle}>
          <option value="">カテゴリを選択</option>
          <option value="print">フォトプリント</option>
          <option value="postcard">ポストカード</option>
          <option value="goods">グッズ</option>
          <option value="apparel">アパレル</option>
        </select>
        <input name="price" type="number" min="0" placeholder="価格（円）" required style={inputStyle} />

        <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '8px' }}>
          <p style={{ fontSize: '11px', color: '#8B7B6A' }}>商品画像（画像ライブラリから選択、またはURLを直接入力）</p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={openPicker}
              style={{
                fontSize: '12px', padding: '8px 16px',
                border: '1px solid #1E1814', background: 'transparent', color: '#1E1814', cursor: 'pointer',
              }}
            >
              画像ライブラリから選択
            </button>
            <Link href="/admin/media" style={{ fontSize: '11px', color: '#8B7B6A' }}>
              画像ライブラリを開く（新規アップロードはこちら）
            </Link>
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="プレビュー"
                style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid #E5E1DC', background: '#EEEBE5' }}
              />
            )}
          </div>
          <input
            name="image_url"
            placeholder="画像URL（ライブラリから選ぶと自動入力されます。直接貼り付けも可）"
            required
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={inputStyle}
          />
        </div>

        <textarea name="description" placeholder="商品説明（任意）" rows={2} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical' }} />
        <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
          <SubmitButton style={{
            fontSize: '12px', padding: '8px 24px',
            border: '1px solid #1E1814', background: '#1E1814', color: '#F7F4EF',
          }}>
            追加する
          </SubmitButton>
        </div>
      </form>

      {/* 画像ライブラリピッカー（モーダル） */}
      {pickerOpen && (
        <div
          onClick={() => setPickerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#F7F4EF', border: '1px solid #E5E1DC',
              maxWidth: '720px', width: '100%', maxHeight: '80vh',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E5E1DC' }}>
              <p style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
                画像ライブラリから選択
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#8B7B6A', cursor: 'pointer' }}
              >×</button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto' }}>
              {loadingMedia ? (
                <p style={{ fontSize: '12px', color: '#8B7B6A', textAlign: 'center', padding: '24px' }}>読み込み中…</p>
              ) : mediaError ? (
                <p style={{ fontSize: '12px', color: '#B4453C', textAlign: 'center', padding: '24px' }}>{mediaError}</p>
              ) : mediaImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#8B7B6A', marginBottom: '12px' }}>
                    画像ライブラリに画像がありません
                  </p>
                  <Link href="/admin/media" style={{ fontSize: '12px', color: '#1E1814', textDecoration: 'underline' }}>
                    画像ライブラリでアップロードする
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                  {mediaImages.map((img) => (
                    <button
                      type="button"
                      key={img.key}
                      onClick={() => selectImage(img.url)}
                      style={{
                        border: img.url === imageUrl ? '2px solid #1E1814' : '1px solid #E5E1DC',
                        background: '#EEEBE5', padding: 0, cursor: 'pointer',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.key}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
