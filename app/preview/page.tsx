"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ThumbsUp,
  ThumbsDown,
  Download,
  ArrowLeft,
  RefreshCw,
  Share2,
  FileText,
  CheckCircle,
  BarChart3,
  Upload,
  Loader2,
} from "lucide-react"
import Link from "next/link"

// 生成されたクリエイティブのモックデータ
const mockCreatives = [
  {
    id: 1,
    size: "1200x628",
    imageUrl: "/placeholder.svg?height=628&width=1200",
    copy: "忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。",
    status: null, // null, 'good', 'bad'
  },
  {
    id: 2,
    size: "1200x628",
    imageUrl: "/placeholder.svg?height=628&width=1200",
    copy: "時間がなくても健康的に。1日5分で叶える理想の食生活。",
    status: null,
  },
  {
    id: 3,
    size: "1200x628",
    imageUrl: "/placeholder.svg?height=628&width=1200",
    copy: "キャリアも健康も妥協しない。忙しいあなたのための栄養ソリューション。",
    status: null,
  },
  {
    id: 4,
    size: "1080x1080",
    imageUrl: "/placeholder.svg?height=1080&width=1080",
    copy: "忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。",
    status: null,
  },
  {
    id: 5,
    size: "1080x1080",
    imageUrl: "/placeholder.svg?height=1080&width=1080",
    copy: "時間がなくても健康的に。1日5分で叶える理想の食生活。",
    status: null,
  },
  {
    id: 6,
    size: "1080x1080",
    imageUrl: "/placeholder.svg?height=1080&width=1080",
    copy: "キャリアも健康も妥協しない。忙しいあなたのための栄養ソリューション。",
    status: null,
  },
  {
    id: 7,
    size: "1080x1920",
    imageUrl: "/placeholder.svg?height=1920&width=1080",
    copy: "忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。",
    status: null,
  },
  {
    id: 8,
    size: "1080x1920",
    imageUrl: "/placeholder.svg?height=1920&width=1080",
    copy: "時間がなくても健康的に。1日5分で叶える理想の食生活。",
    status: null,
  },
  {
    id: 9,
    size: "1080x1920",
    imageUrl: "/placeholder.svg?height=1920&width=1080",
    copy: "キャリアも健康も妥協しない。忙しいあなたのための栄養ソリューション。",
    status: null,
  },
]

