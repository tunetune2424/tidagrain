/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image で使用する外部画像ホストを許可リストに追加
    // 新しいホストを使う場合はここに追記する
    remotePatterns: [
      { hostname: 'i.imgur.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig;
