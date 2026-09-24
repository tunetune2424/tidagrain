export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import type { Photo } from '@/types'
import { PhotoTable } from './PhotoTable'
import { AddPhotoForm } from './AddPhotoForm'
import { BulkUploadForm } from './BulkUploadForm'
import Link from 'next/link'

type SearchParams = {
  q?: string
  tag?: string
  status?: string
}

const TAG_OPTIONS = ['沖縄', '日常', '旅', '自然']

export default async function AdminGalleryPage({ searchParams }: { searchParams: SearchParams }) {
  const q = searchParams.q?.trim() ?? ''
  const tag = searchParams.tag ?? ''
  const status = searchParams.status ?? ''

  let query = supabaseAdmin.from('photos').select('*').order('created_at', { ascending: false })
  if (q) query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%`)
  if (tag) query = query.eq('tag', tag)
  if (status === 'public') query = query.eq('is_public', true)
  if (status === 'private') query = query.eq('is_public', false)

  const { data } = await query

  const photos = (data as Photo[]) ?? []
  const hasFilter = Boolean(q || tag || status)

  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>

      {/* ヘッダー */}
      <header style={{ borderBottom: '1px solid #E5E1DC', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '0.04em' }}>tidagrain.</p>
          <p style={{ fontSize: '10px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin / gallery</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>← 管理画面に戻る</Link>
          <Link href="/gallery" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>サイトで確認</Link>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px, 6vw, 48px) clamp(16px, 4vw, 32px)' }}>

        {/* 写真一覧 */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
              Photos / 写真一覧
            </h2>
            <span style={{ fontSize: '11px', color: '#8B7B6A' }}>{photos.length}件</span>
          </div>

          {/* 検索・絞り込みフォーム */}
          <form
            method="get"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
              marginBottom: '12px', padding: '12px', border: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <input
              name="q"
              defaultValue={q}
              placeholder="タイトル・場所で検索"
              style={{ ...filterInputStyle, flex: '1 1 160px' }}
            />
            <select name="tag" defaultValue={tag} style={{ ...filterInputStyle, flex: '0 1 140px' }}>
              <option value="">すべてのタグ</option>
              {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="status" defaultValue={status} style={{ ...filterInputStyle, flex: '0 1 140px' }}>
              <option value="">すべての状態</option>
              <option value="public">公開中のみ</option>
              <option value="private">非公開のみ</option>
            </select>
            <button type="submit" style={filterButtonStyle}>絞り込む</button>
            {hasFilter && (
              <a href="/admin/gallery" style={filterResetStyle}>条件をクリア</a>
            )}
          </form>

          <div style={{ border: '1px solid #E5E1DC' }}>
            {photos.length === 0 && hasFilter ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                条件に一致する写真がありません
              </p>
            ) : (
              <PhotoTable photos={photos} />
            )}
          </div>
        </section>

        <BulkUploadForm />

        <AddPhotoForm />

      </main>
    </div>
  )
}

// 検索・絞り込みフォームの入力欄に共通で適用するスタイル
const filterInputStyle: React.CSSProperties = {
  fontSize: '12px', padding: '7px 10px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', minWidth: 0,
}

const filterButtonStyle: React.CSSProperties = {
  fontSize: '11px', padding: '7px 16px',
  border: '1px solid #1E1814', background: '#1E1814', color: '#F7F4EF', cursor: 'pointer',
}

const filterResetStyle: React.CSSProperties = {
  fontSize: '11px', color: '#8B7B6A', textDecoration: 'underline',
}
