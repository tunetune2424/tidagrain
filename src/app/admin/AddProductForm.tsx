'use client'

// Client Component：商品追加フォーム
// 送信完了後に formRef.current?.reset() でフォームをクリアするため Client Component にしている

import { useRef, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { addProduct } from './actions'
import { SubmitButton } from './SubmitButton'

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

// 商品画像用のバケット名。
// Supabase Storage に未作成の場合は事前にバケットを作成しておく必要がある：
//   1. Supabase ダッシュボード → Storage → New bucket → 名前「products」で作成（Public bucket を有効化）
//   2. または SQL: select storage.create_bucket('products', public => true);
const STORAGE_BUCKET = 'products'

export function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: false })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path)

      setImageUrl(publicUrl)
      setPreviewUrl(publicUrl)
    } catch (err) {
      console.error(err)
      setUploadError('アップロードに失敗しました。Storageのバケット・ポリシー設定を確認してください。')
    } finally {
      setUploading(false)
    }
  }

  // Server Action を呼び出し、完了後にフォームをクリアする
  async function handleSubmit(formData: FormData) {
    // アップロードした画像URL（またはユーザーが直接入力したURL）をセットして送信
    formData.set('image_url', imageUrl)
    await addProduct(formData)
    formRef.current?.reset()
    if (fileInputRef.current) fileInputRef.current.value = ''
    setImageUrl('')
    setPreviewUrl(null)
    setUploadError(null)
  }

  return (
    <div style={{ borderTop: '1px solid #E5E1DC', padding: '24px 20px' }}>
      <p style={{ fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
        新規商品を追加
      </p>
      <form ref={formRef} action={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="name" placeholder="商品名" required style={inputStyle} />
        <select name="category" required style={inputStyle}>
          <option value="">カテゴリを選択</option>
          <option value="print">フォトプリント</option>
          <option value="postcard">ポストカード</option>
          <option value="goods">グッズ</option>
          <option value="apparel">アパレル</option>
        </select>
        <input name="price" type="number" placeholder="価格（円）" required style={inputStyle} />

        <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '8px' }}>
          <p style={{ fontSize: '11px', color: '#8B7B6A' }}>商品画像（アップロード、またはURLを直接入力）</p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ fontSize: '12px' }}
            />
            {uploading && <span style={{ fontSize: '11px', color: '#8B7B6A' }}>アップロード中…</span>}
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="プレビュー"
                style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid #E5E1DC' }}
              />
            )}
          </div>
          {uploadError && <p style={{ fontSize: '11px', color: '#B4453C' }}>{uploadError}</p>}
          <input
            name="image_url"
            placeholder="画像URL（アップロードすると自動入力されます。直接貼り付けも可）"
            required
            value={imageUrl}
            onChange={e => { setImageUrl(e.target.value); setPreviewUrl(e.target.value || null) }}
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
    </div>
  )
}
