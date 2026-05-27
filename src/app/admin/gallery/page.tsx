export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import type { Photo } from '@/types'
import { PhotoTable } from './PhotoTable'
import { AddPhotoForm } from './AddPhotoForm'
import { BulkUploadForm } from './BulkUploadForm'
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
            <PhotoTable photos={photos} />
          </div>
        </section>

        <BulkUploadForm />

        <AddPhotoForm />

      </main>
    </div>
  )
}