export default function PreviewPage() {
  const [creatives, setCreatives] = useState(mockCreatives)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [clientApproved, setClientApproved] = useState(false)

  const handleRating = (id: number, status: "good" | "bad") => {
    setCreatives(creatives.map((creative) => (creative.id === id ? { ...creative, status } : creative)))
  }

  const handleDownload = () => {
    setIsDownloading(true)
    // 実際の実装ではここでZIPダウンロード処理を行う
    setTimeout(() => {
      setIsDownloading(false)
      alert("選択したクリエイティブをダウンロードしました。")
    }, 2000)
  }

  const handleExport = () => {
    setIsExporting(true)
    // 実際の実装ではここでGoogle Driveエクスポート処理を行う
    setTimeout(() => {
      setIsExporting(false)
      alert("選択したクリエイティブをGoogle Driveにエクスポートしました。")
    }, 2000)
  }

  const handleRegenerate = () => {
    setIsRegenerating(true)
    // 実際の実装ではここで再生成APIリクエストを行う
    setTimeout(() => {
      // モックデータを少し変更して「再生成」を表現
      const newCreatives = [...creatives].map((creative) => ({
        ...creative,
        copy: creative.copy.includes("新習慣")
          ? creative.copy.replace("新習慣", "新しいライフスタイル")
          : creative.copy.replace("栄養", "健康"),
        status: null,
      }))
      setCreatives(newCreatives)
      setIsRegenerating(false)
    }, 3000)
  }

  const handleClientApproval = () => {
    setClientApproved(true)
  }

  const handleUploadToAds = () => {
    setIsUploading(true)
    // 実際の実装ではここでMeta Ads APIを使用してアップロード
    setTimeout(() => {
      setIsUploading(false)
      alert("選択したクリエイティブをMeta Adsにアップロードしました。")
    }, 2000)
  }

  const goodCreativesCount = creatives.filter((c) => c.status === "good").length

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/brief" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ブリーフに戻る
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating} className="gap-2">
            {isRegenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                再生成中...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                クリエイティブを再生成
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={goodCreativesCount === 0 || isExporting}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            {isExporting ? "エクスポート中..." : "Google Driveにエクスポート"}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={goodCreativesCount === 0 || isDownloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "ダウンロード中..." : `選択した${goodCreativesCount}件をダウンロード`}
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">生成されたクリエイティブ</h1>

      <Tabs defaultValue="1200x628">
        <TabsList className="mb-6">
          <TabsTrigger value="1200x628">1200x628 (FB/Twitter)</TabsTrigger>
          <TabsTrigger value="1080x1080">1080x1080 (Instagram)</TabsTrigger>
          <TabsTrigger value="1080x1920">1080x1920 (Stories)</TabsTrigger>
        </TabsList>

        <TabsContent value="1200x628" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {creatives
              .filter((creative) => creative.size === "1200x628")
              .map((creative) => (
                <CreativeCard key={creative.id} creative={creative} onRate={handleRating} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="1080x1080" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatives
              .filter((creative) => creative.size === "1080x1080")
              .map((creative) => (
                <CreativeCard key={creative.id} creative={creative} onRate={handleRating} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="1080x1920" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creatives
              .filter((creative) => creative.size === "1080x1920")
              .map((creative) => (
                <CreativeCard key={creative.id} creative={creative} onRate={handleRating} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 pt-6 border-t">
        <h2 className="text-xl font-bold mb-4">次のステップ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">クライアント承認</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    選択したクリエイティブをクライアントに共有し、承認を得ましょう。
                  </p>
                  <Button
                    variant={clientApproved ? "default" : "outline"}
                    size="sm"
                    onClick={handleClientApproval}
                    className="gap-2"
                    disabled={goodCreativesCount === 0 || clientApproved}
                  >
                    {clientApproved ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        承認済み
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        クライアント承認を記録
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Meta Adsに入稿</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    承認されたクリエイティブをMeta広告マネージャーにアップロードし、 配信を開始しましょう。
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadToAds}
                    className="gap-2"
                    disabled={!clientApproved || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        アップロード中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Meta Adsにアップロード
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">パフォーマンス分析</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    配信開始後、広告指標を自動取得し、パフォーマンスを分析します。 閾値を超えた場合は通知が届きます。
                  </p>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="gap-2" disabled={!clientApproved}>
                      <BarChart3 className="h-4 w-4" />
                      KPIダッシュボードを表示
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface Creative {
  id: number
  size: string
  imageUrl: string
  copy: string
  status: "good" | "bad" | null
}

interface CreativeCardProps {
  creative: Creative
  onRate: (id: number, status: "good" | "bad") => void
}

function CreativeCard({ creative, onRate }: CreativeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={creative.imageUrl || "/placeholder.svg"}
            alt={`広告クリエイティブ ${creative.id}`}
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
            <p className="text-lg font-medium">{creative.copy}</p>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">ID: {creative.id}</span>
            <span className="ml-2 text-sm text-gray-500">サイズ: {creative.size}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={creative.status === "bad" ? "destructive" : "outline"}
              size="sm"
              onClick={() => onRate(creative.id, "bad")}
              className="gap-1"
            >
              <ThumbsDown className="h-4 w-4" />
              {creative.status === "bad" ? "評価済み" : "Bad"}
            </Button>
            <Button
              variant={creative.status === "good" ? "default" : "outline"}
              size="sm"
              onClick={() => onRate(creative.id, "good")}
              className="gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              {creative.status === "good" ? "評価済み" : "Good"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
