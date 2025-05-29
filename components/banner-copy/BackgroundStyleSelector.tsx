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
  customImageUrl?: string;
  onCustomImageUpload?: (imageUrl: string) => void;
  onCustomImageRemove?: () => void;
}

export default function BackgroundStyleSelector({
  customImageUrl,
  onCustomImageUpload,
  onCustomImageRemove
}: BackgroundStyleSelectorProps) {
  return (
    <ImageUploader
      onImageUpload={onCustomImageUpload || (() => {})}
      currentImageUrl={customImageUrl}
      onRemoveImage={onCustomImageRemove}
    />
  );
}

export { BACKGROUND_STYLES, PATTERN_TYPES }; 