export const dynamic = 'force-dynamic'

// Server Component: このファイルは「async function」なので自動的にサーバー側で実行される
// サーバー側で Supabase からデータを取得してから HTML を生成して返す

import { supabaseAdmin } from '@/lib/supabase'
import type { Product, Order } from '@/types'
import { toggleProductActive, toggleProductFeatured, deleteProduct, updateOrderStatus, signOut } from './actions'
import { SubmitButton } from './SubmitButton'
import { AddProductForm } from './AddProductForm'

// カテゴリの英語キーを日本語表示に変換するマップ
const CATEGORY_LABEL: Record<string, string> = {
  print: 'フォトプリント',
  postcard: 'ポストカード',
  apparel: 'アパレル',
  goods: 'グッズ',
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '未払い',
  paid: '支払済',
  shipped: '発送済',
  delivered: '配達完了',
}

type SearchParams = {
  q?: string
  category?: string
  status?: string
  orderQ?: string
  orderStatus?: string
}

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const q = searchParams.q?.trim() ?? ''
  const category = searchParams.category ?? ''
  const status = searchParams.status ?? ''
  const orderQ = searchParams.orderQ?.trim() ?? ''
  const orderStatus = searchParams.orderStatus ?? ''

  // 商品一覧クエリ：検索キーワード・カテゴリ・公開状態で絞り込む
  let productQuery = supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .order('name', { ascending: true })
  if (q) productQuery = productQuery.ilike('name', `%${q}%`)
  if (category) productQuery = productQuery.eq('category', category)
  if (status === 'active') productQuery = productQuery.eq('is_active', true)
  if (status === 'inactive') productQuery = productQuery.eq('is_active', false)

  // 注文一覧クエリ：検索キーワード（氏名・メール）・ステータスで絞り込む
  let orderQuery = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
  if (orderQ) orderQuery = orderQuery.or(`name.ilike.%${orderQ}%,email.ilike.%${orderQ}%`)
  if (orderStatus) orderQuery = orderQuery.eq('status', orderStatus)

  // 商品一覧と注文一覧を同時に取得（Promise.all で並列実行して速くする）
  const [{ data: products }, { data: orders }] = await Promise.all([productQuery, orderQuery])

  const hasProductFilter = Boolean(q || category || status)
  const hasOrderFilter = Boolean(orderQ || orderStatus)

  return (
    <div style={{ backgroundColor: '#F7F4EF', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>

      {/* ヘッダー：ロゴ・サイトへ戻るリンク・ログアウトボタン */}
      <header style={{ borderBottom: '1px solid #E5E1DC', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '0.04em' }}>tidagrain.</p>
          <p style={{ fontSize: '10px', color: '#8B7B6A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>admin dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/admin/gallery" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>写真管理</a>
          <a href="/" style={{ fontSize: '11px', color: '#8B7B6A', textDecoration: 'none' }}>← サイトに戻る</a>
          {/* form で Server Action（signOut）を呼び出す */}
          <form action={signOut}>
            <button type="submit" style={{ fontSize: '11px', color: '#8B7B6A', background: 'none', border: '1px solid #E5E1DC', padding: '6px 14px', cursor: 'pointer' }}>
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(24px, 6vw, 48px) clamp(16px, 4vw, 32px)' }}>

        {/* ── 商品管理セクション ── */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
              Products / 商品管理
            </h2>
            <span style={{ fontSize: '11px', color: '#8B7B6A' }}>{products?.length ?? 0}件</span>
          </div>

          {/* 検索・絞り込みフォーム（GETで送信してURLに条件を残す。JSなしで動作） */}
          <form
            method="get"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
              marginBottom: '12px', padding: '12px', border: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <input
              name="q"
              defaultValue={q}
              placeholder="商品名で検索"
              style={{ ...filterInputStyle, flex: '1 1 160px' }}
            />
            <select name="category" defaultValue={category} style={{ ...filterInputStyle, flex: '0 1 140px' }}>
              <option value="">すべてのカテゴリ</option>
              {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select name="status" defaultValue={status} style={{ ...filterInputStyle, flex: '0 1 120px' }}>
              <option value="">すべての状態</option>
              <option value="active">公開中のみ</option>
              <option value="inactive">非公開のみ</option>
            </select>
            <button type="submit" style={filterButtonStyle}>絞り込む</button>
            {hasProductFilter && (
              <a href="/admin" style={filterResetStyle}>条件をクリア</a>
            )}
          </form>

          <div style={{ border: '1px solid #E5E1DC', overflowX: 'auto' }}>
            {/* データが空のときは「ありません」と表示 */}
            {!products || products.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                {hasProductFilter ? '条件に一致する商品がありません' : '商品データがありません'}
              </p>
            ) : (
              <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <th style={thStyle}>商品名</th>
                    <th style={thStyle}>カテゴリ</th>
                    <th style={thStyle}>価格</th>
                    <th style={thStyle}>おすすめ</th>
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

                      {/* おすすめトグル：押すと toggleProductFeatured が呼ばれる */}
                      <td style={tdStyle}>
                        <form action={toggleProductFeatured}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="isFeatured" value={String(product.is_featured)} />
                          <SubmitButton style={{
                            fontSize: '11px', padding: '4px 12px',
                            border: '1px solid',
                            borderColor: product.is_featured ? '#c9a84c' : '#E5E1DC',
                            background: product.is_featured ? '#fdf6e3' : 'transparent',
                            color: product.is_featured ? '#c9a84c' : '#8B7B6A',
                          }}>
                            {product.is_featured ? '★ おすすめ' : '☆'}
                          </SubmitButton>
                        </form>
                      </td>

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

                      {/* 削除ボタン：押すと deleteProduct が呼ばれる（誤操作防止のため確認ダイアログを挟む） */}
                      <td style={tdStyle}>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <SubmitButton
                            confirmMessage={`「${product.name}」を削除します。この操作は取り消せません。よろしいですか？`}
                            style={{
                              fontSize: '11px', padding: '4px 12px',
                              border: '1px solid #E5E1DC', background: 'transparent', color: '#c0392b',
                            }}
                          >
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



        <AddProductForm />


        {/* ── 注文管理セクション ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#8B7B6A', textTransform: 'uppercase', margin: 0 }}>
              Orders / 注文管理
            </h2>
            <span style={{ fontSize: '11px', color: '#8B7B6A' }}>{orders?.length ?? 0}件</span>
          </div>

          {/* 注文の検索・絞り込みフォーム */}
          <form
            method="get"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
              marginBottom: '12px', padding: '12px', border: '1px solid #E5E1DC', backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <input
              name="orderQ"
              defaultValue={orderQ}
              placeholder="氏名・メールで検索"
              style={{ ...filterInputStyle, flex: '1 1 160px' }}
            />
            <select name="orderStatus" defaultValue={orderStatus} style={{ ...filterInputStyle, flex: '0 1 140px' }}>
              <option value="">すべてのステータス</option>
              {Object.entries(ORDER_STATUS_LABEL).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button type="submit" style={filterButtonStyle}>絞り込む</button>
            {hasOrderFilter && (
              <a href="/admin" style={filterResetStyle}>条件をクリア</a>
            )}
          </form>

          <div style={{ border: '1px solid #E5E1DC', overflowX: 'auto' }}>
            {/* データが空のときは「ありません」と表示 */}
            {!orders || orders.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', fontSize: '13px', color: '#8B7B6A' }}>
                {hasOrderFilter ? '条件に一致する注文がありません' : '注文データがありません'}
              </p>
            ) : (
              <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontSize: '13px' }}>
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
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid #E5E1DC',
                        // 未払いの注文は背景色でひと目でわかるようにする（要対応の見落とし防止）
                        backgroundColor: order.status === 'pending' ? '#FDF6E3' : undefined,
                      }}
                    >
                      <td style={tdStyle}>{new Date(order.created_at).toLocaleDateString('ja-JP')}</td>
                      <td style={tdStyle}>{order.name}</td>
                      <td style={tdStyle}>{order.email}</td>
                      <td style={tdStyle}>¥{order.total.toLocaleString()}</td>

                      {/* ステータス更新：ドロップダウンで選んで「更新」ボタンを押す */}
                      <td style={tdStyle}>
                        <form action={updateOrderStatus} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
  whiteSpace: 'nowrap',
}

// テーブルのデータセルに共通で適用するスタイル
const tdStyle: React.CSSProperties = {
  padding: '14px 16px', color: '#1E1814', verticalAlign: 'middle',
}

// 検索・絞り込みフォームの入力欄に共通で適用するスタイル
const filterInputStyle: React.CSSProperties = {
  fontSize: '12px', padding: '7px 10px',
  border: '1px solid #E5E1DC', background: '#FFFFFF',
  color: '#1E1814', outline: 'none', minWidth: 0,
}

const filterButtonStyle: React.CSSProperties = {
  fontSize: '11px', padding: '7px 16px',
  border: '1px solid #1E1814', background: '#1E1814', color: '#F7F4EF', cursor: 'pointer',
}

const filterResetStyle: React.CSSProperties = {
  fontSize: '11px', color: '#8B7B6A', textDecoration: 'underline',
}
