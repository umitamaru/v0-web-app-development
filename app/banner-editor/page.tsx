"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BannerEditor, { BannerConfig } from '@/components/banner-editor/BannerEditor';
import { getBrief } from '@/lib/supabaseUtils';
import { BANNER_SIZES } from '@/components/banner-copy/BannerSizeSelector';
import WorkflowStepIndicator from '@/components/WorkflowStepIndicator';

function BannerEditorContent() {
  const [brief, setBrief] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // バナー設定（デフォルト値）
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    width: BANNER_SIZES[1].width, // Facebookフィード
    height: BANNER_SIZES[1].height,
    backgroundColor: '#ffffff',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const briefId = searchParams?.get('brief_id');
  const customImageUrl = searchParams?.get('custom_image') ? 
    decodeURIComponent(searchParams.get('custom_image')!) : undefined;

  // ブリーフデータを取得
  useEffect(() => {
    if (briefId) {
      const fetchBrief = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await getBrief(briefId);
          
          if (error) {
            console.warn('ブリーフ取得エラー（モックデータを使用）:', error);
          }
          
          if (data) {
            setBrief(data);
            setError(null);
          } else {
            // データが取得できない場合はモックデータを使用
            setBrief({
              id: briefId,
              persona: "30代前半の会社員。都市部に住み、IT企業で働いている。",
              problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がない。",
              benefit: "時間をかけずに栄養バランスの取れた食事が摂れる。",
              required_words: "時短,栄養,健康,簡単",
            });
            setError(null);
          }
        } catch (err) {
          console.error('ブリーフ取得エラー:', err);
          setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBrief();
    } else {
      setIsLoading(false);
    }
  }, [briefId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">エディターを準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/banner-copy?brief_id=${briefId}`}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              バナーコピーに戻る
            </Link>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-semibold">高度なバナーエディター</h1>
              {brief && (
                <p className="text-sm text-gray-600">
                  ブリーフ: {brief.persona?.substring(0, 50)}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ステップインジケーター */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <WorkflowStepIndicator 
          currentStep="design" 
          currentSubStep="design"
        />
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* バナーエディター */}
      <BannerEditor
        bannerConfig={bannerConfig}
        onBannerConfigChange={setBannerConfig}
        customImageUrl={customImageUrl}
      />
    </div>
  );
}

export default function BannerEditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BannerEditorContent />
    </Suspense>
  );
} 