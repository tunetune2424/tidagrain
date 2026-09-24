'use client'

import { useState } from 'react'
import Link from 'next/link'
import { bulkAddPhotos } from './actions'
import { listMediaImages } from '../media/actions'
import type { R2Object } from '@/lib/r2'

// 写真の登録は「画像ライブラリ」（/admin/media）からまとめて選ぶ方式にしている。
// アップロード自体はライブラリ側に一本化し、ここでは複数選択と共通メタデータの入力のみを行う。

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export function BulkUploadForm() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mediaImages, setMediaImages] = useState<R2Object[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [selected, setSelected] = useState<R2Object[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [location, setLocation] = useState('')
  const [camera, setCamera] = useState('')
  const [film, setFilm] = useState('')

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

  function toggleSelect(img: R2Object) {
    setSelected(prev =>
      prev.some(s => s.key === img.key)
        ? prev.filter(s => s.key !== img.key)
        : [...prev, img]
    )
  }

  function removeSelected(key: string) {
    setSelected(prev => prev.filter(s => s.key !== key))
  }

  async function handleSubmit() {
    if (selected.length === 0) return
    setSubmitting(true)

    try {
      const photoData: Parameters<typeof bulkAddPhotos>[0] = selected.map((img, i) => ({
        title: title
          ? (selected.length > 1 ? `${title} ${i + 1}` : title)
          : '無題',
        image_url: img.url,
        tag: tag || null,
        location: location || null,
        camera: camera || null,
        film: film || null,
      }))

      await bulkAddPhotos(photoData)

      setSelected([])
      setTitle(''); setTag(''); setLocation(''); setCamera(''); setFilm('')
      alert(`${photoData.length}枚の写真を登録しました（すべて非公開状態）`)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : '登録に失敗しました。'
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
        Add Photos / 画像ライブラリから写真を追加
      </h2>
      <div style={{ border: '1px solid #E5E1DC', padding: '28px 24px', position: 'relative' }}>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={openPicker}
            style={{
              fontSize: '12px', padding: '8px 16px',
              border: '1px solid #1E1814', background: 'transparent', color: '#1E1814', cursor: 'pointer',
            }}
          >
            画像ライブラリから選択（複数可）
          </button>
          <Link href="/admin/media" style={{ fontSize: '11px', color: '#8B7B6A' }}>
            画像ライブラリを開く（新規アップロードはこちら）
          </Link>
        </div>

        {selected.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', color: '#8B7B6A', marginBottom: '8px' }}>{selected.length}枚選択中</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
              {selected.map(img => (
                <div key={img.key} style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.key}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block', background: '#EEEBE5' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSelected(img.key)}
                    style={{
                      position: 'absolute', top: '3px', right: '3px',
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      border: 'none', width: '18px', height: '18px',
                      borderRadius: '50%', cursor: 'pointer',
                      fontSize: '11px', lineHeight: '18px', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル（共通・任意。複数選択時は連番付与）" style={inputStyle} />
          <select value={tag} onChange={e => setTag(e.target.value)} style={inputStyle}>
            <option value="">タグなし（全写真共通）</option>
            <option value="沖縄">沖縄</option>
            <option value="日常">日常</option>
            <option value="旅">旅</option>
            <option value="自然">自然</option>
          </select>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="場所（全写真共通・任意）" style={inputStyle} />
          <input value={camera} onChange={e => setCamera(e.target.value)} placeholder="カメラ（全写真共通・任意）" style={inputStyle} />
          <input value={film} onChange={e => setFilm(e.target.value)} placeholder="フィルム（全写真共通・任意）" style={inputStyle} />
        </div>

        <p style={{ fontSize: '11px', color: '#8B7B6A', marginBottom: '16px' }}>
          ※ タイトル未入力の場合は「無題」で登録されます。追加後に「編集」ボタンで変更できます。<br />
          ※ 追加直後はすべて非公開状態になります。
        </p>

        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.length === 0 || submitting}
            style={{
              fontSize: '12px', padding: '8px 24px',
              border: '1px solid #1E1814',
              background: selected.length === 0 || submitting ? '#E5E1DC' : '#1E1814',
              color: selected.length === 0 || submitting ? '#8B7B6A' : '#F7F4EF',
              cursor: selected.length === 0 || submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting
              ? '登録中…'
              : selected.length > 0
                ? `${selected.length}枚を登録`
                : '登録'}
          </button>
        </div>
      </div>

      {/* 画像ライブラリピッカー（モーダル・複数選択） */}
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
                画像ライブラリから選択（複数可）
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
                  {mediaImages.map((img) => {
                    const isSelected = selected.some(s => s.key === img.key)
                    return (
                      <button
                        type="button"
                        key={img.key}
                        onClick={() => toggleSelect(img)}
                        style={{
                          border: isSelected ? '2px solid #1E1814' : '1px solid #E5E1DC',
                          background: '#EEEBE5', padding: 0, cursor: 'pointer', position: 'relative',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.key}
                          style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', display: 'block' }}
                        />
                        {isSelected && (
                          <span style={{
                            position: 'absolute', top: '3px', right: '3px',
                            background: '#1E1814', color: '#F7F4EF',
                            width: '18px', height: '18px', borderRadius: '50%',
                            fontSize: '11px', lineHeight: '18px', textAlign: 'center',
                          }}>✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E5E1DC', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                style={{
                  fontSize: '12px', padding: '8px 20px',
                  border: '1px solid #1E1814', background: '#1E1814', color: '#F7F4EF', cursor: 'pointer',
                }}
              >
                選択を確定（{selected.length}枚）
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
