'use client'

// Client Component：商品追加フォーム
// 送信完了後に formRef.current?.reset() でフォームをクリアするため Client Component にしている

import { useRef } from 'react'
import { addProduct } from './actions'
import { SubmitButton } from './SubmitButton'

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export function AddProductForm() {
  const formRef = useRef<HTMLFormElement>(null)

  // Server Action を呼び出し、完了後にフォームをクリアする
  async function handleSubmit(formData: FormData) {
    await addProduct(formData)
    formRef.current?.reset()
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
        <input name="image_url" placeholder="画像URL" required style={inputStyle} />
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
