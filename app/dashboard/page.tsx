"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Eye,
  MousePointerClick,
  DollarSign,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react"
import Link from "next/link"

// モックデータ - 広告キャンペーン
const campaignData = {
  name: "健康食品プロモーション 2025春",
  startDate: "2025-04-01",
  endDate: "2025-04-30",
  budget: "¥500,000",
  spent: "¥235,400",
  status: "active",
}

// モックデータ - KPI概要
const kpiSummary = [
  {
    name: "インプレッション",
    value: "245,678",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
  },
  {
    name: "クリック数",
    value: "8,432",
    change: "+8.2%",
    trend: "up",
    icon: MousePointerClick,
  },
  {
    name: "CTR",
    value: "3.43%",
    change: "-0.5%",
    trend: "down",
    icon: BarChart3,
  },
  {
    name: "CPA",
    value: "¥2,450",
    change: "-5.2%",
    trend: "up", // コスト減少はポジティブ
    icon: DollarSign,
  },
]

// モックデータ - クリエイティブパフォーマンス
const creativePerformance = [
  {
    id: 1,
    name: "健康サポート_1200x628_01",
    thumbnail: "/placeholder.svg?height=120&width=228",
    copy: "忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。",
    impressions: 85432,
    clicks: 3245,
    ctr: 3.8,
    cpa: 2250,
    status: "good",
  },
  {
    id: 2,
    name: "時短食生活_1200x628_02",
    thumbnail: "/placeholder.svg?height=120&width=228",
    copy: "時間がなくても健康的に。1日5分で叶える理想の食生活。",
    impressions: 82145,
    clicks: 2876,
    ctr: 3.5,
    cpa: 2580,
    status: "warning",
  },
  {
    id: 3,
    name: "キャリア両立_1200x628_03",
    thumbnail: "/placeholder.svg?height=120&width=228",
    copy: "キャリアも健康も妥協しない。忙しいあなたのための栄養ソリューション。",
    impressions: 78101,
    clicks: 2311,
    ctr: 2.96,
    cpa: 2820,
    status: "alert",
  },
]

// モックデータ - 時系列データ（チャート用）
const timeSeriesData = {
  dates: ["4/1", "4/2", "4/3", "4/4", "4/5", "4/6", "4/7", "4/8", "4/9", "4/10"],
  ctr: [3.2, 3.4, 3.1, 3.5, 3.8, 3.7, 3.6, 3.4, 3.5, 3.4],
  cpa: [2600, 2550, 2500, 2480, 2450, 2420, 2400, 2450, 2430, 2450],
}

