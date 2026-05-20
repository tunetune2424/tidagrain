// Server Component：UUID で Supabase から商品・関連商品を取得して ProductDetailClient に渡す

import { supabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/types'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // URL の id（UUID）で該当商品を1件取得。公開中のみ対象
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  // 商品が存在しない・非公開の場合は 404 ページを表示
  if (!product) notFound()

  // 関連商品：現在の商品を除いた公開中の商品を3件取得
  const { data: related } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', params.id)
    .limit(3)

  return (
    <ProductDetailClient
      product={product as Product}
      related={(related as Product[]) ?? []}
    />
  )
}
