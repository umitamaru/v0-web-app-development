"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Square, Maximize } from 'lucide-react';

export interface BannerSize {
  id: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  platform: string;
  description: string;
  icon: React.ReactNode;
}

const BANNER_SIZES: BannerSize[] = [
  {
    id: 'google-leaderboard',
    name: 'リーダーボード',
    dimensions: '728×90',
    width: 728,
    height: 90,
    platform: 'Google Ads',
    description: 'ウェブサイトのヘッダー・フッター向け',
    icon: <Monitor className="h-4 w-4" />
  },
  {
    id: 'facebook-feed',
    name: 'フィード投稿',
    dimensions: '1080×1080',
    width: 1080,
    height: 1080,
    platform: 'Facebook/Instagram',
    description: 'SNSフィード投稿に最適',
    icon: <Square className="h-4 w-4" />
  },
  {
    id: 'instagram-story',
    name: 'ストーリー',
    dimensions: '1080×1920',
    width: 1080,
    height: 1920,
    platform: 'Instagram',
    description: 'ストーリー・リール向け縦型',
    icon: <Smartphone className="h-4 w-4" />
  },
  {
    id: 'facebook-cover',
    name: 'カバー画像',
    dimensions: '1200×628',
    width: 1200,
    height: 628,
    platform: 'Facebook',
    description: 'Facebookページカバー',
    icon: <Maximize className="h-4 w-4" />
  },
  {
    id: 'youtube-thumbnail',
    name: 'サムネイル',
    dimensions: '1280×720',
    width: 1280,
    height: 720,
    platform: 'YouTube',
    description: 'YouTube動画サムネイル',
    icon: <Monitor className="h-4 w-4" />
  },
  {
    id: 'twitter-header',
    name: 'ヘッダー画像',
    dimensions: '1500×500',
    width: 1500,
    height: 500,
    platform: 'Twitter/X',
    description: 'プロフィールヘッダー',
    icon: <Maximize className="h-4 w-4" />
  }
];

interface BannerSizeSelectorProps {
  selectedSize?: BannerSize;
  onSizeSelect: (size: BannerSize) => void;
}

export default function BannerSizeSelector({
  selectedSize,
  onSizeSelect
}: BannerSizeSelectorProps) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📐 バナーサイズ選択
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BANNER_SIZES.map((size) => (
            <div
              key={size.id}
              className={`
                relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${selectedSize?.id === size.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
                ${hoveredSize === size.id ? 'scale-105' : ''}
              `}
              onClick={() => onSizeSelect(size)}
              onMouseEnter={() => setHoveredSize(size.id)}
              onMouseLeave={() => setHoveredSize(null)}
            >
              {/* 選択インジケーター */}
              {selectedSize?.id === size.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}

              {/* アイコンとプラットフォーム */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {size.icon}
                  <Badge variant="secondary" className="text-xs">
                    {size.platform}
                  </Badge>
                </div>
              </div>

              {/* サイズ名と寸法 */}
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900">{size.name}</h3>
                <p className="text-lg font-mono text-blue-600">{size.dimensions}</p>
              </div>

              {/* 説明 */}
              <p className="text-sm text-gray-600 mb-3">{size.description}</p>

              {/* プレビュー比率 */}
              <div className="flex justify-center">
                <div 
                  className="border border-gray-300 bg-gray-100"
                  style={{
                    width: Math.min(size.width / 10, 80),
                    height: Math.min(size.height / 10, 80),
                    maxWidth: '80px',
                    maxHeight: '80px'
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-mono">
                      {size.width}×{size.height}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedSize && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">選択中のサイズ</h4>
            <div className="flex items-center gap-4 text-sm text-blue-800">
              <span className="flex items-center gap-1">
                {selectedSize.icon}
                {selectedSize.name}
              </span>
              <span className="font-mono">{selectedSize.dimensions}</span>
              <Badge variant="outline">{selectedSize.platform}</Badge>
            </div>
            <p className="text-sm text-blue-700 mt-2">{selectedSize.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { BANNER_SIZES }; 