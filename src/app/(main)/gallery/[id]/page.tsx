// 写真詳細ページ（/gallery/[id]）
// Server Component：Supabase から写真データを取得して表示する

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import type { Photo } from '@/types'
import { CopyLinkButton } from './CopyLinkButton'

export const dynamic = 'force-dynamic'

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
  // 該当写真・前後の写真・関連写真を並列取得
  const { data: photoData } = await supabaseAdmin
    .from('photos')
    .select('*')
    .eq('id', params.id)
    .eq('is_public', true)
    .single()

  if (!photoData) notFound()

  const photo = photoData as Photo

  // 前の写真（同じ created_at より新しい → 降順リストで上にある）
  const { data: prevData } = await supabaseAdmin
    .from('photos')
    .select('id')
    .eq('is_public', true)
    .gt('created_at', photo.created_at)
    .order('created_at', { ascending: true })
    .limit(1)

  // 次の写真（同じ created_at より古い → 降順リストで下にある）
  const { data: nextData } = await supabaseAdmin
    .from('photos')
    .select('id')
    .eq('is_public', true)
    .lt('created_at', photo.created_at)
    .order('created_at', { ascending: false })
    .limit(1)

  // 他の写真（現在の写真を除いた最大4件）
  const { data: relatedData } = await supabaseAdmin
    .from('photos')
    .select('*')
    .eq('is_public', true)
    .neq('id', photo.id)
    .order('created_at', { ascending: false })
    .limit(4)

  const prevPhoto = prevData?.[0] ?? null
  const nextPhoto = nextData?.[0] ?? null
  const related = (relatedData as Photo[]) ?? []

  return (
    <>
      {/* パンくずリスト */}
      <div className="max-w-[1100px] mx-auto px-8 py-5">
        <p className="text-[11px] text-muted tracking-[0.08em]">
          <Link href="/" className="hover:opacity-60 transition-opacity">home</Link>
          {' '}&nbsp;/{' '}&nbsp;
          <Link href="/gallery" className="hover:opacity-60 transition-opacity">gallery</Link>
          {' '}&nbsp;/{' '}&nbsp;
          {photo.title}
        </p>
      </div>

      {/* メインコンテンツ：左に写真 / 右に情報 */}
      <section className="max-w-[1100px] mx-auto px-8 pb-20">
        <div className="grid grid-cols-[1fr_400px] gap-16 items-start">

          {/* 左カラム：写真エリア */}
          <div>
            {/* 上部ナビ：戻るリンク + 前後矢印 */}
            <div className="flex justify-between items-center mb-4">
              <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-[6px] hover:opacity-60 transition-opacity">
                <ChevronLeft size={14} strokeWidth={1.5} />
                ギャラリーに戻る
              </Link>
              <div className="flex gap-2">
                {prevPhoto ? (
                  <Link href={`/gallery/${prevPhoto.id}`} className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-t-text hover:text-t-text transition-colors">
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-muted/30">
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </div>
                )}
                {nextPhoto ? (
                  <Link href={`/gallery/${nextPhoto.id}`} className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:border-t-text hover:text-t-text transition-colors">
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-muted/30">
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>

            {/* メイン写真 */}
            <div className="border border-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image_url} alt={photo.title} className="film w-full block" />
            </div>
          </div>

          {/* 右カラム：写真情報 */}
          <div className="pt-12">
            {photo.tag && (
              <p className="text-[11px] text-muted tracking-[0.08em] mb-3">{photo.tag}</p>
            )}
            <h1 className="font-serif-en text-[32px] font-normal leading-[1.3] mb-6">{photo.title}</h1>

            {photo.memo && (
              <p className="font-serif-jp text-[13px] leading-[2.8] text-muted2 mb-9 whitespace-pre-line">
                {photo.memo}
              </p>
            )}

            {/* 撮影情報テーブル */}
            <table className="w-full text-[12px] border-collapse mb-9">
              <tbody>
                {photo.shot_date && (
                  <tr className="border-t border-border">
                    <td className="py-3 text-muted w-[40%]">撮影日</td>
                    <td className="py-3">{new Date(photo.shot_date).toLocaleDateString('ja-JP')}</td>
                  </tr>
                )}
                {photo.location && (
                  <tr className="border-t border-border">
                    <td className="py-3 text-muted w-[40%]">場所</td>
                    <td className="py-3">{photo.location}</td>
                  </tr>
                )}
                {photo.camera && (
                  <tr className="border-t border-border">
                    <td className="py-3 text-muted w-[40%]">カメラ</td>
                    <td className="py-3">{photo.camera}</td>
                  </tr>
                )}
                {photo.film && (
                  <tr className="border-t border-border last:border-b">
                    <td className="py-3 text-muted w-[40%]">フィルム</td>
                    <td className="py-3">{photo.film}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex gap-3">
              <CopyLinkButton />
            </div>
          </div>
        </div>
      </section>

      {/* 他の写真セクション */}
      {related.length > 0 && (
        <section className="border-t border-border px-8 py-14">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-[15px] font-normal">他の写真</h2>
              <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
                ギャラリーをすべて見る <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-[10px]">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/gallery/${r.id}`}
                  className="group h-[180px] border border-border overflow-hidden block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image_url}
                    alt={r.title}
                    className="film w-full h-full object-cover transition-transform duration-[1600ms] ease-in-out group-hover:scale-[1.04]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
