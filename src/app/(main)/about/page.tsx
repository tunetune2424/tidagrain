// About ページ（/about）
// ブランドストーリー・コンセプト・制作プロセス・使用機材を紹介する静的ページ

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'tidagrain. のブランドストーリー。フィルムカメラへの想いと、光の粒を届けるまでの制作プロセスを紹介します。',
}

// -----------------------------------------------
// 制作プロセスのステップ（「how we make」セクション用）
// -----------------------------------------------
const PROCESS_STEPS = [
  {
    num: '01',
    title: 'フィルムで撮る',
    body: 'Nikon FM2 や Canon AE-1 を持って、日常や旅の風景を撮影します。すべてフィルムカメラ、デジタル補正なし。',
  },
  {
    num: '02',
    title: '丁寧に現像する',
    body: '信頼できる写真屋さんに現像を依頼し、フィルムの粒子感や色をそのままデータ化します。',
  },
  {
    num: '03',
    title: '商品にのせる',
    body: 'プリント・ポストカード・バッグ・アパレルに、一枚の写真を丁寧に落とし込みます。受注生産で一点ずつ。',
  },
]

// -----------------------------------------------
// 使用カメラ・フィルム一覧（「camera & film」セクション用）
// type で CAMERA / FILM を区別して表示スタイルを揃えている
// -----------------------------------------------
const GEAR = [
  { type: 'CAMERA', name: 'Nikon FM2', note: 'メインカメラ。シャッター音と重さが好き。' },
  { type: 'CAMERA', name: 'Canon AE-1', note: '旅のお供。軽くて使いやすい。' },
  { type: 'FILM', name: 'Kodak Portra 400', note: '肌色と光が美しい。一番よく使う。' },
  { type: 'FILM', name: 'Fuji Superia 400', note: '緑の発色が好き。日常スナップに。' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero：ブランドロゴを中央に重ねたフルビジュアル */}
      <section className="relative h-[56vh] overflow-hidden border-b border-border">
        {/* TODO: 本番画像に差し替える場合はSupabase Storageにアップロードして参照する */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1800&auto=format&fit=crop"
          alt=""
          className="film w-full h-full object-cover object-[center_40%]"
        />
        {/* 暗いオーバーレイでテキストを読みやすくする */}
        <div className="absolute inset-0 bg-[rgba(20,16,12,0.28)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] tracking-[0.24em] uppercase text-white/65 mb-4">about</p>
          {/* clamp() でビューポート幅に応じてフォントサイズが可変になる */}
          <h1
            className="font-serif-en text-white font-normal leading-[1.2]"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            tidagrain.
          </h1>
        </div>
      </section>

      {/* ブランドストーリー：縦長テキストで読ませるセクション */}
      <section className="max-w-[720px] mx-auto px-8 py-24">
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase mb-6">brand story</p>
        <h2 className="font-serif-en text-[40px] font-normal leading-[1.3] mb-12">
          光を、粒ごと<br />持ち歩きたかった。
        </h2>
        <div className="font-serif-jp text-[14px] leading-[3.2] text-muted2 space-y-8">
          <p>
            tidagrain. は、フィルムカメラを持って旅をするひとりの人間から生まれました。<br />
            デジタルには出せない「揺らぎ」がフィルムにはあります。<br />
            少しだけ露出がオーバーになった空の色、粒子が浮き上がる夕暮れの海。<br />
            そういう偶然の美しさを、手元に置いておきたいと思ったことが始まりです。
          </p>
          <p>
            「tida」は沖縄の言葉で「太陽」を意味します。<br />
            「grain」はフィルムの粒子。<br />
            光の粒を、日常のそばに届けたい。<br />
            そんな願いをそのまま名前にしました。
          </p>
          <p>
            写真プリントから始まり、ポストカード、バッグ、アパレルへ。<br />
            すべての商品に、実際に撮影した一枚のフィルム写真が宿っています。<br />
            量産ではなく、一枚一枚を丁寧に。<br />
            光の粒を、あなたのそばに。
          </p>
        </div>
      </section>

      {/* コンセプト：左写真 / 右テキストの2カラムレイアウト */}
      <section className="border-t border-b border-border">
        <div className="grid grid-cols-2">
          <div className="overflow-hidden h-[520px]">
            {/* TODO: 本番画像に差し替える場合はSupabase Storageにアップロードして参照する */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=900&auto=format&fit=crop"
              alt=""
              className="film w-full h-full object-cover"
            />
          </div>
          <div className="px-16 py-[72px] flex flex-col justify-center border-l border-border">
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase mb-5">concept</p>
            {/* <em> でイタリック体にしてタイポグラフィにリズムを出している */}
            <h2 className="font-serif-en text-[36px] font-normal leading-[1.4] mb-8">
              quiet light,<br /><em>slow living.</em>
            </h2>
            <p className="font-serif-jp text-[13px] leading-[3] text-muted2">
              忙しい日常の中でふと立ち止まり、<br />
              光を感じるきっかけになりますように。<br />
              丁寧に、静かに、少しだけ余白のある暮らし。<br />
              tidagrain. はそんな時間を届けるブランドです。
            </p>
          </div>
        </div>
      </section>

      {/* 制作プロセス：3ステップを横並びで表示 */}
      <section className="max-w-[1100px] mx-auto px-8 py-24">
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase text-center mb-10">how we make</p>
        <div className="grid grid-cols-3 border border-border">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.num}
              // 最後のカード以外に右ボーダーをつけて区切り線を作る
              className={`px-9 py-10 ${i < PROCESS_STEPS.length - 1 ? 'border-r border-border' : ''}`}
            >
              <p className="font-serif-en text-[48px] text-accent leading-[1] mb-4">{step.num}</p>
              <h3 className="text-[14px] font-normal tracking-[0.04em] mb-4">{step.title}</h3>
              <p className="font-serif-jp text-[12px] leading-[2.6] text-muted2">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用機材：カメラとフィルムをカードで紹介 */}
      <section className="border-t border-border py-20 px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase mb-6">camera & film</p>
          <h2 className="font-serif-en text-[36px] font-normal mb-10">使っているカメラとフィルム</h2>
          <div className="grid grid-cols-2 gap-6 text-left">
            {GEAR.map((g) => (
              <div key={g.name} className="border border-border p-7">
                {/* type（CAMERA / FILM）をラベルとして小さく表示 */}
                <p className="text-[11px] text-muted tracking-[0.06em] mb-[10px]">{g.type}</p>
                <p className="text-[15px] font-normal mb-[6px]">{g.name}</p>
                <p className="text-[12px] text-muted2 leading-[2]">{g.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせ：メールリンクのみのシンプルな構成 */}
      <section className="border-t border-border py-20 px-8 text-center">
        <h2 className="font-serif-en text-[36px] font-normal mb-4">contact</h2>
        <p className="font-serif-jp text-[13px] text-muted2 leading-[2.8] mb-9">
          ご質問・コラボレーションのご相談など、<br />お気軽にお問い合わせください。
        </p>
        <a
          href="mailto:hello@tidagrain.com"
          className="inline-block border border-t-text px-10 py-[14px] text-[12px] tracking-[0.12em] transition-all duration-300 hover:bg-t-text hover:text-bg"
        >
          hello@tidagrain.com
        </a>
      </section>
    </>
  )
}
