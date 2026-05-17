// API ルート：Stripe の Checkout Session を作成する（POST /api/checkout）
// クライアントからカートの中身・配送情報を受け取り、Stripe のセッションを作って URL を返す
// ※ サーバーサイドのみで実行される（STRIPE_SECRET_KEY をブラウザに渡さないため）

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// シークレットキーで Stripe クライアントを初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
  const { items, shippingFee, customerInfo } = await req.json()

  // Stripe に渡す商品ラインアイテムを作成
  // price_data を使うことで Stripe 側に商品を事前登録しなくても決済できる
  const lineItems = items.map((item: {
    name: string
    price: number
    quantity: number
    image_url: string
  }) => ({
    price_data: {
      currency: 'jpy',          // 日本円
      unit_amount: item.price,  // 円は小数点なしでそのまま渡す（ドルは cents なので×100が必要）
      product_data: {
        name: item.name,
        images: [item.image_url],
      },
    },
    quantity: item.quantity,
  }))

  // 送料をラインアイテムとして追加
  if (shippingFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'jpy',
        unit_amount: shippingFee,
        product_data: { name: '送料', images: [] },
      },
      quantity: 1,
    })
  }

  // Stripe Checkout Session を作成
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    // 決済成功・キャンセル時のリダイレクト先
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    // 顧客情報を Stripe に渡す（注文履歴に表示される）
    customer_email: customerInfo.email,
    metadata: {
      name: `${customerInfo.lastName} ${customerInfo.firstName}`,
      postal_code: customerInfo.postalCode,
      prefecture: customerInfo.prefecture,
      city: customerInfo.city,
      address_line: customerInfo.addressLine,
      phone: customerInfo.phone,
      shipping_method: customerInfo.shippingMethod,
    },
  })

  // セッション URL をクライアントに返す → フロントはここにリダイレクトする
  return NextResponse.json({ url: session.url })

  } catch (err) {
    // エラー内容をターミナルに出力してデバッグできるようにする
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
