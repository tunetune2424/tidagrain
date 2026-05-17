'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Product, ProductVariant } from '@/types'

// -----------------------------------------------
// CartContextType: Context が外部に公開する API の型定義
// -----------------------------------------------
type CartContextType = {
  items: CartItem[]                                                                        // カートに入っている商品リスト
  addItem: (product: Product, variant: ProductVariant | null, quantity: number) => void   // カートに追加
  removeItem: (productId: string, variantId: string | null) => void                       // カートから削除
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void // 数量を変更
  clearCart: () => void                                                                    // カートを空にする（購入完了後に使用）
  totalCount: number   // カート内の商品の合計個数（バッジ表示などに使う）
  subtotal: number     // 小計（税・送料を含まない合計金額）
}

// Context を作成。初期値は null（Provider の外で使われたときに検知できるように null にしている）
const CartContext = createContext<CartContextType | null>(null)

// -----------------------------------------------
// CartProvider: カートの状態を管理する Provider コンポーネント
// layout.tsx でアプリ全体を囲むことで、どのページからでも useCart() でカートにアクセスできる
// -----------------------------------------------
export function CartProvider({ children }: { children: ReactNode }) {
  // カートアイテムの配列を state で管理
  const [items, setItems] = useState<CartItem[]>([])

  // -----------------------------------------------
  // isSameItem: 「同じ商品かどうか」を判定するヘルパー関数
  // 商品ID と バリアントID（サイズ・フレームなど）が両方一致したとき同じ商品とみなす
  // ※ variant が null のとき（バリアントなし商品）は null 同士で比較する
  // -----------------------------------------------
  const isSameItem = (item: CartItem, productId: string, variantId: string | null) =>
    item.product.id === productId && (item.variant?.id ?? null) === variantId

  // -----------------------------------------------
  // addItem: カートに商品を追加する
  // 同じ商品・バリアントがすでにあれば数量を加算、なければ新しく追加する
  // -----------------------------------------------
  const addItem = (product: Product, variant: ProductVariant | null, quantity: number) => {
    setItems(prev => {
      // すでにカートにある同じ商品を探す
      const existing = prev.find(i => isSameItem(i, product.id, variant?.id ?? null))

      if (existing) {
        // 既存アイテムの数量だけ増やして返す（それ以外は変更しない）
        return prev.map(i =>
          isSameItem(i, product.id, variant?.id ?? null)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }

      // 新しい商品をリストの末尾に追加して返す
      return [...prev, { product, variant, quantity }]
    })
  }

  // -----------------------------------------------
  // removeItem: カートから商品を削除する
  // 対象の商品だけを除いた新しい配列を返す
  // -----------------------------------------------
  const removeItem = (productId: string, variantId: string | null) => {
    setItems(prev => prev.filter(i => !isSameItem(i, productId, variantId)))
  }

  // -----------------------------------------------
  // updateQuantity: 商品の数量を変更する
  // 0以下になったら自動的にカートから削除する
  // -----------------------------------------------
  const updateQuantity = (productId: string, variantId: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setItems(prev =>
      prev.map(i => isSameItem(i, productId, variantId) ? { ...i, quantity } : i)
    )
  }

  // カートを完全に空にする（注文完了時に呼び出す）
  const clearCart = () => setItems([])

  // -----------------------------------------------
  // 派生値：items から計算するので state にはしない
  // -----------------------------------------------

  // 全アイテムの数量を合計（ヘッダーのカートバッジに表示する数）
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  // 小計：バリアントに price_override があればそちらを優先、なければ商品の基本価格を使う
  const subtotal = items.reduce((sum, i) => {
    const price = i.variant?.price_override ?? i.product.price
    return sum + price * i.quantity
  }, 0)

  return (
    // value に渡したものが、useCart() で取得できる値になる
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// -----------------------------------------------
// useCart: CartContext を取得するカスタムフック
// CartProvider の外で呼ばれたときはエラーを投げて早期発見できるようにしている
// -----------------------------------------------
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
