// トップページ（/）
// Hero → おすすめ商品 → ギャラリー → ブランドコンセプト の構成

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// -----------------------------------------------
// トップページに表示するおすすめ商品（3件固定）
// 今後は Supabase から is_featured フラグで取得する予定
// -----------------------------------------------
const FEATURED_PRODUCTS = [
  {
    id: 1,
    category: 'フォトプリント',
    name: '光の向こう側 #01',
    sub: 'A4 / フレーム付き',
    price: '¥4,200（税込）',
    image: 'https://i.imgur.com/F3hrntK.jpeg',
    alt: '写真プリント',
  },
  {
    id: 2,
    category: 'ポストカード',
    name: '旅の光 ポストカードセット',
    sub: '5枚組',
    price: '¥1,200（税込）',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop',
    alt: 'ポストカードセット',
  },
  {
    id: 3,
    category: 'トートバッグ',
    name: '海辺の朝 トートバッグ',
    sub: 'キャンバス地 / ナチュラル',
    price: '¥3,800（税込）',
    image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=800&auto=format&fit=crop',
    alt: 'フォトプリントトート',
  },
]

// -----------------------------------------------
// トップページに表示するギャラリー写真（5件固定）
// span: 'row-span-2' → その写真だけ縦2行分の高さになるグリッドレイアウト
// -----------------------------------------------
const GALLERY_PHOTOS: { src: string; alt: string; span?: string }[] = [
  {
    src: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop',
    alt: '朝の光とカーテン',
    span: 'row-span-2', // 左上の写真だけ縦に大きく表示してアクセントにする
  },
  {
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
    alt: '猫',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    alt: '海岸',
  },
  {
    src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop',
    alt: '日本の路地',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc45?q=80&w=800&auto=format&fit=crop',
    alt: '野の花',
  },
]

export default function Home() {
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
        {/* 左から右へ暗くなるグラデーション（右側は透明にして写真を活かす） */}
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
          おすすめ商品セクション（3件グリッド）
          ----------------------------------------------- */}
      <section className="max-w-[1100px] mx-auto px-8 pt-16 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-normal tracking-[0.02em]">おすすめの商品</h2>
          <Link href="/shop" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
            すべて見る <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {FEATURED_PRODUCTS.map((product) => (
            // group クラスで子要素のホバースタイルを親から制御できる
            <Link
              key={product.id}
              href="/shop"
              className="group border border-border overflow-hidden block transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              {/* ホバーで 1.04 倍にゆっくり拡大（1400ms で自然な動きを演出） */}
              <div className="overflow-hidden h-60 bg-[#ede9e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.alt}
                  className="film w-full h-full object-cover transition-transform duration-[1400ms] ease-in-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-[18px] py-4">
                <p className="text-[11px] text-muted mb-[5px] tracking-[0.06em]">{product.category}</p>
                <h4 className="text-[14px] font-normal mb-2 leading-[1.5]">
                  {product.name}
                  <br />
                  <span className="text-[12px] text-muted font-light">{product.sub}</span>
                </h4>
                <p className="text-[12px] text-muted2">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* -----------------------------------------------
          ギャラリーセクション
          grid-rows で行の高さを固定し、row-span-2 の写真だけ縦2行分になる
          ----------------------------------------------- */}
      <section className="max-w-[1100px] mx-auto px-8 pb-[72px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-normal tracking-[0.02em]">ギャラリー</h2>
          <Link href="/gallery" className="text-[12px] text-muted flex items-center gap-1 hover:opacity-70 transition-opacity">
            すべて見る <ChevronRight size={12} />
          </Link>
        </div>

        {/* grid-rows=[200px_200px] で各行の高さを固定 */}
        <div className="grid grid-cols-3 grid-rows-[200px_200px] gap-2">
          {GALLERY_PHOTOS.map((photo, i) => (
            <Link
              key={i}
              href="/gallery"
              // photo.span がある場合のみ row-span-2 クラスを追加
              className={`group overflow-hidden ${photo.span ?? ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
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
