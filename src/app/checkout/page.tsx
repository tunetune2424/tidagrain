'use client'

// チェックアウトページ（/checkout）
// お届け先情報・配送方法の入力フォーム + 注文サマリー

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

// -----------------------------------------------
// 都道府県リスト（セレクトボックス用）
// -----------------------------------------------
const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]

// -----------------------------------------------
// 配送方法の選択肢
// id: フォーム送信時に使う識別子
// fee: 送料（円）
// -----------------------------------------------
const SHIPPING_METHODS = [
  { id: 'yamato', label: 'ヤマト運輸（宅急便）', note: '2〜3営業日でお届け', fee: 600 },
  { id: 'nekopos', label: 'ネコポス', note: 'ポストカードのみ対応・3〜5営業日', fee: 200 },
]

// -----------------------------------------------
// ステッパー：現在のステップを視覚的に表示するコンポーネント
// status: 'done' | 'active' | 'inactive'
// -----------------------------------------------
function Step({ num, label, status }: { num: string; label: string; status: 'done' | 'active' | 'inactive' }) {
  const isDone = status === 'done'
  const isActive = status === 'active'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isActive ? 'var(--text)' : 'var(--muted)' }}>
      {/* ステップ番号の丸アイコン */}
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `1px solid ${isDone ? 'var(--accent)' : isActive ? 'var(--text)' : 'var(--border)'}`,
        background: isDone ? 'var(--accent)' : isActive ? 'var(--text)' : 'transparent',
        color: isDone || isActive ? 'var(--bg)' : 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
      }}>
        {isDone ? '✓' : num}
      </div>
      <span>{label}</span>
    </div>
  )
}

// ステッパーの区切り線
function StepLine() {
  return <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '0 12px' }} />
}

