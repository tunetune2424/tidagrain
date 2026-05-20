'use client'

// useFormStatus：フォーム送信中かどうかを取得する React のフック
import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, style }: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  // pending: ボタンを押してサーバーの処理が完了するまで true になる
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ...style, opacity: pending ? 0.6 : 1, cursor: pending ? 'wait' : 'pointer' }}
    >
      {pending ? '処理中...' : children}
    </button>
  )
}
