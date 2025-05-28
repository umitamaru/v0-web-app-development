"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { createInterview, updateInterviewAnalysisStatus } from "@/lib/supabaseUtils"

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
  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null)
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // ユーザーの認証状態を確認
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      
      if (data?.session?.user) {
        setCurrentUser({
          id: data.session.user.id
        })
      }
      // 実際の実装では未認証の場合はログインページにリダイレクト
      // else {
      //   router.push('/login')
      // }
    }
    
    checkUser()
  }, [router])

  const handleTextUpload = async () => {
    if (!textContent.trim()) return
    setIsAnalyzing(true)
    
    try {
      // デモ用に仮のユーザーIDを使用（実際の実装では認証済みユーザーIDを使用）
      const userId = currentUser?.id || 'demo-user-id'
      
      // Supabaseにインタビューを保存
      const { data: interview, error: createError } = await createInterview(
        'インタビュー録', // タイトル
        textContent, // 内容
        userId
      )
      
      if (createError) {
        throw createError
      }
      
      setInterviewId(interview.id)
      
      // AIによる分析処理（実際の実装ではここでAPIを呼び出す）
      setTimeout(async () => {
        // 分析結果のモックデータ
        const mockAnalysisResult = {
          persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
          problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
          benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
          requiredWords: "時短,栄養,健康,簡単",
        }
        
        // 分析結果を保存
        if (interview?.id) {
          await updateInterviewAnalysisStatus(
            interview.id,
            'completed',
            mockAnalysisResult
          )
        }
        
        setIsAnalyzing(false)
        router.push(`/brief?source=interview&id=${interview?.id || ''}`)
      }, 3000)
      
    } catch (err: any) {
      console.error('インタビュー処理エラー:', err)
      setError(err.message || 'インタビュー処理中にエラーが発生しました。')
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileSubmit = async () => {
    if (!selectedFile && !mockFileName) return

    setIsUploading(true)
    
    try {
      // 実際の実装ではここでSupabase Storageにファイルをアップロード
      setTimeout(async () => {
        setIsUploading(false)
        setIsAnalyzing(true)
        
        // デモ用に仮のユーザーIDとファイルURLを使用
        const userId = currentUser?.id || 'demo-user-id'
        const mockFileUrl = `https://storage.example.com/interviews/${mockFileName}`
        
        // Supabaseにインタビューを保存
        const { data: interview, error: createError } = await createInterview(
          mockFileName, // タイトル
          '音声ファイルから抽出されたテキスト（実際の実装では音声認識APIを使用）', // 内容
          userId,
          mockFileUrl,
          'audio/mp3'
        )
        
        if (createError) {
          throw createError
        }
        
        setInterviewId(interview.id)
        
        // AIによる分析処理（実際の実装ではここでAPIを呼び出す）
        setTimeout(async () => {
          // 分析結果のモックデータ
          const mockAnalysisResult = {
            persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
            problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
            benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
            requiredWords: "時短,栄養,健康,簡単",
          }
          
          // 分析結果を保存
          if (interview?.id) {
            await updateInterviewAnalysisStatus(
              interview.id,
              'completed',
              mockAnalysisResult
            )
          }
          
          setIsAnalyzing(false)
          router.push(`/brief?source=interview&id=${interview?.id || ''}`)
        }, 3000)
      }, 2000)
    } catch (err: any) {
      console.error('インタビュー処理エラー:', err)
      setError(err.message || 'インタビュー処理中にエラーが発生しました。')
      setIsUploading(false)
      setIsAnalyzing(false)
    }
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
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
