import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, FileText, BarChart3, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">広告クリエイティブ自動生成ツール</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              ヘルプ
            </Button>
            <Button size="sm">ログイン</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  N1インタビューから<span className="text-primary">ワンクリック</span>で広告生成
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  インタビュー録をアップロードするだけで、AIが課題・価値を抽出し、
                  最適な広告コピーとバナー画像を自動生成します。
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Link href="/interview">
                    <Button size="lg" className="gap-2">
                      <FileText className="h-4 w-4" />
                      インタビュー録をアップロード
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">ワークフロー</h2>
            <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">1. インタビュー分析</h3>
                      <p className="text-sm text-gray-500">
                        N1インタビュー録をアップロードし、AIが課題・価値を自動抽出
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M8 13h2" />
                        <path d="M8 17h2" />
                        <path d="M14 13h2" />
                        <path d="M14 17h2" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">2. ブリーフ作成</h3>
                      <p className="text-sm text-gray-500">
                        AIがサジェストしたペルソナ・課題・ベネフィットを確認・編集
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">3. クリエイティブ生成</h3>
                      <p className="text-sm text-gray-500">
                        AIがコピーを生成し、3種類×3サイズの計9パターンのバナー画像を自動合成
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <ThumbsUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">4. 評価・承認</h3>
                      <p className="text-sm text-gray-500">生成されたクリエイティブを評価し、クライアント承認を得る</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">5. 配信・分析</h3>
                      <p className="text-sm text-gray-500">
                        Meta Adsに入稿し、広告指標を自動取得してパフォーマンスを分析
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold">主な効果</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2v4" />
                        <path d="m16.24 7.76-2.12 2.12" />
                        <path d="M21 12h-4" />
                        <path d="m16.24 16.24-2.12-2.12" />
                        <path d="M12 18v4" />
                        <path d="m7.76 16.24 2.12-2.12" />
                        <path d="M3 12h4" />
                        <path d="m7.76 7.76 2.12 2.12" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">工数削減</h3>
                      <p className="text-sm text-gray-500">広告制作の工数を最大XX%削減し、リソースを新規案件に再配分</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2v4" />
                        <path d="M5 10H2" />
                        <path d="M5 14H2" />
                        <path d="M7 4.13 5.75 2.25" />
                        <path d="M17 4.13 18.25 2.25" />
                        <path d="M12 18v4" />
                        <path d="M19 10h3" />
                        <path d="M19 14h3" />
                        <path d="m17 19.87 1.25 1.88" />
                        <path d="m7 19.87-1.25 1.88" />
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">リードタイム短縮</h3>
                      <p className="text-sm text-gray-500">
                        配信開始が平均X営業日早まり、スタートアップの成長速度に貢献
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">品質向上</h3>
                      <p className="text-sm text-gray-500">
                        ブランドガイドラインに沿った一貫性のある広告で初動CTRを向上
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-center text-sm text-gray-500 md:text-left">
            © 2025 広告クリエイティブ自動生成ツール. 社内利用限定.
          </p>
          <p className="text-center text-sm text-gray-500 md:text-left">Version 0.1.0 (MVP)</p>
        </div>
      </footer>
    </div>
  )
}
