export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ショップ',
  description: 'tidagrain. のオンラインショップ。写真プリント・ポストカード・アパレル・グッズをお届けします。',
}

// Server Component：サーバー側で Supabase からデータを取得し ShopClient に渡す
// フィルター・並び替えの UI は ShopClient.tsx（Client Component）で管理している

import { supabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/types'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  // 公開中（is_active = true）の商品を新着順で全件取得
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('name', { ascending: true })

  // 取得したデータを ShopClient に渡す
  // products が null のときは空配列にしてエラーを防ぐ
  return <ShopClient products={(products as Product[]) ?? []} />
}
