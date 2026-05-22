# tidagrain.

フィルムカメラで撮った写真を軸にしたライフスタイルブランドのECサイト。  
写真プリント・ポストカード・グッズの販売と、ギャラリー展示を行っています。

**ポートフォリオ用プロジェクト**

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| 決済 | Stripe Checkout |
| デプロイ | Vercel |

---

## 主な機能

- **ショップ** — 商品一覧（カテゴリフィルター）・商品詳細・カート・Stripe決済
- **ギャラリー** — 写真一覧（タグフィルター）・写真詳細
- **管理画面** — 商品・注文・写真の管理（ログイン必須）

---

## ページ構成

```
/               トップ（おすすめ商品・ギャラリープレビュー）
/shop           ショップ一覧
/shop/[id]      商品詳細
/gallery        ギャラリー一覧
/gallery/[id]   写真詳細
/about          ブランドについて
/cart           カート
/checkout       購入手続き（Stripe）
/complete       注文完了
/admin          管理画面（商品・注文管理）
/admin/gallery  写真管理
/admin/login    管理者ログイン
```

---

## ローカル環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

`http://localhost:3000` で確認できます。

### 必要な環境変数

`.env.local` を作成して以下を設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
```

---

## データベース

Supabase (PostgreSQL) を使用しています。テーブル構成：

- `photos` — ギャラリー写真
- `products` — 商品
- `product_variants` — 商品バリエーション（サイズ・フレーム）
- `orders` — 注文
- `order_items` — 注文明細
