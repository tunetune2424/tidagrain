'use server'
// 'use server' をつけると「この関数はサーバー側で実行する」という意味になる
// ブラウザからボタンを押したとき、この関数がサーバーで動いて Supabase を書き換える

import { revalidatePath } from 'next/cache'
// revalidatePath: 指定したページのキャッシュを破棄して最新データで再表示させる

import { redirect } from 'next/navigation'
// redirect: 別のページに飛ばす（ログアウト後にログインページへ）

import { cookies } from 'next/headers'
// cookies: サーバー側でブラウザのクッキーを読み書きする

import { createServerClient } from '@supabase/ssr'
// createServerClient: サーバー側（Next.js）で Supabase を使うための関数

import { supabaseAdmin } from '@/lib/supabase'
// supabaseAdmin: サービスロールキーを使った管理者権限の Supabase クライアント
// RLS（行レベルセキュリティ）を無視して全データにアクセスできる

// 商品画像のアップロード自体は画像ライブラリ（/admin/media, src/app/admin/media/actions.ts の
// uploadLibraryImage）に一本化している。このファイルでは商品データの読み書きのみを扱う。

// 商品の公開/非公開を切り替える
export async function toggleProductActive(formData: FormData) {
  // フォームから id（どの商品か）と isActive（今の状態）を取り出す
  const id = formData.get('id') as string
  const isActive = formData.get('isActive') === 'true'

  // 今が true なら false に、false なら true に反転して更新
  await supabaseAdmin.from('products').update({ is_active: !isActive }).eq('id', id)

  // /admin と /shop のキャッシュを破棄して最新データを表示させる
  revalidatePath('/admin')
  revalidatePath('/shop')
}

// 商品を削除する
export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string

  // 指定した id の商品を products テーブルから削除
  await supabaseAdmin.from('products').delete().eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/shop')
}

// おすすめフラグを切り替える
export async function toggleProductFeatured(formData: FormData) {
  const id = formData.get('id') as string
  const isFeatured = formData.get('isFeatured') === 'true'

  await supabaseAdmin.from('products').update({ is_featured: !isFeatured }).eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
}

// 商品を新規追加する
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const price = Number(formData.get('price'))
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string

  await supabaseAdmin.from('products').insert({
    name,
    category,
    price,
    description: description || null,
    image_url,
    is_active: false,   // 追加直後は非公開にしておく
  })

  revalidatePath('/admin')
  revalidatePath('/shop')
}


// 注文のステータスを更新する（未払い → 支払済 → 発送済 → 配達完了）
export async function updateOrderStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  // 指定した id の注文ステータスを書き換える
  await supabaseAdmin.from('orders').update({ status }).eq('id', id)

  revalidatePath('/admin')
}

// ログアウト処理
export async function signOut() {
  // サーバー側でクッキーを操作するために取得
  const cookieStore = await cookies()

  // ログアウトには通常の supabase クライアント（anon key）を使う
  // クッキーに保存されたセッション情報を読み書きするため createServerClient を使う
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Supabase のセッションを削除（ログアウト）
  await supabase.auth.signOut()

  // ログインページへリダイレクト
  redirect('/admin/login')
}