// モックデータ - 改善提案
const improvementSuggestions = [
  {
    id: 1,
    title: "コピーの改善",
    description:
      "「健康サポート」クリエイティブのCTRが高いため、他のクリエイティブも同様のトーンに調整することを検討してください。",
    impact: "high",
  },
  {
    id: 2,
    title: "ターゲティングの最適化",
    description:
      "30-35歳の女性セグメントでのパフォーマンスが特に良好です。予算配分を調整することでCPAをさらに改善できる可能性があります。",
    impact: "medium",
  },
  {
    id: 3,
    title: "新しいクリエイティブの追加",
    description:
      "現在のトップパフォーマーをベースに、新しいバリエーションを追加することでパフォーマンスを向上させることができます。",
    impact: "high",
  },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateVariations = () => {
    setIsGenerating(true)
    // 実際の実装ではここでAPIリクエストを行い、新しいバリエーションを生成
    setTimeout(() => {
      setIsGenerating(false)
      alert(
        "トップパフォーマーをベースに新しいクリエイティブバリエーションを生成しました。プレビュー画面で確認できます。",
      )
    }, 3000)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/preview" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          プレビュー画面に戻る
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="期間を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="yesterday">昨日</SelectItem>
                <SelectItem value="7days">過去7日間</SelectItem>
                <SelectItem value="30days">過去30日間</SelectItem>
                <SelectItem value="custom">カスタム期間</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            データを更新
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">キャンペーンダッシュボード</h1>
        <div className="flex items-center gap-4">
          <h2 className="text-lg text-gray-700">{campaignData.name}</h2>
          <Badge variant={campaignData.status === "active" ? "default" : "outline"} className="capitalize">
            {campaignData.status === "active" ? "実行中" : "停止中"}
          </Badge>
        </div>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>
            期間: {campaignData.startDate} 〜 {campaignData.endDate}
          </span>
          <span>予算: {campaignData.budget}</span>
          <span>消化額: {campaignData.spent}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiSummary.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{kpi.name}</p>
                  <h3 className="text-2xl font-bold">{kpi.value}</h3>
                </div>
                <div className="rounded-full bg-gray-100 p-2">
                  <kpi.icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {kpi.trend === "up" ? (
                  <TrendingUp className={`h-4 w-4 mr-1 ${kpi.name === "CPA" ? "text-green-500" : "text-green-500"}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 mr-1 ${kpi.name === "CPA" ? "text-red-500" : "text-red-500"}`} />
                )}
                <span
                  className={`text-sm ${
                    kpi.trend === "up"
                      ? kpi.name === "CPA"
                        ? "text-green-500"
                        : "text-green-500"
                      : kpi.name === "CPA"
                        ? "text-red-500"
                        : "text-red-500"
                  }`}
                >
                  {kpi.change} vs 前期間
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">パフォーマンス分析</TabsTrigger>
          <TabsTrigger value="creatives">クリエイティブ分析</TabsTrigger>
          <TabsTrigger value="suggestions">改善提案</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンス推移</CardTitle>
              <CardDescription>期間中のCTRとCPAの推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gray-50 rounded-md flex items-center justify-center">
                {/* 実際の実装ではここにChart.jsなどのライブラリを使用してグラフを表示 */}
                <div className="text-center p-4">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    ここにCTRとCPAの時系列チャートが表示されます。
                    <br />
                    実際の実装ではChart.jsなどのライブラリを使用します。
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-500">CTR推移</p>
                      <ul className="text-xs text-gray-500 mt-1">
                        {timeSeriesData.dates.map((date, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{date}:</span>
                            <span>{timeSeriesData.ctr[i]}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-500">CPA推移</p>
                      <ul className="text-xs text-gray-500 mt-1">
                        {timeSeriesData.dates.map((date, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{date}:</span>
                            <span>¥{timeSeriesData.cpa[i]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creatives">
          <div className="space-y-6">
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>パフォーマンス警告</AlertTitle>
              <AlertDescription>
                「キャリア両立」クリエイティブのCTRが目標値を下回っています。改善または予算配分の見直しを検討してください。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {creativePerformance.map((creative) => (
                <Card key={creative.id} className={creative.status === "alert" ? "border-red-200" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/4">
                        <img
                          src={creative.thumbnail || "/placeholder.svg"}
                          alt={creative.name}
                          className="w-full h-auto rounded-md border"
                        />
                        <p className="text-sm font-medium mt-2 truncate">{creative.name}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{creative.copy}</p>
                      </div>
                      <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">インプレッション</p>
                          <p className="text-xl font-bold">{creative.impressions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">クリック数</p>
                          <p className="text-xl font-bold">{creative.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">CTR</p>
                          <p
                            className={`text-xl font-bold ${
                              creative.ctr < 3.0 ? "text-red-500" : creative.ctr > 3.5 ? "text-green-500" : ""
                            }`}
                          >
                            {creative.ctr}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">CPA</p>
                          <p
                            className={`text-xl font-bold ${
                              creative.cpa > 2700 ? "text-red-500" : creative.cpa < 2400 ? "text-green-500" : ""
                            }`}
                          >
                            ¥{creative.cpa.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-6 py-3">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Badge
                          variant={
                            creative.status === "good"
                              ? "default"
                              : creative.status === "warning"
                                ? "outline"
                                : "destructive"
                          }
                          className="mr-2"
                        >
                          {creative.status === "good" ? "好調" : creative.status === "warning" ? "注意" : "要対応"}
                        </Badge>
                        {creative.status === "alert" && (
                          <span className="text-sm text-red-500">目標CTRを下回っています</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          詳細分析
                        </Button>
                        <Button variant="outline" size="sm">
                          予算調整
                        </Button>
                        {creative.status === "good" && (
                          <Button size="sm" className="gap-1">
                            <Sparkles className="h-4 w-4" />
                            派生作成
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  AIによる改善提案
                </CardTitle>
                <CardDescription>
                  現在のパフォーマンスデータに基づいて、AIが以下の改善提案を生成しました。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {improvementSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{suggestion.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{suggestion.description}</p>
                        </div>
                        <Badge
                          variant={suggestion.impact === "high" ? "default" : "outline"}
                          className={
                            suggestion.impact === "high"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {suggestion.impact === "high" ? "影響大" : "影響中"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between">
                <p className="text-sm text-gray-500">
                  これらの提案は現在のパフォーマンスデータに基づいています。定期的に更新されます。
                </p>
                <Button onClick={handleGenerateVariations} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      トップパフォーマーから派生作成
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>次のステップ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">クリエイティブのリフレッシュ</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        トップパフォーマーをベースに新しいバリエーションを生成し、広告の疲弊を防ぎましょう。
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={handleGenerateVariations}>
                        <Sparkles className="h-4 w-4" />
                        新しいバリエーションを生成
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">予算配分の最適化</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        パフォーマンスの良いクリエイティブに予算を重点配分し、キャンペーン全体のROIを向上させましょう。
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        予算配分を調整
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">新規クリエイティブの作成</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        現在のインサイトを活かして、新しいコンセプトのクリエイティブを作成しましょう。
                      </p>
                      <Link href="/interview">
                        <Button variant="outline" size="sm" className="mt-2">
                          新規クリエイティブを作成
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
