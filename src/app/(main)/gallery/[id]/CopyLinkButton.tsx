'use client'

export function CopyLinkButton() {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(window.location.href)}
      className="flex-1 py-[10px] border border-border text-[11px] tracking-[0.08em] text-muted2 hover:border-t-text transition-colors"
    >
      リンクをコピー
    </button>
  )
}
