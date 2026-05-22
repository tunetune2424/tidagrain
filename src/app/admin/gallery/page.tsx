export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import type { Photo } from '@/types'
import { togglePhotoPublic, deletePhoto } from './actions'
import { SubmitButton } from '../SubmitButton'
import { AddPhotoForm } from './AddPhotoForm'
import Link from 'next/link'

export default async function AdminGalleryPage() {
  const { data } = await supabaseAdmin
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  const photos = (data as Photo[]) ?? []

  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>

      {/* ヘッダー */}
      <header style={{ borderBottom: '1px solid #E5E1DC', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '0.04em' }}>tidagrain.</p>
          <p style={{ fontSize: '10px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin / gallery</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>← 管理画面に戻る</Link>
          <Link href="/gallery" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>サイトで確認</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px' }}>

        {/* 写真一覧 */}
        <section>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
            Photos / 写真一覧
          </h2>
          <div style={{ border: '1px solid #E5E1DC' }}>
            {photos.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                写真データがありません
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
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

                      {/* サムネイル */}
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

                      {/* 公開/非公開トグル */}
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

                      {/* 削除 */}
                      <td style={tdStyle}>
                        <form action={deletePhoto}>
                          <input type="hidden" name="id" value={photo.id} />
                          <SubmitButton style={{
                            fontSize: '11px', padding: '4px 12px',
                            border: '1px solid #E5E1DC', background: 'transparent', color: '#c0392b',
                          }}>
                            削除
                          </SubmitButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <AddPhotoForm />

      </main>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.08em', fontWeight: 400,
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', color: '#1E1814', verticalAlign: 'middle',
}
