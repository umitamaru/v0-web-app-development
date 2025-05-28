"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import { getBrief, generateBannerCopy, getBriefBannerCopies } from '@/lib/supabaseUtils';
import { BannerCopy } from '@/lib/supabaseUtils';
import BannerCopyEditor from '@/components/banner-copy/BannerCopyEditor';
import BannerSizeSelector, { BannerSize, BANNER_SIZES } from '@/components/banner-copy/BannerSizeSelector';
import BackgroundStyleSelector, { BackgroundStyle, PatternType, BACKGROUND_STYLES, PATTERN_TYPES } from '@/components/banner-copy/BackgroundStyleSelector';

function BannerCopyContent() {
  const [brief, setBrief] = useState<any>(null);
  const [bannerCopies, setBannerCopies] = useState<BannerCopy[]>([]);
  const [currentCopy, setCurrentCopy] = useState<BannerCopy | null>(null);
  const [selectedSize, setSelectedSize] = useState<BannerSize>(BANNER_SIZES[1]); // デフォルトはFacebookフィード
  const [selectedStyle, setSelectedStyle] = useState<BackgroundStyle>(BACKGROUND_STYLES[0]); // デフォルトはグラデーション
  const [selectedPattern, setSelectedPattern] = useState<PatternType>(PATTERN_TYPES[0]); // デフォルトはドット
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'copy' | 'design' | 'preview'>('copy');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const briefId = searchParams?.get('brief_id');

  // ブリーフデータを取得
  useEffect(() => {
    if (briefId) {
      const fetchBrief = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await getBrief(briefId);
          
          if (error) {
            console.warn('ブリーフ取得エラー（フォールバックを使用）:', error);
          }
          
          if (data) {
            setBrief(data);
            setError(null);
          } else {
            // データが取得できない場合はモックデータを使用
            console.warn('ブリーフデータが取得できませんでした。モックデータを使用します。');
            const mockBrief = {
              id: briefId,
              user_id: '550e8400-e29b-41d4-a716-446655440000',
              persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
              problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
              benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
              required_words: "時短,栄養,健康,簡単",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: 'draft'
            };
            setBrief(mockBrief);
            setError(null);
          }
        } catch (err) {
          console.error('ブリーフ取得エラー:', err);
          // エラー時もモックデータを使用
          console.warn('エラーが発生しました。モックデータを使用します。');
          const mockBrief = {
            id: briefId,
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
            problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
            benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
            required_words: "時短,栄養,健康,簡単",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'draft'
          };
          setBrief(mockBrief);
          setError(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBrief();
    }
  }, [briefId]);

  // バナーコピー生成
  const handleGenerateCopy = async () => {
    if (!brief || !briefId) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error } = await generateBannerCopy(
        briefId,
        brief.persona,
        brief.problem,
        brief.benefit,
        brief.required_words?.split(',').map((w: string) => w.trim()).filter(Boolean) || []
      );

      if (error) throw error;
      if (!data) throw new Error('バナーコピーの生成に失敗しました');

      setCurrentCopy(data);
      setBannerCopies([data, ...bannerCopies]);
      setStep('design');
    } catch (err) {
      console.error('バナーコピー生成エラー:', err);
      setError(err instanceof Error ? err.message : 'バナーコピーの生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  // バナー画像生成
  const handleGenerateBanner = async () => {
    if (!currentCopy) return;

    setIsGeneratingBanner(true);
    setError(null);

    try {
      // ここで実際のバナー生成APIを呼び出す
      // 現在はモック処理
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStep('preview');
    } catch (err) {
      console.error('バナー生成エラー:', err);
      setError('バナー生成に失敗しました。');
    } finally {
      setIsGeneratingBanner(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'copy':
        return (
          <div className="space-y-6">
            {/* ブリーフ情報表示 */}
            {brief && (
              <Card>
                <CardHeader>
                  <CardTitle>📋 ブリーフ情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">ペルソナ</h4>
                    <p className="text-sm text-gray-600">{brief.persona}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">課題</h4>
                    <p className="text-sm text-gray-600">{brief.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">ベネフィット</h4>
                    <p className="text-sm text-gray-600">{brief.benefit}</p>
                  </div>
                  {brief.required_words && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">必須ワード</h4>
                      <p className="text-sm text-gray-600">{brief.required_words}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* バナーコピー生成 */}
            <BannerCopyEditor
              briefId={briefId || ''}
              initialCopy={currentCopy || undefined}
              onCopyChange={setCurrentCopy}
            />

            {/* 生成ボタン */}
            {!currentCopy && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerateCopy}
                  disabled={isGenerating || !brief}
                  size="lg"
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5" />
                      バナーコピーを生成
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* 次のステップボタン */}
            {currentCopy && (
              <div className="flex justify-end">
                <Button onClick={() => setStep('design')} size="lg">
                  デザイン設定に進む
                </Button>
              </div>
            )}
          </div>
        );

      case 'design':
        return (
          <div className="space-y-6">
            {/* バナーコピー表示 */}
            {currentCopy && (
              <Card>
                <CardHeader>
                  <CardTitle>📝 生成されたバナーコピー</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">メインテキスト</h4>
                    <p className="text-lg font-bold text-gray-900">{currentCopy.main_text}</p>
                  </div>
                  {currentCopy.sub_text && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">サブテキスト</h4>
                      <p className="text-sm text-gray-600">{currentCopy.sub_text}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">CTAボタン</h4>
                    <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                      {currentCopy.cta_text}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStep('copy')}
                    >
                      コピーを編集
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* バナーサイズ選択 */}
            <BannerSizeSelector
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
            />

            {/* 背景スタイル選択 */}
            <BackgroundStyleSelector
              selectedStyle={selectedStyle}
              selectedPattern={selectedPattern}
              onStyleSelect={setSelectedStyle}
              onPatternSelect={setSelectedPattern}
            />

            {/* バナー生成ボタン */}
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerateBanner}
                disabled={isGeneratingBanner}
                size="lg"
                className="gap-2"
              >
                {isGeneratingBanner ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    バナー生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    バナーを生成
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            {/* 生成されたバナープレビュー */}
            <Card>
              <CardHeader>
                <CardTitle>🎨 生成されたバナー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div 
                    className="border border-gray-300 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex flex-col justify-center items-center text-white p-6 rounded-lg shadow-lg"
                    style={{
                      width: Math.min(selectedSize.width / 2, 400),
                      height: Math.min(selectedSize.height / 2, 300),
                      maxWidth: '400px',
                      maxHeight: '300px'
                    }}
                  >
                    <h2 className="text-xl font-bold mb-2 text-center">{currentCopy?.main_text}</h2>
                    {currentCopy?.sub_text && (
                      <p className="text-sm mb-4 text-center opacity-90">{currentCopy.sub_text}</p>
                    )}
                    <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm">
                      {currentCopy?.cta_text}
                    </button>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    サイズ: {selectedSize.dimensions} ({selectedSize.platform})
                  </p>
                  <p className="text-sm text-gray-600">
                    背景: {selectedStyle.name}
                    {selectedStyle.type === 'pattern' && selectedPattern && ` (${selectedPattern.name})`}
                  </p>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep('design')}>
                    設定を変更
                  </Button>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    ダウンロード
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href="/brief"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ブリーフに戻る
        </Link>
      </div>

      {/* ステップインジケーター */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[
            { key: 'copy', label: 'コピー生成', icon: '📝' },
            { key: 'design', label: 'デザイン設定', icon: '🎨' },
            { key: 'preview', label: 'プレビュー', icon: '👀' }
          ].map((stepItem, index) => (
            <div key={stepItem.key} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                ${step === stepItem.key 
                  ? 'bg-blue-600 text-white' 
                  : index < ['copy', 'design', 'preview'].indexOf(step)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepItem.icon}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step === stepItem.key ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {stepItem.label}
              </span>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < ['copy', 'design', 'preview'].indexOf(step) ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">ブリーフデータを読み込み中...</p>
            </div>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>
    </div>
  );
}

export default function BannerCopyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BannerCopyContent />
    </Suspense>
  );
} 