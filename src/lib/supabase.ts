import { createClient } from '@supabase/supabase-js'

// 環境変数から Supabase の接続情報を取得（.env.local に設定）
// NEXT_PUBLIC_ プレフィックスがついているものはブラウザからも参照可能
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 通常の操作に使うクライアント（Row Level Security が適用される）
// フロントエンドからの読み取り・ユーザー操作に使う
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 管理者権限のクライアント（Row Level Security を無視できる）
// ※ SUPABASE_SERVICE_ROLE_KEY は絶対にブラウザに渡してはいけない
// ※ サーバーサイド（API Routes / Server Actions）専用で使う
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
