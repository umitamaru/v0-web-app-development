"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, Grid3X3, Sparkles, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

export interface BackgroundStyle {
  id: string;
  name: string;
  type: 'gradient' | 'pattern' | 'custom_image';
  description: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  speed: 'fast' | 'medium' | 'slow';
}

export interface PatternType {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}

const BACKGROUND_STYLES: BackgroundStyle[] = [
  {
    id: 'gradient',
    name: 'グラデーション背景',
    type: 'gradient',
    description: '美しいカラーグラデーション（高速生成）',
    icon: <Palette className="h-4 w-4" />,
    speed: 'fast',
    preview: (
      <div className="w-full h-16 rounded bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
    )
  },
  {
    id: 'pattern',
    name: 'デザインパターン背景',
    type: 'pattern',
    description: 'プロフェッショナルなパターンデザイン（中速生成）',
    icon: <Grid3X3 className="h-4 w-4" />,
    speed: 'medium',
    preview: (
      <div className="w-full h-16 rounded bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className={`${i % 2 === 0 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'custom_image',
    name: 'カスタム画像背景',
    type: 'custom_image',
    description: 'お好みの画像をアップロードして背景に使用（中速生成）',
    icon: <ImageIcon className="h-4 w-4" />,
    speed: 'medium',
    preview: (
      <div className="w-full h-16 rounded bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }
];

const PATTERN_TYPES: PatternType[] = [
  {
    id: 'dots',
    name: 'ドット',
    description: 'モダンなドットパターン',
    preview: (
      <div className="w-full h-12 rounded bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-6 gap-1 p-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'stripes',
    name: 'ストライプ',
    description: 'エレガントなストライプ',
    preview: (
      <div className="w-full h-12 rounded bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="flex h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'grid',
    name: 'グリッド',
    description: 'シンプルなグリッドライン',
    preview: (
      <div className="w-full h-12 rounded bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-4 grid-rows-3 gap-px bg-blue-500 p-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white"></div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'diamond',
    name: 'ダイヤモンド',
    description: 'ダイナミックなダイヤモンド',
    preview: (
      <div className="w-full h-12 rounded bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-blue-500 transform rotate-45"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

interface BackgroundStyleSelectorProps {
  selectedStyle?: BackgroundStyle;
  selectedPattern?: PatternType;
  customImageUrl?: string;
  onStyleSelect: (style: BackgroundStyle) => void;
  onPatternSelect: (pattern: PatternType) => void;
  onCustomImageUpload?: (imageUrl: string) => void;
  onCustomImageRemove?: () => void;
}

export default function BackgroundStyleSelector({
  selectedStyle,
  selectedPattern,
  customImageUrl,
  onStyleSelect,
  onPatternSelect,
  onCustomImageUpload,
  onCustomImageRemove
}: BackgroundStyleSelectorProps) {
  const getSpeedBadge = (speed: string) => {
    const speedConfig = {
      fast: { label: '高速', color: 'bg-green-100 text-green-800' },
      medium: { label: '中速', color: 'bg-yellow-100 text-yellow-800' },
      slow: { label: '低速', color: 'bg-red-100 text-red-800' }
    };
    
    const config = speedConfig[speed as keyof typeof speedConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 背景スタイル選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎨 背景スタイル選択
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BACKGROUND_STYLES.map((style) => (
              <div
                key={style.id}
                className={`
                  relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${selectedStyle?.id === style.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                onClick={() => onStyleSelect(style)}
              >
                {/* 選択インジケーター */}
                {selectedStyle?.id === style.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                )}

                {/* アイコンと速度 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {style.icon}
                    <span className="font-semibold text-sm">{style.name}</span>
                  </div>
                  {getSpeedBadge(style.speed)}
                </div>

                {/* プレビュー */}
                <div className="mb-3">
                  {style.preview}
                </div>

                {/* 説明 */}
                <p className="text-xs text-gray-600">{style.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* カスタム画像アップロード（カスタム画像背景が選択された場合のみ表示） */}
      {selectedStyle?.type === 'custom_image' && (
        <ImageUploader
          onImageUpload={onCustomImageUpload || (() => {})}
          currentImageUrl={customImageUrl}
          onRemoveImage={onCustomImageRemove}
        />
      )}

      {/* パターン選択（パターン背景が選択された場合のみ表示） */}
      {selectedStyle?.type === 'pattern' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              パターンタイプ選択
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PATTERN_TYPES.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`
                    relative border rounded-lg p-3 cursor-pointer transition-all duration-200
                    ${selectedPattern?.id === pattern.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => onPatternSelect(pattern)}
                >
                  {/* 選択インジケーター */}
                  {selectedPattern?.id === pattern.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}

                  {/* パターン名 */}
                  <h4 className="font-semibold text-sm mb-2">{pattern.name}</h4>

                  {/* プレビュー */}
                  <div className="mb-2">
                    {pattern.preview}
                  </div>

                  {/* 説明 */}
                  <p className="text-xs text-gray-600">{pattern.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 選択状況の表示 */}
      {selectedStyle && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">選択中の設定</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <span className="font-medium">背景スタイル:</span>
              <span className="flex items-center gap-1">
                {selectedStyle.icon}
                {selectedStyle.name}
              </span>
              {getSpeedBadge(selectedStyle.speed)}
            </div>
            {selectedStyle.type === 'pattern' && selectedPattern && (
              <div className="flex items-center gap-2">
                <span className="font-medium">パターン:</span>
                <span>{selectedPattern.name}</span>
              </div>
            )}
            {selectedStyle.type === 'custom_image' && customImageUrl && (
              <div className="flex items-center gap-2">
                <span className="font-medium">カスタム画像:</span>
                <span className="text-green-600">✓ アップロード済み</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { BACKGROUND_STYLES, PATTERN_TYPES }; 