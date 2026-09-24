'use client'

import { useState, useRef, useCallback } from 'react'
import { bulkAddPhotos, uploadPhotoImage } from './actions'

// 写真はCloudflare R2に保存する（'photos/' プレフィックス、詳細は src/lib/r2.ts 参照）

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

type Preview = { file: File; url: string }

export function BulkUploadForm() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [tag, setTag] = useState('')
  const [location, setLocation] = useState('')
  const [camera, setCamera] = useState('')
  const [film, setFilm] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    setPreviews(prev => [
      ...prev,
      ...imageFiles.map(file => ({ file, url: URL.createObjectURL(file) })),
    ])
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files ?? []))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    addFiles(Array.from(e.dataTransfer.files))
  }

  function removeFile(index: number) {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleUpload() {
    if (previews.length === 0) return
    setUploading(true)
    setProgress(0)

    try {
      const photoData: Parameters<typeof bulkAddPhotos>[0] = []

      for (let i = 0; i < previews.length; i++) {
        const { file } = previews[i]

        const fd = new FormData()
        fd.set('file', file)
        const result = await uploadPhotoImage(fd)

        if ('error' in result) {
          throw new Error(result.error)
        }

        photoData.push({
          title: file.name.replace(/\.[^.]+$/, ''),
          image_url: result.url,
          tag: tag || null,
          location: location || null,
          camera: camera || null,
          film: film || null,
        })

        setProgress(Math.round(((i + 1) / previews.length) * 100))
      }

      await bulkAddPhotos(photoData)

      previews.forEach(p => URL.revokeObjectURL(p.url))
      setPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTag(''); setLocation(''); setCamera(''); setFilm('')
      alert(`${photoData.length}枚の写真を登録しました（すべて非公開状態）`)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'アップロードに失敗しました。R2の設定（.env.localの環境変数）を確認してください。'
      alert(message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <section style={{ marginTop: '48px' }}>
      <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
        Bulk Upload / 一括アップロード
      </h2>
      <div style={{ border: '1px solid #E5E1DC', padding: '28px 24px' }}>

        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #E5E1DC', padding: '32px 24px',
            textAlign: 'center', cursor: 'pointer', marginBottom: '24px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <p style={{ fontSize: '13px', color: '#8B7B6A' }}>クリックまたはドラッグ＆ドロップで複数の画像を選択</p>
          <p style={{ fontSize: '11px', color: '#B0A090', marginTop: '4px' }}>JPG・PNG・WEBP 対応</p>
        </div>

        {previews.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', color: '#8B7B6A', marginBottom: '8px' }}>{previews.length}枚選択中</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
              {previews.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.file.name}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); removeFile(i) }}
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
          ※ タイトルはファイル名から自動設定されます。追加後に「編集」ボタンで変更できます。<br />
          ※ 追加直後はすべて非公開状態になります。
        </p>

        {uploading && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ background: '#E5E1DC', height: '4px', borderRadius: '2px' }}>
              <div style={{ background: '#1E1814', height: '4px', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: '11px', color: '#8B7B6A', marginTop: '4px' }}>{progress}%</p>
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            onClick={handleUpload}
            disabled={previews.length === 0 || uploading}
            style={{
              fontSize: '12px', padding: '8px 24px',
              border: '1px solid #1E1814',
              background: previews.length === 0 || uploading ? '#E5E1DC' : '#1E1814',
              color: previews.length === 0 || uploading ? '#8B7B6A' : '#F7F4EF',
              cursor: previews.length === 0 || uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading
              ? `アップロード中… ${progress}%`
              : previews.length > 0
                ? `${previews.length}枚をアップロード`
                : 'アップロード'}
          </button>
        </div>
      </div>
    </section>
  )
}
