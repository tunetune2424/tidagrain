import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

// Cloudflare R2 は S3 互換 API を提供しているため、AWS の S3 SDK でそのまま操作できる。
// サーバーサイド専用（アクセスキー等の秘密情報を含むため、'use client' なファイルからは絶対に import しないこと）

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
const R2_ENDPOINT = process.env.R2_ENDPOINT!
// パブリックアクセス用のベースURL（r2.devの公開URL、または独自ドメイン）
// 例: https://pub-xxxxxxxx.r2.dev  または  https://cdn.example.com
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export class R2UploadError extends Error {}

// ファイル（Buffer）をR2にアップロードし、公開URLを返す
// 失敗時は例外を投げる（呼び出し側で必ずtry/catchすること。エラーを握りつぶして
// 成功として扱うことは絶対にしない）
export async function uploadFileToR2(params: {
  buffer: Buffer
  key: string
  contentType: string
}): Promise<string> {
  const { buffer, key, contentType } = params

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_ENDPOINT || !R2_PUBLIC_URL) {
    throw new R2UploadError(
      'R2の環境変数が設定されていません。.env.local に R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_ENDPOINT / R2_PUBLIC_URL を設定してください。'
    )
  }

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )
  } catch (err) {
    // 失敗をそのまま握りつぶさず、原因が分かるメッセージを付けて再throwする
    throw new R2UploadError(
      `R2へのアップロードに失敗しました（key: ${key}）: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
}

// R2からファイルを削除する
export async function deleteFileFromR2(key: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    )
  } catch (err) {
    throw new R2UploadError(
      `R2からの削除に失敗しました（key: ${key}）: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

// 公開URLからR2オブジェクトのkeyを逆算する（削除時などに使う）
export function extractR2KeyFromUrl(url: string): string | null {
  if (!R2_PUBLIC_URL) return null
  const base = R2_PUBLIC_URL.replace(/\/$/, '')
  if (!url.startsWith(base + '/')) return null
  return url.slice(base.length + 1)
}

export type R2Object = {
  key: string
  url: string
  size: number
  lastModified: string | null
}

// 指定したprefix配下のオブジェクト一覧をR2から取得する（画像ライブラリ一覧表示用）
// S3互換のListObjectsV2 APIをそのまま使う（DBを介さず、R2を一次情報源として一覧を取得する）
// 失敗時は例外を投げる（呼び出し側で必ずtry/catchすること）
export async function listObjectsFromR2(prefix: string): Promise<R2Object[]> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_ENDPOINT || !R2_PUBLIC_URL) {
    throw new R2UploadError(
      'R2の環境変数が設定されていません。.env.local に R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_ENDPOINT / R2_PUBLIC_URL を設定してください。'
    )
  }

  const base = R2_PUBLIC_URL.replace(/\/$/, '')
  const results: R2Object[] = []
  let continuationToken: string | undefined

  try {
    do {
      const res = await r2Client.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      )

      for (const obj of res.Contents ?? []) {
        if (!obj.Key) continue
        results.push({
          key: obj.Key,
          url: `${base}/${obj.Key}`,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ? obj.LastModified.toISOString() : null,
        })
      }

      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
    } while (continuationToken)
  } catch (err) {
    throw new R2UploadError(
      `R2のオブジェクト一覧取得に失敗しました（prefix: ${prefix}）: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  // 新しいものが先頭に来るように並び替える
  results.sort((a, b) => (b.lastModified ?? '').localeCompare(a.lastModified ?? ''))

  return results
}
