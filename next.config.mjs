/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image で使用する外部画像ホストを許可リストに追加
    // 新しいホストを使う場合はここに追記する
    remotePatterns: [
      { hostname: 'i.imgur.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: '*.r2.dev' }, // Cloudflare R2の公開URL（pub-xxxxxxxx.r2.dev）
      // 独自ドメインでR2を配信する場合は、そのホスト名をここに追加する
    ],
  },
}

export default nextConfig;
