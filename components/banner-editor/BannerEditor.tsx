"use client"

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Download, Undo, Redo, Plus } from 'lucide-react';

// テキスト要素の型定義
export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  backgroundColor?: string;
  textAlign: 'left' | 'center' | 'right';
  // エフェクト関連
  shadow?: {
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  stroke?: {
    color: string;
    width: number;
  };
  borderRadius?: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// バナー全体の設定
export interface BannerConfig {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
}

interface BannerEditorProps {
  bannerConfig: BannerConfig;
  onBannerConfigChange: (config: BannerConfig) => void;
  customImageUrl?: string;
}

export default function BannerEditor({
  bannerConfig,
  onBannerConfigChange,
  customImageUrl
}: BannerEditorProps) {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // 新しいテキスト要素を追加
  const addTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: 'テキストを入力',
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      fontSize: 20,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'center',
    };
    
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  // テキスト要素を更新
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  }, []);

  // テキスト要素を削除
  const deleteTextElement = useCallback((id: string) => {
    setTextElements(prev => prev.filter(element => element.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // ドラッグ開始
  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElementId(elementId);
    setIsDragging(true);
    
    const element = textElements.find(el => el.id === elementId);
    if (element) {
      setDragOffset({
        x: e.clientX - element.x,
        y: e.clientY - element.y,
      });
    }
  }, [textElements]);

  // ドラッグ中
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    updateTextElement(selectedElementId, { x, y });
  }, [isDragging, selectedElementId, dragOffset, updateTextElement]);

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const selectedElement = textElements.find(el => el.id === selectedElementId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側：設定パネル */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">バナーエディター</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="elements">要素</TabsTrigger>
              <TabsTrigger value="style">スタイル</TabsTrigger>
              <TabsTrigger value="effects">エフェクト</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">テキスト要素</h3>
                  <Button onClick={addTextElement} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    テキストを追加
                  </Button>
                  
                  {textElements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">レイヤー</h4>
                      {textElements.map((element) => (
                        <div
                          key={element.id}
                          className={`p-2 rounded border cursor-pointer ${
                            selectedElementId === element.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedElementId(element.id)}
                        >
                          <div className="text-sm font-medium truncate">
                            {element.text}
                          </div>
                          <div className="text-xs text-gray-500">
                            {element.fontSize}px • {element.fontFamily.split(',')[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              {selectedElement ? (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">テキストスタイル</h3>
                    {/* スタイル設定UI（次のステップで実装） */}
                    <p className="text-sm text-gray-500">
                      選択中: {selectedElement.text}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  テキスト要素を選択してください
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="effects" className="space-y-4">
              {selectedElement ? (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">エフェクト</h3>
                    {/* エフェクト設定UI（後のステップで実装） */}
                    <p className="text-sm text-gray-500">
                      エフェクト設定（実装予定）
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  テキスト要素を選択してください
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 中央：キャンバス */}
      <div className="flex-1 flex flex-col">
        {/* ツールバー */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {bannerConfig.width} × {bannerConfig.height}px
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </div>
        </div>

        {/* キャンバス */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div
            ref={canvasRef}
            className="relative border border-gray-300 shadow-lg"
            style={{
              width: bannerConfig.width,
              height: bannerConfig.height,
              backgroundColor: bannerConfig.backgroundColor,
              backgroundImage: customImageUrl ? `url(${customImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* カスタム画像のオーバーレイ */}
            {customImageUrl && (
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            )}
            
            {/* テキスト要素 */}
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move select-none ${
                  selectedElementId === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  fontSize: element.fontSize,
                  fontFamily: element.fontFamily,
                  fontWeight: element.fontWeight,
                  color: element.color,
                  backgroundColor: element.backgroundColor,
                  textAlign: element.textAlign,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: element.textAlign === 'center' ? 'center' : 
                                 element.textAlign === 'right' ? 'flex-end' : 'flex-start',
                  borderRadius: element.borderRadius,
                  padding: element.padding ? 
                    `${element.padding.top}px ${element.padding.right}px ${element.padding.bottom}px ${element.padding.left}px` : 
                    undefined,
                  textShadow: element.shadow ? 
                    `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}` : 
                    undefined,
                  WebkitTextStroke: element.stroke ? 
                    `${element.stroke.width}px ${element.stroke.color}` : 
                    undefined,
                  zIndex: 10
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
              >
                {element.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 