"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState("text")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [textContent, setTextContent] = useState(`【N1インタビュー録：健康食品スタートアップ】

Q: 普段の食生活について教えてください。
A: 平日は朝食を取る時間がなく、昼食は会社近くのコンビニやカフェで済ませることが多いです。夜も残業が多く、帰りが遅いと出前を頼んだり、コンビニ弁当になりがちです。週末は自炊することもありますが、忙しいとそれも難しいですね。

Q: 健康面で気になることはありますか？
A: 最近疲れやすくなったのが気になります。栄養が偏っているのかなと思うんですが、バランスの良い食事を毎日作る時間がないんです。健康診断でも少し数値が悪くなってきていて、このままではマズいなと感じています。

Q: 理想的な食生活はどのようなものですか？
A: 時間をかけずに栄養バランスの取れた食事ができればいいなと思います。特に平日の忙しい時でも、手軽に健康的な食事が摂れる方法があれば助かります。サプリメントだけでなく、ちゃんとした食事として楽しめるものが理想です。

Q: 今までどんな解決策を試しましたか？
A: ミールキットを試したことがありますが、結局調理する時間が必要で続きませんでした。完全食のドリンクも試しましたが、毎食それだけだと飽きてしまって…。あとは冷凍宅配弁当サービスも使ったことがありますが、味が今一つで長続きしませんでした。

Q: 理想的なサービスがあれば、どのくらいの予算を使いますか？
A: 本当に時短になって、栄養もしっかり摂れて、おいしければ、月に2万円くらいまでなら出せると思います。健康は大事ですし、外食するよりは安く済むかなと。`)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // ファイルが選択されたことを示すモックデータ
  const [mockFileName, setMockFileName] = useState("N1インタビュー録_健康食品.mp3")
  const [mockFileSize, setMockFileSize] = useState(3240) // KB
  const router = useRouter()

  const handleTextUpload = () => {
    if (!textContent.trim()) return

    setIsAnalyzing(true)
    // 実際の実装ではここでAPIリクエストを行い、テキスト分析を実行
    setTimeout(() => {
      setIsAnalyzing(false)
      router.push("/brief?source=interview")
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileSubmit = () => {
    if (!selectedFile && !mockFileName) return

    setIsUploading(true)
    // 実際の実装ではここでファイルアップロードとAPIリクエストを行う
    setTimeout(() => {
      setIsUploading(false)
      setIsAnalyzing(true)
      // 分析処理
      setTimeout(() => {
        setIsAnalyzing(false)
        router.push("/brief?source=interview")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ホームに戻る
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">N1インタビュー録のアップロード</CardTitle>
          <CardDescription>
            インタビュー録をアップロードして、AIに課題と価値を抽出させましょう。
            テキストを直接入力するか、音声/テキストファイルをアップロードできます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                テキスト入力
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                ファイルアップロード
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="N1インタビューの内容をここに貼り付けてください..."
                  className="min-h-[300px]"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleTextUpload} disabled={!textContent.trim() || isAnalyzing} className="gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        テキストを分析
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="file" className="mt-6">
              <div className="space-y-6">
                <div className="grid w-full gap-2">
                  <label htmlFor="file-upload" className="text-sm font-medium">
                    音声ファイル (.mp3, .wav) またはテキストファイル (.txt, .docx)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input id="file-upload" type="file" accept=".mp3,.wav,.txt,.docx" onChange={handleFileUpload} />
                    {(selectedFile || mockFileName) && (
                      <div className="text-sm text-gray-500">
                        {selectedFile
                          ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`
                          : `${mockFileName} (${mockFileSize} KB)`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleFileSubmit}
                    disabled={(!selectedFile && !mockFileName) || isUploading || isAnalyzing}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        アップロード中...
                      </>
                    ) : isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        ファイルをアップロード
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium mb-2">インタビュー録がない場合</h3>
            <p className="text-sm text-gray-500 mb-4">
              インタビュー録をスキップして、直接ブリーフを作成することもできます。
            </p>
            <Link href="/brief">
              <Button variant="outline">ブリーフ作成に進む</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
