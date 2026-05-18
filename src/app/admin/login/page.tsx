'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function AdminLoginPage() {
  const router = useRouter()
  // middleware が付与した callbackUrl を取得（なければ /admin にフォールバック）
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // createBrowserClient でログイン → Cookie にトークンが保存される
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    const callbackUrl = searchParams.get('callbackUrl') ?? '/admin'
    router.push(callbackUrl)
  }


  return (
    // 画面全体：中央揃え・背景色
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>

        {/* ロゴ */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', letterSpacing: '0.04em', marginBottom: '6px' }}>tidagrain.</p>
          <p style={{ fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin</p>
        </div>

        {/* フォームカード */}
        <div style={{ border: '1px solid #E5E1DC', padding: '40px' }}>
          <h1 style={{ fontSize: '15px', fontWeight: 400, marginBottom: '32px', textAlign: 'center' }}>管理者ログイン</h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* メールアドレス */}
            <div>
              <p style={{ fontSize: '11px', color: '#8B7B6A', marginBottom: '6px', letterSpacing: '0.06em' }}>メールアドレス</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tidagrain.com"
                required
                style={{ border: '1px solid #E5E1DC', background: 'transparent', padding: '12px 14px', fontSize: '13px', outline: 'none', color: '#1E1814', width: '100%' }}
              />
            </div>

            {/* パスワード */}
            <div>
              <p style={{ fontSize: '11px', color: '#8B7B6A', marginBottom: '6px', letterSpacing: '0.06em' }}>パスワード</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ border: '1px solid #E5E1DC', background: 'transparent', padding: '12px 14px', fontSize: '13px', outline: 'none', color: '#1E1814', width: '100%' }}
              />
            </div>

            {/* エラーメッセージ */}
            {error && <p style={{ fontSize: '12px', color: '#c0392b' }}>{error}</p>}

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#1E1814', color: '#F7F4EF', fontSize: '12px', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>


          </form>
        </div>

        {/* サイトに戻るリンク */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px' }}>
          <a href="/" style={{ color: '#8B7B6A' }}>← サイトに戻る</a>
        </p>


      </div>
    </div>
  )

}
