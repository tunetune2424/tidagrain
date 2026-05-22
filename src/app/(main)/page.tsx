// トップページ（/）
// Hero → おすすめ商品 → ギャラリー → ブランドコンセプト の構成

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import type { Product, Photo } from '@/types'

export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<string, string> = {
  print: 'フォトプリント',
  postcard: 'ポストカード',
  goods: 'グッズ',
  apparel: 'アパレル',
}

export default async function Home() {
  // is_featured = true の公開商品を最大3件取得
  const { data: featured } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const products = (featured as Product[]) ?? []

  // ギャラリー：公開写真を最大5件取得
  const { data: galleryData } = await supabaseAdmin
    .from('photos')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(5)

  const galleryPhotos = (galleryData as Photo[]) ?? []

  return (
    <>
      {/* -----------------------------------------------
          Hero セクション
          clamp() でビューポート幅に応じてフォントサイズが変わる
          グラデーションオーバーレイで左側を暗くしてテキストを読みやすくする
          ----------------------------------------------- */}
      <section className="relative h-[54vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.imgur.com/EnZcuHD.jpeg"
          alt="film photography"
          className="film w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(20,16,12,0.42) 0%, rgba(20,16,12,0.08) 65%, transparent 100%)' }}
        />
        <div className="absolute bottom-10 left-12">
          <h1
            className="font-serif-jp text-white font-normal leading-[1.7] tracking-[0.06em]"
            style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}
          >
            光の粒を、<br />持ち歩く。
          </h1>
        </div>
      </section>

      {/* -----------------------------------------------
          おすすめ商品セクション（is_featured = true の商品を Supabase から取得）
          ----------------------------------------------- */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-normal tracking-[0.02em]">おすすめの商品</h2>
          <Link href="/shop" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
            すべて見る <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group border border-border overflow-hidden block transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              <div className="overflow-hidden h-60 bg-[#ede9e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="film w-full h-full object-cover transition-transform duration-[1400ms] ease-in-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-[18px] py-4">
                <p className="text-[11px] text-muted mb-[5px] tracking-[0.06em]">{CATEGORY_LABEL[product.category]}</p>
                <h4 className="text-[14px] font-normal mb-2 leading-[1.5]">{product.name}</h4>
                <p className="text-[12px] text-muted2">¥{product.price.toLocaleString()}（税込）</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* -----------------------------------------------
          ギャラリーセクション
          grid-rows で行の高さを固定し、row-span-2 の写真だけ縦2行分になる
          ----------------------------------------------- */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 pb-[72px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-normal tracking-[0.02em]">ギャラリー</h2>
          <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
            すべて見る <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-[160px_160px] sm:grid-rows-[200px_200px] gap-2">
          {galleryPhotos.map((photo, i) => (
            <Link
              key={photo.id}
              href={`/gallery/${photo.id}`}
              className={`group overflow-hidden ${i === 0 ? 'sm:row-span-2' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image_url}
                alt={photo.title}
                className="film w-full h-full object-cover transition-transform duration-[1800ms] ease-in-out group-hover:scale-[1.04]"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* -----------------------------------------------
          ブランドコンセプトセクション（テキスト中心のシンプルな構成）
          ----------------------------------------------- */}
      <section className="border-t border-border py-20 text-center">
        <h2 className="text-[15px] font-normal mb-7 tracking-[0.04em]">私たちの想い</h2>
        <p className="font-serif-jp text-[13px] leading-[3] text-muted2 max-w-[500px] mx-auto font-light">
          tidagrain. は、フィルムで写した「光の粒」を分かち合うブランドです。<br />
          何気ない日常や旅の風景、心が動いたその瞬間をフィルムに残し、<br />
          写真作品や日用品としてお届けしています。<br />
          忙しい毎日の中で、ふと立ち止まり、光を感じるきっかけになりますように。<br />
          光の粒を、あなたのそばに。
        </p>
      </section>
    </>
  )
}
