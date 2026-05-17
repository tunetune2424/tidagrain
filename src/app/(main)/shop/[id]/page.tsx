'use client'

// 商品詳細ページ（/shop/[id]）
// URL の [id] で商品を特定し、画像・サイズ・フレーム選択を表示する

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/data'
import { useCart } from '@/contexts/CartContext'

// -----------------------------------------------
// PRODUCT_DETAILS: 各商品の詳細情報（Supabase移行前の仮データ）
// キーは PRODUCTS の id と対応している
// ※ 将来は Supabase の product_variants テーブルから取得する予定
// -----------------------------------------------
const PRODUCT_DETAILS: Record<number, {
  images: string[]
  sizes: string[]
  frames: string[]
  description: string
  specs: { label: string; value: string }[]
}> = {
  1: {
    images: [
      'https://i.imgur.com/F3hrntK.jpeg',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    ],
    sizes: ['A5', 'A4', 'A3'],
    frames: ['あり（ナチュラル）', 'なし'],
    description: `沖縄・今帰仁村の夕暮れ時に撮影した一枚。\nNikon FM2 / Kodak Portra 400。\n光が水面に溶けていくあの瞬間を、\nフィルムの粒子ごとお届けします。`,
    specs: [
      { label: '撮影日', value: '2024年11月' },
      { label: '撮影場所', value: '沖縄県 今帰仁村' },
      { label: 'カメラ', value: 'Nikon FM2' },
      { label: 'フィルム', value: 'Kodak Portra 400' },
      { label: '用紙', value: 'フジカラー クリスタルペーパー' },
      { label: '配送', value: '受注生産・2〜3週間でお届け' },
    ],
  },
  2: {
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: ['A5'],
    frames: ['あり'],
    description: 'テスト',
    specs: [{ label: '配送', value: '受注生産・2〜3週間でお届け' }],
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // PRODUCTS から URL の id に一致する商品を探す（見つからなければ undefined）
  const product = PRODUCTS.find((p) => p.id === Number(params.id))

  const { addItem } = useCart()

  // ボタンを押したときの一時的なフィードバック状態（2秒後に自動で false に戻る）
  const [added, setAdded] = useState(false)

  // カートに追加する処理
  // ※ このページはまだ Product 型（Supabase）ではなく PRODUCTS（仮データ）を使っているため
  //    addItem に渡すオブジェクトを Product 型に合わせて整形する
  const handleAddToCart = () => {
    // product が undefined のとき（存在しない商品ID）は何もしない
    if (!product) return
    addItem(
      {
        id: String(product.id),
        name: product.name,
        description: null,
        price: product.price,
        category: 'goods',
        image_url: product.image,
        photo_id: null,
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      null,
      1
    )
    // added を true にして、2秒後に false に戻す
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // PRODUCT_DETAILS に詳細情報がなければ、商品画像だけ使ったデフォルト値を返す
  const detail = PRODUCT_DETAILS[Number(params.id)] ?? {
    images: [product?.image ?? ''],
    sizes: [],
    frames: [],
    description: '',
    specs: [{ label: '配送', value: '受注生産・2〜3週間でお届け' }],
  }

  // メイン表示中の画像（サムネイルクリックで切り替わる）
  const [mainImage, setMainImage] = useState(detail.images[0])
  // 選択中のサイズ（初期値は先頭のサイズ）
  const [selectedSize, setSelectedSize] = useState(detail.sizes[0] ?? '')
  // 選択中のフレーム（初期値は先頭のフレーム）
  const [selectedFrame, setSelectedFrame] = useState(detail.frames[0] ?? '')

  // 関連商品：今見ている商品を除いた先頭3件
  const related = PRODUCTS.filter((p) => p.id !== Number(params.id)).slice(0, 3)

  // 商品が見つからないときの早期リターン
  if (!product) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-20 text-center text-muted">
        商品が見つかりません。
      </div>
    )
  }

  return (
    <>
      {/* パンくずリスト */}
      <div className="max-w-[1100px] mx-auto px-8 py-5">
        <p className="text-[11px] text-muted tracking-[0.08em]">
          <Link href="/" className="hover:opacity-60 transition-opacity">home</Link>
          {' '}&nbsp;/{' '}&nbsp;
          <Link href="/shop" className="hover:opacity-60 transition-opacity">shop</Link>
          {' '}&nbsp;/{' '}&nbsp;
          {product.name}
        </p>
      </div>

      {/* 商品メインエリア：左に画像、右に情報 */}
      <section className="max-w-[1100px] mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 gap-16 items-start">

          {/* 左：メイン画像 + サムネイル一覧 */}
          <div>
            {/* メイン表示画像 */}
            <div className="border border-border overflow-hidden h-[520px] mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage} alt={product.name} className="film w-full h-full object-cover" />
            </div>
            {/* サムネイル：クリックするとメイン画像が切り替わる */}
            <div className="grid grid-cols-4 gap-2">
              {detail.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(src)}
                  // 選択中のサムネイルは枠を濃くして強調
                  className={`h-20 border overflow-hidden transition-opacity duration-200 ${mainImage === src
                      ? 'border-t-text opacity-100'
                      : 'border-border opacity-70 hover:opacity-100'
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="film w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 右：商品情報・バリアント選択・購入ボタン */}
          <div className="pt-2">
            <p className="text-[11px] text-muted tracking-[0.08em] mb-3">{product.category}</p>
            <h1 className="font-serif-en text-[36px] font-normal leading-[1.3] mb-2">{product.name}</h1>
            <p className="text-[22px] mb-8 tracking-[0.04em]">
              ¥{product.price.toLocaleString()}{' '}
              <span className="text-[12px] text-muted">（税込）</span>
            </p>

            <div className="border-t border-border pt-7 mb-7">
              {/* サイズ選択（サイズがある商品のみ表示） */}
              {detail.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-[12px] text-muted mb-3 tracking-[0.06em]">サイズ</p>
                  <div className="flex gap-2">
                    {detail.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        // 選択中は塗りつぶしスタイル、未選択はボーダーだけ
                        className={`text-[12px] px-5 py-2 border transition-all duration-200 ${selectedSize === size
                            ? 'border-t-text bg-t-text text-bg'
                            : 'border-border text-t-text hover:border-t-text hover:bg-t-text hover:text-bg'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* フレーム選択（フレームがある商品のみ表示） */}
              {detail.frames.length > 0 && (
                <div className="mb-8">
                  <p className="text-[12px] text-muted mb-3 tracking-[0.06em]">フレーム</p>
                  <div className="flex gap-2">
                    {detail.frames.map((frame) => (
                      <button
                        key={frame}
                        onClick={() => setSelectedFrame(frame)}
                        className={`text-[12px] px-5 py-2 border transition-all duration-200 ${selectedFrame === frame
                            ? 'border-t-text bg-t-text text-bg'
                            : 'border-border text-t-text hover:border-t-text hover:bg-t-text hover:text-bg'
                          }`}
                      >
                        {frame}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* added が true の間はテキストとスタイルが変わる（2秒後に自動で元に戻る） */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 text-[13px] tracking-[0.1em] font-light transition-all duration-300 mb-3 ${
                  added
                    ? 'bg-transparent border border-t-text text-t-text cursor-default'
                    : 'bg-t-text text-bg hover:opacity-75'
                }`}
              >
                {added ? '✓ カートに追加しました' : 'カートに入れる'}
              </button>
              <button className="w-full py-4 bg-transparent text-t-text text-[13px] tracking-[0.1em] font-light border border-border transition-colors duration-300 hover:border-t-text">
                ♡ &nbsp;お気に入りに追加
              </button>
            </div>

            {/* 商品説明と仕様テーブル */}
            <div className="border-t border-border pt-7">
              {detail.description && (
                // whitespace-pre-line で \n を改行として表示
                <p className="font-serif-jp text-[13px] leading-[2.8] text-muted2 mb-7 whitespace-pre-line">
                  {detail.description}
                </p>
              )}
              <table className="w-full text-[12px] border-collapse">
                <tbody>
                  {detail.specs.map((spec) => (
                    <tr key={spec.label} className="border-t border-border last:border-b">
                      <td className="py-3 text-muted w-[40%]">{spec.label}</td>
                      <td className="py-3">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 関連商品 */}
      <section className="border-t border-border px-8 py-16">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[15px] font-normal mb-8">関連商品</h2>
          <div className="grid grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/shop/${r.id}`}
                className="group border border-border overflow-hidden block"
              >
                <div className="h-[220px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.alt}
                    className="film w-full h-full object-cover transition-transform duration-[1400ms] ease-in-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-[18px] py-4">
                  <p className="text-[11px] text-muted mb-1">{r.category}</p>
                  <p className="text-[14px] font-normal mb-2">{r.name}</p>
                  <p className="text-[13px]">¥{r.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
