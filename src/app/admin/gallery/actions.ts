'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'

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
