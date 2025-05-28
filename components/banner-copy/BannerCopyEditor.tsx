"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Save } from 'lucide-react';
import { BannerCopy } from '@/lib/supabaseUtils';

interface BannerCopyEditorProps {
  briefId: string;
  initialCopy?: BannerCopy;
  onCopyChange?: (copy: BannerCopy) => void;
  onSave?: (copy: BannerCopy) => Promise<void>;
}

export default function BannerCopyEditor({
  briefId,
  initialCopy,
  onCopyChange,
  onSave
}: BannerCopyEditorProps) {
  const [copy, setCopy] = useState<BannerCopy | null>(initialCopy || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 文字数制限
  const MAX_MAIN_TEXT = 30;
  const MAX_SUB_TEXT = 60;
  const MAX_CTA_TEXT = 15;

  // コピー生成
  const handleGenerate = async (briefData: {
    persona: string;
    problem: string;
    benefit: string;
    requiredWords?: string;
  }) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/banner-copies/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefId,
          persona: briefData.persona,
          problem: briefData.problem,
          benefit: briefData.benefit,
          requiredWords: briefData.requiredWords?.split(',').map(w => w.trim()).filter(Boolean) || [],
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'コピー生成に失敗しました');
      }

      setCopy(result.data);
      onCopyChange?.(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コピー生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // コピー更新
  const handleUpdate = async (field: keyof Pick<BannerCopy, 'main_text' | 'sub_text' | 'cta_text'>, value: string) => {
    if (!copy) return;

    const updatedCopy = { ...copy, [field]: value };
    setCopy(updatedCopy);
    onCopyChange?.(updatedCopy);

    // 自動保存（デバウンス）
    if (copy.id) {
      try {
        const response = await fetch(`/api/banner-copies/${copy.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [field]: value }),
        });

        const result = await response.json();
        if (!result.success) {
          console.error('自動保存エラー:', result.error);
        }
      } catch (err) {
        console.error('自動保存エラー:', err);
      }
    }
  };

  // 手動保存
  const handleSave = async () => {
    if (!copy || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(copy);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (!copy) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            バナーコピー生成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            ブリーフ情報を入力して「クリエイティブを生成」ボタンを押すと、AIがバナーコピーを自動生成します。
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 バナーコピー編集
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* メインテキスト */}
        <div className="space-y-2">
          <Label htmlFor="main-text">メインテキスト</Label>
          <Input
            id="main-text"
            value={copy.main_text}
            onChange={(e) => handleUpdate('main_text', e.target.value)}
            placeholder="例：制作時間を90%短縮"
            maxLength={MAX_MAIN_TEXT}
            className={copy.main_text.length > MAX_MAIN_TEXT ? 'border-red-500' : ''}
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">インパクトのあるキャッチコピー</span>
            <span className={`${copy.main_text.length > MAX_MAIN_TEXT ? 'text-red-500' : 'text-gray-500'}`}>
              {copy.main_text.length}/{MAX_MAIN_TEXT}
            </span>
          </div>
        </div>

        {/* サブテキスト */}
        <div className="space-y-2">
          <Label htmlFor="sub-text">サブテキスト</Label>
          <Textarea
            id="sub-text"
            value={copy.sub_text || ''}
            onChange={(e) => handleUpdate('sub_text', e.target.value)}
            placeholder="例：AIが自動でプロ品質のバナーを生成"
            maxLength={MAX_SUB_TEXT}
            className={`resize-none ${(copy.sub_text?.length || 0) > MAX_SUB_TEXT ? 'border-red-500' : ''}`}
            rows={2}
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ベネフィットを具体的に説明</span>
            <span className={`${(copy.sub_text?.length || 0) > MAX_SUB_TEXT ? 'text-red-500' : 'text-gray-500'}`}>
              {copy.sub_text?.length || 0}/{MAX_SUB_TEXT}
            </span>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="space-y-2">
          <Label htmlFor="cta-text">CTAボタン</Label>
          <Input
            id="cta-text"
            value={copy.cta_text}
            onChange={(e) => handleUpdate('cta_text', e.target.value)}
            placeholder="例：今すぐ試す"
            maxLength={MAX_CTA_TEXT}
            className={copy.cta_text.length > MAX_CTA_TEXT ? 'border-red-500' : ''}
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">行動を促す明確な表現</span>
            <span className={`${copy.cta_text.length > MAX_CTA_TEXT ? 'text-red-500' : 'text-gray-500'}`}>
              {copy.cta_text.length}/{MAX_CTA_TEXT}
            </span>
          </div>
        </div>

        {/* 保存ボタン */}
        {onSave && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || copy.main_text.length > MAX_MAIN_TEXT || (copy.sub_text?.length || 0) > MAX_SUB_TEXT || copy.cta_text.length > MAX_CTA_TEXT}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 