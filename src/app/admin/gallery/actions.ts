'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { uploadFileToR2, R2UploadError } from '@/lib/r2'

// 写真をCloudflare R2にアップロードし、公開URLを返す
// 失敗時は { error: string } を返す（例外を握りつぶして成功扱いにはしない）
export async function uploadPhotoImage(
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
    const key = `photos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

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

export async function addPhoto(formData: FormData) {
  const title = formData.get('title') as string
  const tag = formData.get('tag') as string
  const location = formData.get('location') as string
  const camera = formData.get('camera') as string
  const film = formData.get('film') as string
  const memo = formData.get('memo') as string
  const image_url = formData.get('image_url') as string
  const shot_date = formData.get('shot_date') as string

  await supabaseAdmin.from('photos').insert({
    title,
    tag: tag || null,
    location: location || null,
    camera: camera || null,
    film: film || null,
    memo: memo || null,
    image_url,
    shot_date: shot_date || null,
    is_public: false,  // 追加直後は非公開
  })

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function togglePhotoPublic(formData: FormData) {
  const id = formData.get('id') as string
  const isPublic = formData.get('isPublic') === 'true'

  await supabaseAdmin.from('photos').update({ is_public: !isPublic }).eq('id', id)

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function deletePhoto(formData: FormData) {
  const id = formData.get('id') as string

  await supabaseAdmin.from('photos').delete().eq('id', id)

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function updatePhoto(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const tag = formData.get('tag') as string
  const location = formData.get('location') as string
  const camera = formData.get('camera') as string
  const film = formData.get('film') as string
  const memo = formData.get('memo') as string
  const image_url = formData.get('image_url') as string
  const shot_date = formData.get('shot_date') as string

  await supabaseAdmin.from('photos').update({
    title,
    tag: tag || null,
    location: location || null,
    camera: camera || null,
    film: film || null,
    memo: memo || null,
    image_url,
    shot_date: shot_date || null,
  }).eq('id', id)

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function bulkAddPhotos(photos: {
  title: string
  image_url: string
  tag: string | null
  location: string | null
  camera: string | null
  film: string | null
}[]) {
  await supabaseAdmin.from('photos').insert(
    photos.map(p => ({ ...p, is_public: false }))
  )

  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}
