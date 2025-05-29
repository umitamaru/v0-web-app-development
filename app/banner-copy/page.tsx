"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Loader2, Download, Check } from 'lucide-react';
import Link from 'next/link';
import { getBrief, generateBannerCopy, getBriefBannerCopies } from '@/lib/supabaseUtils';
import { BannerCopy } from '@/lib/supabaseUtils';
import BannerCopyEditor from '@/components/banner-copy/BannerCopyEditor';
import BannerSizeSelector, { BannerSize, BANNER_SIZES } from '@/components/banner-copy/BannerSizeSelector';
import BackgroundStyleSelector, { BackgroundStyle, PatternType, BACKGROUND_STYLES, PATTERN_TYPES } from '@/components/banner-copy/BackgroundStyleSelector';
import WorkflowStepIndicator from '@/components/WorkflowStepIndicator';

function BannerCopyContent() {
  const [brief, setBrief] = useState<any>(null);
  const [bannerCopies, setBannerCopies] = useState<BannerCopy[]>([]);
  const [currentCopy, setCurrentCopy] = useState<BannerCopy | null>(null);
  const [selectedSize, setSelectedSize] = useState<BannerSize>(BANNER_SIZES[1]); // デフォルトはFacebookフィード
  const [selectedStyle, setSelectedStyle] = useState<BackgroundStyle>(BACKGROUND_STYLES[2]); // デフォルトはカスタム画像
  const [selectedPattern, setSelectedPattern] = useState<PatternType>(PATTERN_TYPES[0]); // デフォルトはドット
  const [customImageUrl, setCustomImageUrl] = useState<string>(''); // カスタム画像URL
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'design' | 'preview'>('design');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const briefId = searchParams?.get('brief_id');

  // ブリーフデータを取得し、自動でバナーコピーを生成
  useEffect(() => {
    if (briefId) {
      const fetchBriefAndGenerateCopy = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await getBrief(briefId);
          
          if (error) {
            console.warn('ブリーフ取得エラー（フォールバックを使用）:', error);
          }
          
          let briefData;
          if (data) {
            briefData = data;
            setBrief(data);
            setError(null);
          } else {
            // データが取得できない場合はモックデータを使用
            console.warn('ブリーフデータが取得できませんでした。モックデータを使用します。');
            briefData = {
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
            setBrief(briefData);
            setError(null);
          }

          // ブリーフ取得後、自動でバナーコピーを生成
          if (briefData) {
            setIsGenerating(true);
            try {
              const { data: copyData, error: copyError } = await generateBannerCopy(
                briefId,
                briefData.persona,
                briefData.problem,
                briefData.benefit,
                briefData.required_words?.split(',').map((w: string) => w.trim()).filter(Boolean) || []
              );

              if (copyError) throw copyError;
              if (!copyData) throw new Error('バナーコピーの生成に失敗しました');

              setCurrentCopy(copyData);
              setBannerCopies([copyData]);
            } catch (copyErr) {
              console.error('バナーコピー生成エラー:', copyErr);
              setError(copyErr instanceof Error ? copyErr.message : 'バナーコピーの生成に失敗しました。');
            } finally {
              setIsGenerating(false);
            }
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

      fetchBriefAndGenerateCopy();
    }
  }, [briefId]);

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

  // カスタム画像アップロードハンドラー
  const handleCustomImageUpload = (imageUrl: string) => {
    console.log('Banner Copy Page: Setting custom image URL to:', imageUrl);
    setCustomImageUrl(imageUrl);
  };

  // カスタム画像削除ハンドラー
  const handleCustomImageRemove = () => {
    console.log('Banner Copy Page: Removing custom image URL');
    setCustomImageUrl('');
  };

  // デバッグ用: customImageUrlの変更をログ出力
  useEffect(() => {
    console.log('Banner Copy Page: customImageUrl state updated to:', customImageUrl);
  }, [customImageUrl]);

  // デバッグ用: プレビューステップでの画像URL確認
  useEffect(() => {
    if (step === 'preview') {
      console.log('Preview Step: Current customImageUrl:', customImageUrl);
      console.log('Preview Step: Background style will be:', customImageUrl ? 'custom image' : 'gradient');
    }
  }, [step, customImageUrl]);

  const renderStepContent = () => {
    switch (step) {
      case 'design':
        return (
          <div className="space-y-6">
            {/* ブリーフ情報（折りたたみ可能） */}
            {brief && (
              <Card>
                <CardHeader>
                  <CardTitle>📋 ブリーフ情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-xs text-gray-700 mb-1">ペルソナ</h4>
                    <p className="text-xs text-gray-600">{brief.persona}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-700 mb-1">課題</h4>
                    <p className="text-xs text-gray-600">{brief.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-700 mb-1">ベネフィット</h4>
                    <p className="text-xs text-gray-600">{brief.benefit}</p>
                  </div>
                  {brief.required_words && (
                    <div>
                      <h4 className="font-semibold text-xs text-gray-700 mb-1">必須ワード</h4>
                      <p className="text-xs text-gray-600">{brief.required_words}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* バナーコピー表示・編集 */}
            {currentCopy ? (
              <Card>
                <CardHeader>
                  <CardTitle>📝 生成されたバナーコピー</CardTitle>
                </CardHeader>
                <CardContent>
                  <BannerCopyEditor
                    briefId={briefId || ''}
                    initialCopy={currentCopy}
                    onCopyChange={setCurrentCopy}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>📝 バナーコピー生成中</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-gray-600">AIがバナーコピーを生成中...</p>
                    </div>
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
              customImageUrl={customImageUrl}
              onCustomImageUpload={handleCustomImageUpload}
              onCustomImageRemove={handleCustomImageRemove}
            />

            {/* バナー生成ボタン */}
            {currentCopy && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleGenerateBanner}
                  disabled={isGeneratingBanner || !currentCopy}
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
            )}
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
                    className={`
                      border border-gray-300 flex flex-col justify-center items-center text-white p-6 rounded-lg shadow-lg relative overflow-hidden
                      ${customImageUrl ? '' : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'}
                    `}
                    style={{
                      width: Math.min(selectedSize.width / 2, 400),
                      height: Math.min(selectedSize.height / 2, 300),
                      maxWidth: '400px',
                      maxHeight: '300px',
                      backgroundImage: customImageUrl 
                        ? `url(${customImageUrl})` 
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* カスタム画像の場合はオーバーレイを追加 */}
                    {customImageUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    )}
                    
                    <div className="relative z-10 text-center">
                      <h2 className="text-xl font-bold mb-2 text-center drop-shadow-lg">{currentCopy?.main_text}</h2>
                      {currentCopy?.sub_text && (
                        <p className="text-sm mb-4 text-center opacity-90 drop-shadow-lg">{currentCopy.sub_text}</p>
                      )}
                      <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm shadow-lg">
                        {currentCopy?.cta_text}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    サイズ: {selectedSize.dimensions} ({selectedSize.platform})
                  </p>
                  <p className="text-sm text-gray-600">
                    背景: {customImageUrl ? 'カスタム画像' : '画像未設定'}
                  </p>
                  {/* デバッグ用: 画像URL表示 */}
                  {customImageUrl && (
                    <p className="text-xs text-gray-500 break-all">
                      URL: {customImageUrl}
                    </p>
                  )}
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
      <WorkflowStepIndicator 
        currentStep="design" 
        currentSubStep={step as 'design' | 'preview'}
      />

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
        {(isLoading || isGenerating) ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">
                {isLoading ? 'ブリーフデータを読み込み中...' : 'バナーコピーを生成中...'}
              </p>
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