// -----------------------------------------------
// アプリ全体で使う型定義
// Supabase のテーブル構造と対応している
// -----------------------------------------------

// ギャラリー写真（photos テーブル）
export type Photo = {
  id: string
  title: string
  shot_date: string | null   // 撮影日（任意）
  location: string | null    // 撮影場所（任意）
  camera: string | null      // カメラ機種（任意）
  film: string | null        // フィルム名（任意）
  memo: string | null        // 一言メモ（任意）
  image_url: string          // Supabase Storage の公開URL
  is_public: boolean         // true のときだけギャラリーに表示する
  created_at: string
  updated_at: string
}

// ショップ商品（products テーブル）
export type Product = {
  id: string
  name: string
  description: string | null
  price: number              // 基本価格（円）。バリアントに price_override がある場合はそちらを優先
  category: 'print' | 'postcard' | 'apparel' | 'goods'  // カテゴリは4種類に限定
  image_url: string
  photo_id: string | null    // 元になったギャラリー写真のID（ギャラリーとの紐付け）
  is_active: boolean         // false にすると商品一覧から非表示になる
  created_at: string
  updated_at: string
}

// 商品バリエーション（product_variants テーブル）
// 同じ商品でもサイズやフレームによって在庫・価格が異なる場合に使う
export type ProductVariant = {
  id: string
  product_id: string         // 親商品の ID
  size: string | null        // 例: 'A4' | 'A3' | 'ポストカード'
  frame: string | null       // 例: 'なし' | 'あり'
  price_override: number | null  // null なら親商品の price を使う
  stock: number
  created_at: string
}

// 注文（orders テーブル）
export type Order = {
  id: string
  stripe_session_id: string  // Stripe 決済の ID（二重処理防止に使用）
  email: string
  name: string
  postal_code: string | null
  prefecture: string | null
  city: string | null
  address_line: string | null
  phone: string | null
  shipping_method: string | null
  subtotal: number           // 小計（税抜）
  shipping_fee: number       // 送料
  tax: number                // 消費税
  total: number              // 合計（subtotal + shipping_fee + tax）
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  created_at: string
}

// 注文明細（order_items テーブル）
// 1 つの注文に複数の商品が紐づく
export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  price_at_purchase: number  // 購入時点の価格を保存（後から価格変更があっても履歴が正確になる）
}

// カートアイテム（DB には保存しないフロントエンド専用の型）
// CartContext の items 配列の要素として使う
export type CartItem = {
  product: Product
  variant: ProductVariant | null  // バリアントなし商品のときは null
  quantity: number
}
