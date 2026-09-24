'use server'

import { revalidatePath } from 'next/cache'
import { listObjectsFromR2, R2UploadError, type R2Object } from '@/lib/r2'
import { uploadProductImage as uploadProductImageAction } from '../actions'

// 画像ライブラリへのアップロード（実体は admin/actions.ts の uploadProductImage を再利用）
export async function uploadProductImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  return uploadProductImageAction(formData)
}

// 画像ライブラリ（products/ 配下）の一覧をR2から取得する
export async function listMediaImages(): Promise<R2Object[]> {
  try {
    return await listObjectsFromR2('products/')
  } catch (err) {
    console.error(err)
    // 一覧取得に失敗した場合は空配列を返す（画面側でエラー表示する）
    if (err instanceof R2UploadError) throw err
    throw new R2UploadError('画像一覧の取得に失敗しました。')
  }
}

// アップロード完了後に画像ライブラリページのキャッシュを破棄する
export async function revalidateMediaLibrary() {
  revalidatePath('/admin/media')
}
