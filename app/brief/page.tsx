"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Wand2, RefreshCw, FileText } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getInterview, createBrief } from "@/lib/supabaseUtils"
import WorkflowStepIndicator from "@/components/WorkflowStepIndicator"

const formSchema = z.object({
  persona: z.string().min(10, {
    message: "ペルソナは10文字以上で入力してください。",
  }),
  problem: z.string().min(10, {
    message: "課題は10文字以上で入力してください。",
  }),
  benefit: z.string().min(10, {
    message: "ベネフィットは10文字以上で入力してください。",
  }),
  requiredWords: z.string().optional(),
})

// AIによるサジェストのモックデータ
const mockSuggestions = {
  persona:
    "20代後半〜30代前半の女性。都市部在住で、キャリアを重視しながらも健康的な生活を送りたいと考えている。日々の忙しさから自分の健康管理に十分な時間を割けていないことに不安を感じている。",
  problem:
    "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。外食やコンビニ食が多くなりがちで、長期的な健康への影響を心配している。",
  benefit:
    "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
  requiredWords: "簡単,時短,栄養満点,健康管理",
}

export default function BriefPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [hasSuggestions, setHasSuggestions] = useState(false)
  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromInterview = searchParams?.get("source") === "interview"
  const interviewId = searchParams?.get("id")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      persona:
        "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
      problem:
        "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
      benefit:
        "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
      requiredWords: "時短,栄養,健康,簡単",
    },
  })

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

  // インタビューからの遷移の場合、インタビューデータを取得してAIサジェストを読み込む
  useEffect(() => {
    if (fromInterview && interviewId) {
      setIsLoadingSuggestions(true)
      
      const fetchInterviewData = async () => {
        try {
          const { data: interview, error: fetchError } = await getInterview(interviewId)
          
          if (fetchError) {
            throw fetchError
          }
          
          if (interview && interview.analysis_result) {
            // 分析結果をフォームにセット
            form.setValue("persona", interview.analysis_result.persona || mockSuggestions.persona)
            form.setValue("problem", interview.analysis_result.problem || mockSuggestions.problem)
            form.setValue("benefit", interview.analysis_result.benefit || mockSuggestions.benefit)
            form.setValue("requiredWords", interview.analysis_result.requiredWords || mockSuggestions.requiredWords)
            setHasSuggestions(true)
          } else {
            // 分析結果がない場合はモックデータを使用
            form.setValue("persona", mockSuggestions.persona)
            form.setValue("problem", mockSuggestions.problem)
            form.setValue("benefit", mockSuggestions.benefit)
            form.setValue("requiredWords", mockSuggestions.requiredWords)
            setHasSuggestions(true)
          }
        } catch (err: any) {
          console.error('インタビューデータ取得エラー:', err)
          setError(err.message || 'インタビューデータ取得中にエラーが発生しました。')
          
          // エラー時もモックデータを使用
          form.setValue("persona", mockSuggestions.persona)
          form.setValue("problem", mockSuggestions.problem)
          form.setValue("benefit", mockSuggestions.benefit)
          form.setValue("requiredWords", mockSuggestions.requiredWords)
          setHasSuggestions(true)
        } finally {
          setIsLoadingSuggestions(false)
        }
      }
      
      fetchInterviewData()
    } else if (fromInterview) {
      // インタビューIDがない場合はモックデータを使用
      setIsLoadingSuggestions(true)
      setTimeout(() => {
        form.setValue("persona", mockSuggestions.persona)
        form.setValue("problem", mockSuggestions.problem)
        form.setValue("benefit", mockSuggestions.benefit)
        form.setValue("requiredWords", mockSuggestions.requiredWords)
        setIsLoadingSuggestions(false)
        setHasSuggestions(true)
      }, 2000)
    }
  }, [fromInterview, interviewId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // デモ用に仮のユーザーIDを使用
      const userId = currentUser?.id || '550e8400-e29b-41d4-a716-446655440000'
      
      // Supabaseにブリーフを保存
      const { data: brief, error: createError } = await createBrief(
        values.persona,
        values.problem,
        values.benefit,
        userId,
        interviewId || undefined,
        values.requiredWords
      )
      
      if (createError) {
        console.warn('ブリーフ保存エラー（フォールバックを使用）:', createError)
      }
      
      // ブリーフIDを取得（エラー時はモックIDを使用）
      const briefId = brief?.id || `mock-brief-${Date.now()}`
      
      // クリエイティブ生成ページに遷移
      setTimeout(() => {
        setIsSubmitting(false)
        router.push(`/banner-copy?brief_id=${briefId}`)
      }, 3000)
    } catch (err: any) {
      console.error('ブリーフ保存エラー:', err)
      console.warn('エラーが発生しましたが、モックデータで続行します')
      
      // エラー時もモックIDで続行
      const briefId = `mock-brief-${Date.now()}`
      
      setTimeout(() => {
        setIsSubmitting(false)
        router.push(`/banner-copy?brief_id=${briefId}`)
      }, 3000)
    }
  }

  function handleRegenerateSuggestions() {
    setIsLoadingSuggestions(true)
    // 実際の実装ではここで新しいサジェストを取得
    setTimeout(() => {
      // 異なるサジェストを表示（実際はAPIから取得）
      form.setValue(
        "persona",
        "30代前半の共働き夫婦。都市部のマンションに住み、仕事に追われる日々を送っている。健康意識は高いが、時間的制約から理想的な食生活を実現できていない。",
      )
      form.setValue(
        "problem",
        "仕事の忙しさから自炊する時間が取れず、栄養バランスが偏りがちになっている。長期的な健康維持のために食生活を改善したいが、時間と手間をかけたくない。",
      )
      form.setValue(
        "benefit",
        "最小限の時間と労力で栄養バランスの取れた食事を実現でき、健康的なライフスタイルを維持できる。忙しい日常の中でも罪悪感なく食事を楽しめる。",
      )
      form.setValue("requiredWords", "時短,栄養,バランス,手軽")
      setIsLoadingSuggestions(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href={fromInterview ? "/interview" : "/"}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {fromInterview ? "インタビューアップロードに戻る" : "ホームに戻る"}
        </Link>
      </div>

      {/* ステップインジケーター */}
      <WorkflowStepIndicator currentStep="brief" />

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">広告クリエイティブ生成ブリーフ</CardTitle>
          {fromInterview && (
            <CardDescription>
              インタビュー録の分析結果をもとに、以下のフィールドにAIがサジェストを提供しました。
              必要に応じて編集してください。
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {fromInterview && isLoadingSuggestions && (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-500">インタビュー録を分析中...</p>
              </div>
            </div>
          )}

          {fromInterview && hasSuggestions && (
            <Alert className="mb-6">
              <FileText className="h-4 w-4" />
              <AlertTitle>AIによる分析結果</AlertTitle>
              <AlertDescription>
                インタビュー録から抽出した情報をもとに、以下のフォームに入力候補を提案しています。
                内容を確認し、必要に応じて編集してください。
              </AlertDescription>
            </Alert>
          )}

          {(!fromInterview || !isLoadingSuggestions) && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="persona"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ペルソナ（必須）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：20代後半〜30代前半の女性。都市部在住で、キャリアを重視しながらも健康的な生活を送りたいと考えている。"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>広告のターゲットとなるユーザー像を具体的に記述してください。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>課題（必須）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>ターゲットが抱える問題や課題を具体的に記述してください。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ベネフィット（必須）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        製品やサービスがどのように問題を解決し、どんな価値をもたらすかを具体的に記述してください。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>必須ワード（任意）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="例：時短,健康,栄養,簡単（カンマ区切り）"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        広告クリエイティブに含めたい重要なキーワードがあれば、カンマ区切りで入力してください。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  {fromInterview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegenerateSuggestions}
                      disabled={isLoadingSuggestions}
                      className="gap-2"
                    >
                      {isLoadingSuggestions ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      AIサジェストを再生成
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        クリエイティブを生成
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
