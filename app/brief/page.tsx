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
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromInterview = searchParams?.get("source") === "interview"

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

  // インタビューからの遷移の場合、AIサジェストを読み込む
  useEffect(() => {
    if (fromInterview) {
      setIsLoadingSuggestions(true)
      // 実際の実装ではここでAPIからサジェストを取得
      setTimeout(() => {
        form.setValue("persona", mockSuggestions.persona)
        form.setValue("problem", mockSuggestions.problem)
        form.setValue("benefit", mockSuggestions.benefit)
        form.setValue("requiredWords", mockSuggestions.requiredWords)
        setIsLoadingSuggestions(false)
        setHasSuggestions(true)
      }, 2000)
    }
  }, [fromInterview, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log(values)

    // 実際の実装ではここでAPIリクエストを行い、生成処理を実行
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/preview")
    }, 3000)
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
                      <FormDescription>製品・サービスがもたらす具体的なメリットを記述してください。</FormDescription>
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
                        <Input placeholder="例：簡単, 時短, 栄養満点" {...field} />
                      </FormControl>
                      <FormDescription>
                        広告コピーに含めたいキーワードをカンマ区切りで入力してください。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fromInterview && hasSuggestions && (
                  <div className="flex justify-start">
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
                      サジェストを再生成
                    </Button>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
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
