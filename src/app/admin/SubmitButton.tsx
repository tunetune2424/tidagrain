'use client'

// useFormStatus：フォーム送信中かどうかを取得する React のフック
import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, style, confirmMessage }: {
  children: React.ReactNode
  style?: React.CSSProperties
  // 指定すると、クリック時に window.confirm でダイアログを出し、
  // 「キャンセル」を押した場合はフォーム送信を中止する（削除など取り消せない操作の誤操作防止）
  confirmMessage?: string
}) {
  // pending: ボタンを押してサーバーの処理が完了するまで true になる
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault()
        }
      }}
      style={{ ...style, opacity: pending ? 0.6 : 1, cursor: pending ? 'wait' : 'pointer' }}
    >
      {pending ? '処理中...' : children}
    </button>
  )
}
