"use client"

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, validateImageFile, resizeImage } from '@/lib/supabaseUtils';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  onRemoveImage?: () => void;
}

export default function ImageUploader({ 
  onImageUpload, 
  currentImageUrl, 
  onRemoveImage 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // currentImageUrlが変更された時にpreviewUrlを同期
  useEffect(() => {
    console.log('ImageUploader: currentImageUrl changed to:', currentImageUrl);
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  // デバッグ用: previewUrlの変更をログ出力
  useEffect(() => {
    console.log('ImageUploader: previewUrl updated to:', previewUrl);
  }, [previewUrl]);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // ファイルバリデーション
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'ファイルが無効です');
        return;
      }

      console.log('ImageUploader: Starting file selection process for:', file.name);

      // プレビュー表示用の一時的なObjectURL
      const tempObjectUrl = URL.createObjectURL(file);
      setPreviewUrl(tempObjectUrl);

      // 画像をリサイズ
      const resizedFile = await resizeImage(file, 1920, 1080, 0.8);
      console.log('ImageUploader: Image resized successfully');

      // アップロード
      const { data, error: uploadError } = await uploadImage(resizedFile);
      
      if (uploadError) {
        throw new Error(uploadError.message || 'アップロードに失敗しました');
      }

      if (data?.url) {
        console.log('ImageUploader: Upload successful, calling onImageUpload with URL:', data.url);
        onImageUpload(data.url);
        
        // 一時的なObjectURLをクリーンアップ
        URL.revokeObjectURL(tempObjectUrl);
        
        // 最終的なURLでプレビューを更新
        setPreviewUrl(data.url);
      } else {
        throw new Error('アップロード後のURLが取得できませんでした');
      }
    } catch (err) {
      console.error('画像アップロードエラー:', err);
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          カスタム背景画像
        </CardTitle>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          // 画像プレビュー表示
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="アップロード画像プレビュー"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              この画像がバナーの背景として使用されます
            </p>
          </div>
        ) : (
          // アップロードエリア
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">アップロード中...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    画像をドラッグ&ドロップ
                  </p>
                  <p className="text-sm text-gray-600">
                    または <span className="text-blue-600 underline">クリックして選択</span>
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  <p>対応形式: JPG, PNG, WebP</p>
                  <p>最大サイズ: 5MB</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ファイル選択用の隠しinput */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!previewUrl && (
          <div className="mt-4">
            <Button
              onClick={openFileDialog}
              disabled={isUploading}
              className="w-full gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              ファイルを選択
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 