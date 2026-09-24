'use server'

import { revalidatePath } from 'next/cache'
import { listObjectsFromR2, uploadFileToR2, R2UploadError, type R2Object } from '@/lib/r2'
import { supabaseAdmin } from '@/lib/supabase'

// 画像ライブラリは「商品画像」「ギャラリー写真」どちらの用途にも使う共通の置き場所。
// 新規アップロードはすべてここ（library/ プレフィックス）に集約する。
// 過去に商品追加フォーム・写真一括アップロードから直接アップロードされていた画像
// （products/, photos/ プレフィックス）も引き続き一覧に表示するため、3つのプレフィックスを
// まとめて取得する（過去データの移行は行わず、表示側で吸収する）。
const LIBRARY_PREFIXES = ['library/', 'products/', 'photos/']

// 画像ライブラリへの画像アップロード（用途（商品／ギャラリー）を問わない汎用アップロード）
export async function uploadLibraryImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { error: 'ファイルが選択されていません。' }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const key = `library/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const url = await uploadFileToR2({
      buffer,
      key,
      contentType: file.type || 'application/octet-stream',
    })

    return { url }
  } catch (err) {
    console.error(err)
    const message = err instanceof R2UploadError ? err.message : 'アップロードに失敗しました。'
    return { error: message }
  }
}

// 画像ライブラリ（library/ + 過去の products/, photos/ 配下）の一覧をR2から取得する
export async function listMediaImages(): Promise<R2Object[]> {
  try {
    const results = await Promise.all(LIBRARY_PREFIXES.map(prefix => listObjectsFromR2(prefix)))
    return results.flat().sort((a, b) => (b.lastModified ?? '').localeCompare(a.lastModified ?? ''))
  } catch (err) {
    console.error(err)
    if (err instanceof R2UploadError) throw err
    throw new R2UploadError('画像一覧の取得に失敗しました。')
  }
}

// 商品・ギャラリー写真で既に使用されている画像URLの一覧を取得する
// （画像ライブラリ上で「使用中」を示すための軽量チェック。取得に失敗しても致命的ではないので空配列を返す）
export async function listUsedImageUrls(): Promise<string[]> {
  try {
    const [{ data: products }, { data: photos }] = await Promise.all([
      supabaseAdmin.from('products').select('image_url'),
      supabaseAdmin.from('photos').select('image_url'),
    ])

    const urls = new Set<string>()
    for (const p of products ?? []) if (p.image_url) urls.add(p.image_url)
    for (const p of photos ?? []) if (p.image_url) urls.add(p.image_url)
    return Array.from(urls)
  } catch (err) {
    console.error(err)
    return []
  }
}

// アップロード完了後に画像ライブラリページのキャッシュを破棄する
export async function revalidateMediaLibrary() {
  revalidatePath('/admin/media')
}
