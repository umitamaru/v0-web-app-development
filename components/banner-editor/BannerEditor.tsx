"use client"

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Save, Download, Undo, Redo, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, ChevronUp, ChevronDown } from 'lucide-react';

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
  zIndex: number;
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

// 履歴管理用の型
interface HistoryState {
  textElements: TextElement[];
  bannerConfig: BannerConfig;
}

// フォントファミリーオプション
const FONT_FAMILIES = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: '"Georgia", serif', label: 'Georgia' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: '"Comic Sans MS", cursive', label: 'Comic Sans MS' },
  { value: '"Impact", sans-serif', label: 'Impact' },
  { value: '"Verdana", sans-serif', label: 'Verdana' },
  { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
  { value: '"Palatino", serif', label: 'Palatino' },
];

// フォントウェイトオプション
const FONT_WEIGHTS = [
  { value: '300', label: 'Light (300)' },
  { value: 'normal', label: 'Normal (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: 'bold', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' },
];

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
  
  // 履歴管理
  const [history, setHistory] = useState<HistoryState[]>([{
    textElements: [],
    bannerConfig
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // 履歴を保存
  const saveToHistory = useCallback((elements: TextElement[], config: BannerConfig) => {
    const newState: HistoryState = {
      textElements: JSON.parse(JSON.stringify(elements)),
      bannerConfig: JSON.parse(JSON.stringify(config))
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // 履歴は最大20件まで
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  // アンドゥ
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setTextElements(state.textElements);
      onBannerConfigChange(state.bannerConfig);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, onBannerConfigChange]);

  // リドゥ
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setTextElements(state.textElements);
      onBannerConfigChange(state.bannerConfig);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, onBannerConfigChange]);

  // 新しいテキスト要素を追加
  const addTextElement = useCallback(() => {
    const maxZIndex = Math.max(...textElements.map(el => el.zIndex), 0);
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
      zIndex: maxZIndex + 1,
    };
    
    const newElements = [...textElements, newElement];
    setTextElements(newElements);
    setSelectedElementId(newElement.id);
    saveToHistory(newElements, bannerConfig);
  }, [textElements, bannerConfig, saveToHistory]);

  // テキスト要素を更新
  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    const newElements = textElements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    );
    setTextElements(newElements);
    // リアルタイム更新のため履歴保存は遅延
    const timeoutId = setTimeout(() => {
      saveToHistory(newElements, bannerConfig);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [textElements, bannerConfig, saveToHistory]);

  // テキスト要素を削除
  const deleteTextElement = useCallback((id: string) => {
    const newElements = textElements.filter(element => element.id !== id);
    setTextElements(newElements);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    saveToHistory(newElements, bannerConfig);
  }, [textElements, selectedElementId, bannerConfig, saveToHistory]);

  // レイヤー順序を変更
  const moveLayer = useCallback((id: string, direction: 'up' | 'down') => {
    const element = textElements.find(el => el.id === id);
    if (!element) return;

    const otherElements = textElements.filter(el => el.id !== id);
    const sortedOthers = otherElements.sort((a, b) => a.zIndex - b.zIndex);
    
    let newZIndex = element.zIndex;
    
    if (direction === 'up') {
      const higherElement = sortedOthers.find(el => el.zIndex > element.zIndex);
      if (higherElement) {
        newZIndex = higherElement.zIndex + 1;
      }
    } else {
      const lowerElement = sortedOthers.reverse().find(el => el.zIndex < element.zIndex);
      if (lowerElement) {
        newZIndex = lowerElement.zIndex - 1;
      }
    }
    
    if (newZIndex !== element.zIndex) {
      const newElements = textElements.map(el => 
        el.id === id ? { ...el, zIndex: newZIndex } : el
      );
      setTextElements(newElements);
      saveToHistory(newElements, bannerConfig);
    }
  }, [textElements, bannerConfig, saveToHistory]);

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
              <Button size="sm" variant="outline" onClick={undo}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={redo}>
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
                      {textElements
                        .sort((a, b) => b.zIndex - a.zIndex)
                        .map((element) => (
                        <div
                          key={element.id}
                          className={`p-2 rounded border cursor-pointer ${
                            selectedElementId === element.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedElementId(element.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {element.text}
                              </div>
                              <div className="text-xs text-gray-500">
                                {element.fontSize}px • {element.fontFamily.split(',')[0]}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveLayer(element.id, 'up');
                                }}
                                className="h-6 w-6 p-0"
                                title="前面に移動"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveLayer(element.id, 'down');
                                }}
                                className="h-6 w-6 p-0"
                                title="背面に移動"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTextElement(element.id);
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title="削除"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* バナー設定 */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">バナー設定</h3>
                  
                  {/* バナーサイズ */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">幅 (px)</Label>
                        <Input
                          type="number"
                          value={bannerConfig.width}
                          onChange={(e) => {
                            const newConfig = {
                              ...bannerConfig,
                              width: parseInt(e.target.value) || 300
                            };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          min={100}
                          max={2000}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">高さ (px)</Label>
                        <Input
                          type="number"
                          value={bannerConfig.height}
                          onChange={(e) => {
                            const newConfig = {
                              ...bannerConfig,
                              height: parseInt(e.target.value) || 250
                            };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          min={100}
                          max={2000}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* プリセットサイズ */}
                    <div>
                      <Label className="text-sm mb-2 block">プリセットサイズ</Label>
                      <div className="grid grid-cols-1 gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newConfig = { ...bannerConfig, width: 300, height: 250 };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          className="text-xs justify-start"
                        >
                          300×250 (レクタングル)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newConfig = { ...bannerConfig, width: 728, height: 90 };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          className="text-xs justify-start"
                        >
                          728×90 (リーダーボード)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newConfig = { ...bannerConfig, width: 1200, height: 628 };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          className="text-xs justify-start"
                        >
                          1200×628 (Facebook)
                        </Button>
                      </div>
                    </div>

                    {/* 背景色 */}
                    <div className="space-y-2">
                      <Label className="text-sm">背景色</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={bannerConfig.backgroundColor}
                          onChange={(e) => {
                            const newConfig = {
                              ...bannerConfig,
                              backgroundColor: e.target.value
                            };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={bannerConfig.backgroundColor}
                          onChange={(e) => {
                            const newConfig = {
                              ...bannerConfig,
                              backgroundColor: e.target.value
                            };
                            onBannerConfigChange(newConfig);
                            saveToHistory(textElements, newConfig);
                          }}
                          className="flex-1"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              {selectedElement ? (
                <div className="space-y-4">
                  {/* テキスト内容 */}
                  <Card>
                    <CardContent className="p-4">
                      <Label htmlFor="text-content" className="text-sm font-medium">
                        テキスト内容
                      </Label>
                      <Input
                        id="text-content"
                        value={selectedElement.text}
                        onChange={(e) => updateTextElement(selectedElement.id, { text: e.target.value })}
                        className="mt-2"
                        placeholder="テキストを入力..."
                      />
                    </CardContent>
                  </Card>

                  {/* フォント設定 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">フォント設定</h3>
                      
                      {/* フォントファミリー */}
                      <div className="space-y-2">
                        <Label className="text-sm">フォントファミリー</Label>
                        <Select
                          value={selectedElement.fontFamily}
                          onValueChange={(value) => updateTextElement(selectedElement.id, { fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_FAMILIES.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <span style={{ fontFamily: font.value }}>{font.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* フォントサイズ */}
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm">
                          フォントサイズ: {selectedElement.fontSize}px
                        </Label>
                        <Slider
                          value={[selectedElement.fontSize]}
                          onValueChange={([value]) => updateTextElement(selectedElement.id, { fontSize: value })}
                          min={8}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* フォントウェイト */}
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm">フォントウェイト</Label>
                        <Select
                          value={selectedElement.fontWeight}
                          onValueChange={(value) => updateTextElement(selectedElement.id, { fontWeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_WEIGHTS.map((weight) => (
                              <SelectItem key={weight.value} value={weight.value}>
                                {weight.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 色設定 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">色設定</h3>
                      
                      {/* テキスト色 */}
                      <div className="space-y-2">
                        <Label className="text-sm">テキスト色</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={selectedElement.color}
                            onChange={(e) => updateTextElement(selectedElement.id, { color: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={selectedElement.color}
                            onChange={(e) => updateTextElement(selectedElement.id, { color: e.target.value })}
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      {/* 背景色 */}
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm">背景色</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={selectedElement.backgroundColor || '#ffffff'}
                            onChange={(e) => updateTextElement(selectedElement.id, { backgroundColor: e.target.value })}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={selectedElement.backgroundColor || ''}
                            onChange={(e) => updateTextElement(selectedElement.id, { backgroundColor: e.target.value || undefined })}
                            className="flex-1"
                            placeholder="透明（未設定）"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTextElement(selectedElement.id, { backgroundColor: undefined })}
                          className="w-full mt-2"
                        >
                          背景色をクリア
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* テキスト整列 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">テキスト整列</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedElement.textAlign === 'left' ? 'default' : 'outline'}
                          onClick={() => updateTextElement(selectedElement.id, { textAlign: 'left' })}
                          className="flex-1"
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedElement.textAlign === 'center' ? 'default' : 'outline'}
                          onClick={() => updateTextElement(selectedElement.id, { textAlign: 'center' })}
                          className="flex-1"
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedElement.textAlign === 'right' ? 'default' : 'outline'}
                          onClick={() => updateTextElement(selectedElement.id, { textAlign: 'right' })}
                          className="flex-1"
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  テキスト要素を選択してください
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="effects" className="space-y-4">
              {selectedElement ? (
                <div className="space-y-4">
                  {/* テキストシャドウ */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">テキストシャドウ</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="shadow-enable"
                          checked={!!selectedElement.shadow}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateTextElement(selectedElement.id, {
                                shadow: {
                                  color: '#000000',
                                  offsetX: 2,
                                  offsetY: 2,
                                  blur: 4
                                }
                              });
                            } else {
                              updateTextElement(selectedElement.id, { shadow: undefined });
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor="shadow-enable" className="text-sm">
                          シャドウを有効にする
                        </Label>
                      </div>

                      {selectedElement.shadow && (
                        <div className="space-y-3">
                          {/* シャドウ色 */}
                          <div className="space-y-2">
                            <Label className="text-sm">シャドウ色</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={selectedElement.shadow.color}
                                onChange={(e) => updateTextElement(selectedElement.id, {
                                  shadow: { ...selectedElement.shadow!, color: e.target.value }
                                })}
                                className="w-12 h-8 p-1 border rounded"
                              />
                              <Input
                                type="text"
                                value={selectedElement.shadow.color}
                                onChange={(e) => updateTextElement(selectedElement.id, {
                                  shadow: { ...selectedElement.shadow!, color: e.target.value }
                                })}
                                className="flex-1"
                                placeholder="#000000"
                              />
                            </div>
                          </div>

                          {/* X オフセット */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              X オフセット: {selectedElement.shadow.offsetX}px
                            </Label>
                            <Slider
                              value={[selectedElement.shadow.offsetX]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                shadow: { ...selectedElement.shadow!, offsetX: value }
                              })}
                              min={-20}
                              max={20}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* Y オフセット */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              Y オフセット: {selectedElement.shadow.offsetY}px
                            </Label>
                            <Slider
                              value={[selectedElement.shadow.offsetY]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                shadow: { ...selectedElement.shadow!, offsetY: value }
                              })}
                              min={-20}
                              max={20}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* ブラー */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              ブラー: {selectedElement.shadow.blur}px
                            </Label>
                            <Slider
                              value={[selectedElement.shadow.blur]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                shadow: { ...selectedElement.shadow!, blur: value }
                              })}
                              min={0}
                              max={20}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ストローク（縁取り） */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">ストローク（縁取り）</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="stroke-enable"
                          checked={!!selectedElement.stroke}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateTextElement(selectedElement.id, {
                                stroke: {
                                  color: '#000000',
                                  width: 1
                                }
                              });
                            } else {
                              updateTextElement(selectedElement.id, { stroke: undefined });
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor="stroke-enable" className="text-sm">
                          ストロークを有効にする
                        </Label>
                      </div>

                      {selectedElement.stroke && (
                        <div className="space-y-3">
                          {/* ストローク色 */}
                          <div className="space-y-2">
                            <Label className="text-sm">ストローク色</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={selectedElement.stroke.color}
                                onChange={(e) => updateTextElement(selectedElement.id, {
                                  stroke: { ...selectedElement.stroke!, color: e.target.value }
                                })}
                                className="w-12 h-8 p-1 border rounded"
                              />
                              <Input
                                type="text"
                                value={selectedElement.stroke.color}
                                onChange={(e) => updateTextElement(selectedElement.id, {
                                  stroke: { ...selectedElement.stroke!, color: e.target.value }
                                })}
                                className="flex-1"
                                placeholder="#000000"
                              />
                            </div>
                          </div>

                          {/* ストローク幅 */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              ストローク幅: {selectedElement.stroke.width}px
                            </Label>
                            <Slider
                              value={[selectedElement.stroke.width]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                stroke: { ...selectedElement.stroke!, width: value }
                              })}
                              min={1}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* パディング設定 */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">パディング</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="padding-enable"
                          checked={!!selectedElement.padding}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateTextElement(selectedElement.id, {
                                padding: {
                                  top: 8,
                                  right: 12,
                                  bottom: 8,
                                  left: 12
                                }
                              });
                            } else {
                              updateTextElement(selectedElement.id, { padding: undefined });
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor="padding-enable" className="text-sm">
                          パディングを有効にする
                        </Label>
                      </div>

                      {selectedElement.padding && (
                        <div className="space-y-3">
                          {/* 上 */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              上: {selectedElement.padding.top}px
                            </Label>
                            <Slider
                              value={[selectedElement.padding.top]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                padding: { ...selectedElement.padding!, top: value }
                              })}
                              min={0}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* 右 */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              右: {selectedElement.padding.right}px
                            </Label>
                            <Slider
                              value={[selectedElement.padding.right]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                padding: { ...selectedElement.padding!, right: value }
                              })}
                              min={0}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* 下 */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              下: {selectedElement.padding.bottom}px
                            </Label>
                            <Slider
                              value={[selectedElement.padding.bottom]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                padding: { ...selectedElement.padding!, bottom: value }
                              })}
                              min={0}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          {/* 左 */}
                          <div className="space-y-2">
                            <Label className="text-sm">
                              左: {selectedElement.padding.left}px
                            </Label>
                            <Slider
                              value={[selectedElement.padding.left]}
                              onValueChange={([value]) => updateTextElement(selectedElement.id, {
                                padding: { ...selectedElement.padding!, left: value }
                              })}
                              min={0}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ボーダーラディウス */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">角の丸み</h3>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">
                          ボーダーラディウス: {selectedElement.borderRadius || 0}px
                        </Label>
                        <Slider
                          value={[selectedElement.borderRadius || 0]}
                          onValueChange={([value]) => updateTextElement(selectedElement.id, { borderRadius: value })}
                          min={0}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* エフェクトプリセット */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">エフェクトプリセット</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTextElement(selectedElement.id, {
                            shadow: { color: '#000000', offsetX: 2, offsetY: 2, blur: 4 },
                            stroke: undefined,
                            backgroundColor: undefined,
                            borderRadius: 0
                          })}
                          className="text-xs"
                        >
                          シンプルシャドウ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTextElement(selectedElement.id, {
                            shadow: undefined,
                            stroke: { color: '#ffffff', width: 2 },
                            backgroundColor: undefined,
                            borderRadius: 0
                          })}
                          className="text-xs"
                        >
                          白縁取り
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTextElement(selectedElement.id, {
                            shadow: { color: '#000000', offsetX: 0, offsetY: 0, blur: 8 },
                            stroke: undefined,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: { top: 8, right: 12, bottom: 8, left: 12 },
                            borderRadius: 8
                          })}
                          className="text-xs"
                        >
                          ソフトボックス
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTextElement(selectedElement.id, {
                            shadow: { color: '#ff0000', offsetX: 3, offsetY: 3, blur: 0 },
                            stroke: { color: '#000000', width: 1 },
                            backgroundColor: '#ffff00',
                            padding: { top: 4, right: 8, bottom: 4, left: 8 },
                            borderRadius: 0
                          })}
                          className="text-xs"
                        >
                          ポップスタイル
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTextElement(selectedElement.id, {
                          shadow: undefined,
                          stroke: undefined,
                          backgroundColor: undefined,
                          padding: undefined,
                          borderRadius: 0
                        })}
                        className="w-full mt-3 text-xs"
                      >
                        すべてのエフェクトをクリア
                      </Button>
                    </CardContent>
                  </Card>
                </div>
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
                  zIndex: element.zIndex + 10
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