// フォーム入力欄の共通スタイル（ラベル + input + エラーメッセージをセットにする）
// error が渡されたときだけエラーメッセージと赤いボーダーを表示する
function FormGroup({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>
        {label}
        {required && <span style={{ color: '#c0392b', marginLeft: 4 }}>*</span>}
      </label>
      {children}
      {/* error があるときだけ赤字でメッセージを表示 */}
      {error && <p style={{ fontSize: 11, color: '#c0392b', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

// input / select に共通で当てるスタイル
// hasError が true のときはボーダーを赤くする
const getInputStyle = (hasError?: boolean): React.CSSProperties => ({
  border: `1px solid ${hasError ? '#c0392b' : 'var(--border)'}`,
  background: 'transparent',
  padding: '12px 14px',
  fontSize: 13,
  fontFamily: "'Noto Sans JP', sans-serif",
  fontWeight: 300,
  outline: 'none',
  color: 'var(--text)',
  width: '100%',
})

export default function CheckoutPage() {
  const { items, subtotal } = useCart()

  // -----------------------------------------------
  // フォームの入力値を state で管理
  // -----------------------------------------------
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [city, setCity] = useState('')
  const [addressLine, setAddressLine] = useState('')

  // touched: 一度でもフォーカスを外したフィールドを記録する
  // → 最初から全フィールドにエラーが出ないようにするため
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const touch = (name: string) => setTouched(prev => ({ ...prev, [name]: true }))

  // 各フィールドのバリデーション（touched のときだけエラーを返す）
  const errors = {
    email: touched.email && (!email ? '必須項目です' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '正しいメールアドレスを入力してください' : ''),
    lastName: touched.lastName && !lastName ? '必須項目です' : '',
    firstName: touched.firstName && !firstName ? '必須項目です' : '',
    // 電話番号は任意だが、入力があれば形式チェックする
    phone: touched.phone && phone && !/^[0-9]{10,11}$/.test(phone.replace(/-/g, '')) ? 'ハイフンあり・なしで10〜11桁で入力してください' : '',
    postalCode: touched.postalCode && (!postalCode ? '必須項目です' : !/^\d{3}-?\d{4}$/.test(postalCode) ? '000-0000 の形式で入力してください' : ''),
    prefecture: touched.prefecture && !prefecture ? '必須項目です' : '',
    city: touched.city && !city ? '必須項目です' : '',
    addressLine: touched.addressLine && !addressLine ? '必須項目です' : '',
  }

  // 選択中の配送方法（デフォルトはヤマト運輸）
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].id)

  // 選択中の配送方法オブジェクト（送料の計算に使う）
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === shippingMethod)!

  // 金額計算
  const shipping = selectedShipping.fee
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // API ルートにカート情報・配送情報を送って Stripe の URL をもらう
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // カートの中身を Stripe が受け取れる形に整形
        items: items.map(item => ({
          name: item.product.name,
          price: item.variant?.price_override ?? item.product.price,
          quantity: item.quantity,
          image_url: item.product.image_url,
        })),
        shippingFee: selectedShipping.fee,
        customerInfo: {
          email,
          lastName,
          firstName,
          phone,
          postalCode,
          prefecture,
          city,
          addressLine,
          shippingMethod,
        },
      }),
    })

    const data = await res.json()

    // API がエラーを返したとき（Stripe のバリデーションエラーなど）はアラートで知らせる
    if (!res.ok || !data.url) {
      alert(`エラーが発生しました：${data.error ?? '不明なエラー'}`)
      return
    }

    // Stripe の決済ページへリダイレクト（外部URLなので window.location を使う）
    window.location.href = data.url
  }

  return (
    <div>
      {/* チェックアウト専用ヘッダー（ナビなし・ロゴとカートへ戻るリンクのみ） */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="font-serif-en" style={{ fontSize: 22, letterSpacing: '0.04em' }}>
            tidagrain.
          </Link>
          <Link href="/cart" style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            カートに戻る
          </Link>
        </div>
      </header>

      {/* ステッパー：カート → お届け先（現在） → お支払い → 確認・完了 */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Step num="1" label="カート" status="done" />
          <StepLine />
          <Step num="2" label="お届け先" status="active" />
          <StepLine />
          <Step num="3" label="お支払い" status="inactive" />
          <StepLine />
          <Step num="4" label="確認・完了" status="inactive" />
        </div>
      </div>

      {/* メインコンテンツ：左フォーム / 右サマリー */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px 96px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64, alignItems: 'start' }}>

            {/* 左：入力フォーム */}
            <div>

              {/* 連絡先情報 */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 15, fontWeight: 400, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  連絡先情報
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FormGroup label="メールアドレス" required error={errors.email || ''}>
                    <input type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => touch('email')}
                      placeholder="example@email.com"
                      style={getInputStyle(!!errors.email)} />
                  </FormGroup>
                  {/* 姓・名を横並びに */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <FormGroup label="姓" required error={errors.lastName || ''}>
                      <input type="text" value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        onBlur={() => touch('lastName')}
                        placeholder="山田"
                        style={getInputStyle(!!errors.lastName)} />
                    </FormGroup>
                    <FormGroup label="名" required error={errors.firstName || ''}>
                      <input type="text" value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        onBlur={() => touch('firstName')}
                        placeholder="太郎"
                        style={getInputStyle(!!errors.firstName)} />
                    </FormGroup>
                  </div>
                  <FormGroup label="電話番号" error={errors.phone || ''}>
                    <input type="tel" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onBlur={() => touch('phone')}
                      placeholder="090-0000-0000"
                      style={getInputStyle(!!errors.phone)} />
                  </FormGroup>
                </div>
              </div>

              {/* お届け先住所 */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 15, fontWeight: 400, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  お届け先住所
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FormGroup label="郵便番号" required error={errors.postalCode || ''}>
                    <input type="text" value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      onBlur={() => touch('postalCode')}
                      placeholder="000-0000"
                      style={{ ...getInputStyle(!!errors.postalCode), maxWidth: 200 }} />
                  </FormGroup>
                  <FormGroup label="都道府県" required error={errors.prefecture || ''}>
                    <select value={prefecture}
                      onChange={e => setPrefecture(e.target.value)}
                      onBlur={() => touch('prefecture')}
                      style={{ ...getInputStyle(!!errors.prefecture), maxWidth: 200, cursor: 'pointer' }}>
                      <option value="">選択してください</option>
                      {PREFECTURES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </FormGroup>
                  <FormGroup label="市区町村" required error={errors.city || ''}>
                    <input type="text" value={city}
                      onChange={e => setCity(e.target.value)}
                      onBlur={() => touch('city')}
                      placeholder="渋谷区"
                      style={getInputStyle(!!errors.city)} />
                  </FormGroup>
                  <FormGroup label="番地・建物名" required error={errors.addressLine || ''}>
                    <input type="text" value={addressLine}
                      onChange={e => setAddressLine(e.target.value)}
                      onBlur={() => touch('addressLine')}
                      placeholder="1-2-3 ○○マンション 101号室"
                      style={getInputStyle(!!errors.addressLine)} />
                  </FormGroup>
                </div>
              </div>

              {/* 配送方法 */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 15, fontWeight: 400, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  配送方法
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {SHIPPING_METHODS.map(method => (
                    // 選択中の配送方法だけボーダーを濃くして強調
                    <label
                      key={method.id}
                      style={{
                        border: `1px solid ${shippingMethod === method.id ? 'var(--text)' : 'var(--border)'}`,
                        padding: '16px 20px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="radio" name="shipping" value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          style={{ accentColor: 'var(--text)' }}
                        />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 400, marginBottom: 2 }}>{method.label}</p>
                          <p style={{ fontSize: 11, color: 'var(--muted)' }}>{method.note}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 13 }}>¥{method.fee.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                style={{
                  width: '100%', padding: 16,
                  background: 'var(--text)', color: 'var(--bg)',
                  fontSize: 13, letterSpacing: '0.1em',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300,
                }}
              >
                お支払い方法へ進む
              </button>
              {/* Stripe についての説明（ユーザーの不安を和らげるための一言） */}
              <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 12, lineHeight: 2 }}>
                次のページでStripeの安全な決済画面に移動します。<br />
                カード情報はStripeが管理し、当サイトには保存されません。
              </p>
            </div>

            {/* 右：注文サマリー（スクロールしてもついてくる） */}
            <div style={{ border: '1px solid var(--border)', padding: 28, position: 'sticky', top: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 400, marginBottom: 20 }}>注文内容の確認</h2>

              {/* カートのアイテム一覧 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                {items.map(item => {
                  const price = item.variant?.price_override ?? item.product.price
                  const key = `${item.product.id}-${item.variant?.id ?? 'no-variant'}`
                  return (
                    <div key={key} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {/* 商品画像（数量バッジ付き） */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          style={{ width: 56, height: 56, objectFit: 'cover', border: '1px solid var(--border)', filter: 'sepia(18%) saturate(82%) contrast(96%) brightness(98%)' }}
                        />
                        {/* 数量バッジ */}
                        <span style={{
                          position: 'absolute', top: -6, right: -6,
                          width: 18, height: 18, background: 'var(--muted)',
                          borderRadius: '50%', fontSize: 10, color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {item.quantity}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* テキストが長い場合は省略記号で切る */}
                        <p style={{ fontSize: 12, fontWeight: 400, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name}
                        </p>
                        {item.variant && (
                          <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {[item.variant.size, item.variant.frame].filter(Boolean).join(' / ')}
                          </p>
                        )}
                      </div>
                      <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                        ¥{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* 金額内訳 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted2)' }}>小計</span>
                  <span>¥{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted2)' }}>送料</span>
                  <span>¥{shipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted2)' }}>消費税</span>
                  <span>¥{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* 合計 */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 400 }}>合計</span>
                <span style={{ fontSize: 20, fontWeight: 400 }}>¥{total.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </form>
      </section>
    </div>
  )
}
