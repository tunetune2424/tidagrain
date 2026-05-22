'use client'

import { useRef } from 'react'
import { addPhoto } from './actions'
import { SubmitButton } from '../SubmitButton'

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export function AddPhotoForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await addPhoto(formData)
    formRef.current?.reset()
  }

  return (
    <section style={{ marginTop: '64px' }}>
      <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
        Photos / 写真追加
      </h2>
      <div style={{ border: '1px solid #E5E1DC', padding: '28px 24px' }}>
        <form ref={formRef} action={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input name="title" placeholder="タイトル（必須）" required style={inputStyle} />
          <input name="image_url" placeholder="画像URL（必須）" required style={inputStyle} />
          <select name="tag" style={inputStyle}>
            <option value="">タグなし</option>
            <option value="沖縄">沖縄</option>
            <option value="日常">日常</option>
            <option value="旅">旅</option>
            <option value="自然">自然</option>
          </select>
          <input name="shot_date" type="date" placeholder="撮影日" style={inputStyle} />
          <input name="location" placeholder="場所" style={inputStyle} />
          <input name="camera" placeholder="カメラ" style={inputStyle} />
          <input name="film" placeholder="フィルム" style={inputStyle} />
          <textarea name="memo" placeholder="メモ（任意）" rows={2} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical' }} />
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
    </section>
  )
}
