'use client'

import { useState } from 'react'
import type { Photo } from '@/types'
import { togglePhotoPublic, deletePhoto, updatePhoto } from './actions'
import { SubmitButton } from '../SubmitButton'

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.08em', fontWeight: 400,
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', color: '#1E1814', verticalAlign: 'middle',
}

const inputStyle: React.CSSProperties = {
  fontSize: '13px', padding: '8px 12px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export function PhotoTable({ photos }: { photos: Photo[] }) {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return (
      <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
        写真データがありません
      </p>
    )
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <th style={thStyle}>サムネ</th>
            <th style={thStyle}>タイトル</th>
            <th style={thStyle}>タグ</th>
            <th style={thStyle}>場所</th>
            <th style={thStyle}>公開状態</th>
            <th style={thStyle}>操作</th>
          </tr>
        </thead>
        <tbody>
          {photos.map((photo) => (
            <tr key={photo.id} style={{ borderBottom: '1px solid #E5E1DC' }}>
              <td style={{ ...tdStyle, width: '64px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  style={{ width: '56px', height: '40px', objectFit: 'cover', display: 'block' }}
                />
              </td>
              <td style={tdStyle}>{photo.title}</td>
              <td style={tdStyle}>{photo.tag ?? '—'}</td>
              <td style={tdStyle}>{photo.location ?? '—'}</td>

              <td style={tdStyle}>
                <form action={togglePhotoPublic}>
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="isPublic" value={String(photo.is_public)} />
                  <SubmitButton style={{
                    fontSize: '11px', padding: '4px 12px',
                    border: '1px solid',
                    borderColor: photo.is_public ? '#1E1814' : '#E5E1DC',
                    background: photo.is_public ? '#1E1814' : 'transparent',
                    color: photo.is_public ? '#F7F4EF' : '#8B7B6A',
                  }}>
                    {photo.is_public ? '公開中' : '非公開'}
                  </SubmitButton>
                </form>
              </td>

              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(photo)}
                    style={{
                      fontSize: '11px', padding: '4px 12px',
                      border: '1px solid #E5E1DC', background: 'transparent', color: '#1E1814',
                      cursor: 'pointer',
                    }}
                  >
                    編集
                  </button>
                  <form action={deletePhoto}>
                    <input type="hidden" name="id" value={photo.id} />
                    <SubmitButton
                      confirmMessage={`「${photo.title}」を削除します。この操作は取り消せません。よろしいですか？`}
                      style={{
                        fontSize: '11px', padding: '4px 12px',
                        border: '1px solid #E5E1DC', background: 'transparent', color: '#c0392b',
                      }}
                    >
                      削除
                    </SubmitButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {editingPhoto && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setEditingPhoto(null)}
        >
          <div
            style={{
              background: '#F7F4EF', padding: '32px', width: '100%', maxWidth: '560px',
              margin: '0 16px', maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
                Edit Photo / 写真を編集
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8B7B6A', lineHeight: 1 }}
              >×</button>
            </div>

            <form
              action={async (formData) => {
                await updatePhoto(formData)
                setEditingPhoto(null)
              }}
              style={{ display: 'grid', gap: '12px' }}
            >
              <input type="hidden" name="id" value={editingPhoto.id} />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={editingPhoto.image_url}
                alt={editingPhoto.title}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: '#EEEBE5' }}
              />

              <input name="title" defaultValue={editingPhoto.title} placeholder="タイトル（必須）" required style={inputStyle} />
              <input name="image_url" defaultValue={editingPhoto.image_url} placeholder="画像URL（必須）" required style={inputStyle} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <select name="tag" defaultValue={editingPhoto.tag ?? ''} style={inputStyle}>
                  <option value="">タグなし</option>
                  <option value="沖縄">沖縄</option>
                  <option value="日常">日常</option>
                  <option value="旅">旅</option>
                  <option value="自然">自然</option>
                </select>
                <input name="shot_date" type="date" defaultValue={editingPhoto.shot_date ?? ''} style={inputStyle} />
                <input name="location" defaultValue={editingPhoto.location ?? ''} placeholder="場所" style={inputStyle} />
                <input name="camera" defaultValue={editingPhoto.camera ?? ''} placeholder="カメラ" style={inputStyle} />
                <input name="film" defaultValue={editingPhoto.film ?? ''} placeholder="フィルム" style={{ ...inputStyle, gridColumn: '1 / -1' }} />
              </div>

              <textarea
                name="memo"
                defaultValue={editingPhoto.memo ?? ''}
                placeholder="メモ（任意）"
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  style={{
                    fontSize: '12px', padding: '8px 20px',
                    border: '1px solid #E5E1DC', background: 'transparent', color: '#8B7B6A', cursor: 'pointer',
                  }}
                >
                  キャンセル
                </button>
                <SubmitButton style={{
                  fontSize: '12px', padding: '8px 24px',
                  border: '1px solid #1E1814', background: '#1E1814', color: '#F7F4EF',
                }}>
                  保存する
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
