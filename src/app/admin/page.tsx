export const dynamic = 'force-dynamic'

// Server Component: このファイルは「async function」なので自動的にサーバー側で実行される
// サーバー側で Supabase からデータを取得してから HTML を生成して返す

import { supabaseAdmin } from '@/lib/supabase'
import type { Product, Order } from '@/types'
import { toggleProductActive, deleteProduct, updateOrderStatus, signOut } from './actions'
import { SubmitButton } from './SubmitButton'

// カテゴリの英語キーを日本語表示に変換するマップ
const CATEGORY_LABEL: Record<string, string> = {
  print: 'フォトプリント',
  postcard: 'ポストカード',
  apparel: 'アパレル',
  goods: 'グッズ',
}

export default async function AdminPage() {
  // 商品一覧と注文一覧を同時に取得（Promise.all で並列実行して速くする）
  // 作成日の新しい順で取得
  const [{ data: products }, { data: orders }] = await Promise.all([
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>

      {/* ヘッダー：ロゴ・サイトへ戻るリンク・ログアウトボタン */}
      <header style={{ borderBottom: '1px solid #E5E1DC', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '0.04em' }}>tidagrain.</p>
          <p style={{ fontSize: '10px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>← サイトに戻る</a>
          {/* form で Server Action（signOut）を呼び出す */}
          <form action={signOut}>
            <button type="submit" style={{ fontSize: '11px', color: '#8B7B6A', background: 'none', border: '1px solid #E5E1DC', padding: '6px 14px', cursor: 'pointer' }}>
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px' }}>

        {/* ── 商品管理セクション ── */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
            Products / 商品管理
          </h2>
          <div style={{ border: '1px solid #E5E1DC' }}>
            {/* データが空のときは「ありません」と表示 */}
            {!products || products.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                商品データがありません
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={thStyle}>商品名</th>
                    <th style={thStyle}>カテゴリ</th>
                    <th style={thStyle}>価格</th>
                    <th style={thStyle}>公開状態</th>
                    <th style={thStyle}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {(products as Product[]).map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #E5E1DC' }}>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>{CATEGORY_LABEL[product.category] ?? product.category}</td>
                      <td style={tdStyle}>¥{product.price.toLocaleString()}</td>

                      {/* 公開/非公開トグルボタン：押すと toggleProductActive が呼ばれる */}
                      <td style={tdStyle}>
                        <form action={toggleProductActive}>
                          {/* hidden input でどの商品か・今の状態をサーバーに送る */}
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="isActive" value={String(product.is_active)} />
                          <SubmitButton style={{
                            fontSize: '11px', padding: '4px 12px',
                            border: '1px solid',
                            // 公開中は黒背景・非公開はグレー枠
                            borderColor: product.is_active ? '#1E1814' : '#E5E1DC',
                            background: product.is_active ? '#1E1814' : 'transparent',
                            color: product.is_active ? '#F7F4EF' : '#8B7B6A',
                          }}>
                            {product.is_active ? '公開中' : '非公開'}
                          </SubmitButton>
                        </form>
                      </td>

                      {/* 削除ボタン：押すと deleteProduct が呼ばれる */}
                      <td style={tdStyle}>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <SubmitButton style={{
                            fontSize: '11px', padding: '4px 12px',
                            border: '1px solid #E5E1DC', background: 'transparent', color: '#c0392b',
                          }}>
                            削除
                          </SubmitButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── 注文管理セクション ── */}
        <section>
          <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', marginBottom: '24px' }}>
            Orders / 注文管理
          </h2>
          <div style={{ border: '1px solid #E5E1DC' }}>
            {/* データが空のときは「ありません」と表示 */}
            {!orders || orders.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                注文データがありません
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={thStyle}>注文日</th>
                    <th style={thStyle}>氏名</th>
                    <th style={thStyle}>メール</th>
                    <th style={thStyle}>合計</th>
                    <th style={thStyle}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders as Order[]).map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #E5E1DC' }}>
                      <td style={tdStyle}>{new Date(order.created_at).toLocaleDateString('ja-JP')}</td>
                      <td style={tdStyle}>{order.name}</td>
                      <td style={tdStyle}>{order.email}</td>
                      <td style={tdStyle}>¥{order.total.toLocaleString()}</td>

                      {/* ステータス更新：ドロップダウンで選んで「更新」ボタンを押す */}
                      <td style={tdStyle}>
                        <form action={updateOrderStatus} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="hidden" name="id" value={order.id} />
                          {/* defaultValue で現在のステータスを初期選択状態にする */}
                          <select name="status" defaultValue={order.status} style={{
                            fontSize: '12px', border: '1px solid #E5E1DC',
                            padding: '4px 8px', background: 'transparent', color: '#1E1814', cursor: 'pointer',
                          }}>
                            <option value="pending">未払い</option>
                            <option value="paid">支払済</option>
                            <option value="shipped">発送済</option>
                            <option value="delivered">配達完了</option>
                          </select>
                          <SubmitButton style={{
                            fontSize: '11px', padding: '4px 12px',
                            border: '1px solid #E5E1DC', background: 'transparent', color: '#1E1814',
                          }}>
                            更新
                          </SubmitButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}

// テーブルのヘッダーセルに共通で適用するスタイル
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: '11px', color: '#8B7B6A', letterSpacing: '0.08em', fontWeight: 400,
}

// テーブルのデータセルに共通で適用するスタイル
const tdStyle: React.CSSProperties = {
  padding: '14px 16px', color: '#1E1814', verticalAlign: 'middle',
}
