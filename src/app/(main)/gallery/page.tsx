// ギャラリー一覧ページ（/gallery）
// Server Component：Supabase から公開写真を取得して GalleryClient に渡す

import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'ギャラリー',
  description: 'フィルムカメラで撮った写真を展示しています。沖縄・日常・旅・自然をテーマに。',
}
import type { Photo } from '@/types'
import { GalleryClient } from './GalleryClient'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const { data } = await supabaseAdmin
    .from('photos')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const photos = (data as Photo[]) ?? []

  // null でない tag だけ取り出して重複を除去してタグ一覧を作る
  const tags = Array.from(new Set(photos.map((p) => p.tag).filter((t): t is string => t !== null)))

  return <GalleryClient photos={photos} tags={tags} />
}
