import { TextElement, BannerConfig } from './BannerEditor';
import { BannerCopy } from '@/lib/supabaseUtils';

// レイアウトバリエーションの型
export interface LayoutVariation {
  id: string;
  name: string;
  description: string;
  textElements: TextElement[];
}

// バナーレイアウト生成クラス
export class BannerLayoutGenerator {
  private bannerConfig: BannerConfig;
  private bannerCopy: BannerCopy;
  private customImageUrl?: string;

  constructor(bannerConfig: BannerConfig, bannerCopy: BannerCopy, customImageUrl?: string) {
    this.bannerConfig = bannerConfig;
    this.bannerCopy = bannerCopy;
    this.customImageUrl = customImageUrl;
  }

  // 3つのレイアウトバリエーションを生成
  generateVariations(): LayoutVariation[] {
    return [
      this.generateCenteredLayout(),
      this.generateLeftAlignedLayout(),
      this.generateRightAlignedLayout()
    ];
  }

  // バリエーション1: 中央配置レイアウト
  private generateCenteredLayout(): LayoutVariation {
    const { width, height } = this.bannerConfig;
    const elements: TextElement[] = [];

    // メインテキスト（中央上部）
    if (this.bannerCopy.main_text) {
      elements.push({
        id: `main-${Date.now()}`,
        text: this.bannerCopy.main_text,
        x: width * 0.1,
        y: height * 0.2,
        width: width * 0.8,
        height: height * 0.25,
        fontSize: Math.min(width / 15, 36),
        fontFamily: '"Impact", sans-serif',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textAlign: 'center',
        zIndex: 1,
        padding: { top: 8, right: 16, bottom: 8, left: 16 },
        borderRadius: 8,
        shadow: { color: '#000000', offsetX: 2, offsetY: 2, blur: 8 }
      });
    }

    // サブテキスト（中央中部）
    if (this.bannerCopy.sub_text) {
      elements.push({
        id: `sub-${Date.now() + 1}`,
        text: this.bannerCopy.sub_text,
        x: width * 0.1,
        y: height * 0.5,
        width: width * 0.8,
        height: height * 0.2,
        fontSize: Math.min(width / 25, 18),
        fontFamily: '"Helvetica", sans-serif',
        fontWeight: 'normal',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        zIndex: 2,
        padding: { top: 6, right: 12, bottom: 6, left: 12 },
        borderRadius: 6
      });
    }

    // CTAボタン（中央下部）
    if (this.bannerCopy.cta_text) {
      elements.push({
        id: `cta-${Date.now() + 2}`,
        text: this.bannerCopy.cta_text,
        x: width * 0.3,
        y: height * 0.75,
        width: width * 0.4,
        height: height * 0.15,
        fontSize: Math.min(width / 20, 24),
        fontFamily: '"Arial", sans-serif',
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: '#ffff00',
        textAlign: 'center',
        zIndex: 3,
        padding: { top: 8, right: 16, bottom: 8, left: 16 },
        borderRadius: 25,
        stroke: { color: '#000000', width: 2 },
        shadow: { color: '#000000', offsetX: 3, offsetY: 3, blur: 6 }
      });
    }

    return {
      id: 'centered',
      name: '中央配置',
      description: 'インパクト重視の中央配置レイアウト',
      textElements: elements
    };
  }

  // バリエーション2: 左寄せレイアウト
  private generateLeftAlignedLayout(): LayoutVariation {
    const { width, height } = this.bannerConfig;
    const elements: TextElement[] = [];

    // メインテキスト（左上）
    if (this.bannerCopy.main_text) {
      elements.push({
        id: `main-left-${Date.now()}`,
        text: this.bannerCopy.main_text,
        x: width * 0.05,
        y: height * 0.1,
        width: width * 0.6,
        height: height * 0.3,
        fontSize: Math.min(width / 18, 32),
        fontFamily: '"Georgia", serif',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: undefined,
        textAlign: 'left',
        zIndex: 1,
        stroke: { color: '#000000', width: 3 },
        shadow: { color: '#000000', offsetX: 2, offsetY: 2, blur: 4 }
      });
    }

    // サブテキスト（左中）
    if (this.bannerCopy.sub_text) {
      elements.push({
        id: `sub-left-${Date.now() + 1}`,
        text: this.bannerCopy.sub_text,
        x: width * 0.05,
        y: height * 0.45,
        width: width * 0.55,
        height: height * 0.25,
        fontSize: Math.min(width / 30, 16),
        fontFamily: '"Helvetica", sans-serif',
        fontWeight: 'normal',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'left',
        zIndex: 2,
        padding: { top: 8, right: 12, bottom: 8, left: 12 },
        borderRadius: 4
      });
    }

    // CTAボタン（左下）
    if (this.bannerCopy.cta_text) {
      elements.push({
        id: `cta-left-${Date.now() + 2}`,
        text: this.bannerCopy.cta_text,
        x: width * 0.05,
        y: height * 0.75,
        width: width * 0.35,
        height: height * 0.18,
        fontSize: Math.min(width / 22, 20),
        fontFamily: '"Arial", sans-serif',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#ff4444',
        textAlign: 'center',
        zIndex: 3,
        padding: { top: 8, right: 16, bottom: 8, left: 16 },
        borderRadius: 8,
        shadow: { color: '#000000', offsetX: 3, offsetY: 3, blur: 8 }
      });
    }

    return {
      id: 'left',
      name: '左寄せ',
      description: '読みやすさ重視の左寄せレイアウト',
      textElements: elements
    };
  }

  // バリエーション3: 右寄せレイアウト
  private generateRightAlignedLayout(): LayoutVariation {
    const { width, height } = this.bannerConfig;
    const elements: TextElement[] = [];

    // メインテキスト（右上）
    if (this.bannerCopy.main_text) {
      elements.push({
        id: `main-right-${Date.now()}`,
        text: this.bannerCopy.main_text,
        x: width * 0.35,
        y: height * 0.15,
        width: width * 0.6,
        height: height * 0.25,
        fontSize: Math.min(width / 16, 28),
        fontFamily: '"Trebuchet MS", sans-serif',
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'right',
        zIndex: 1,
        padding: { top: 10, right: 16, bottom: 10, left: 16 },
        borderRadius: 12,
        stroke: { color: '#333333', width: 1 }
      });
    }

    // サブテキスト（右中）
    if (this.bannerCopy.sub_text) {
      elements.push({
        id: `sub-right-${Date.now() + 1}`,
        text: this.bannerCopy.sub_text,
        x: width * 0.4,
        y: height * 0.45,
        width: width * 0.55,
        height: height * 0.2,
        fontSize: Math.min(width / 28, 14),
        fontFamily: '"Verdana", sans-serif',
        fontWeight: 'normal',
        color: '#333333',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'right',
        zIndex: 2,
        padding: { top: 6, right: 12, bottom: 6, left: 12 },
        borderRadius: 6
      });
    }

    // CTAボタン（右下）
    if (this.bannerCopy.cta_text) {
      elements.push({
        id: `cta-right-${Date.now() + 2}`,
        text: this.bannerCopy.cta_text,
        x: width * 0.6,
        y: height * 0.7,
        width: width * 0.35,
        height: height * 0.2,
        fontSize: Math.min(width / 24, 18),
        fontFamily: '"Arial", sans-serif',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#00aa44',
        textAlign: 'center',
        zIndex: 3,
        padding: { top: 8, right: 16, bottom: 8, left: 16 },
        borderRadius: 20,
        shadow: { color: '#004422', offsetX: 2, offsetY: 4, blur: 6 }
      });
    }

    return {
      id: 'right',
      name: '右寄せ',
      description: 'モダンでスタイリッシュな右寄せレイアウト',
      textElements: elements
    };
  }
}

// バナーレイアウトプレビューコンポーネント
interface BannerLayoutPreviewProps {
  variation: LayoutVariation;
  bannerConfig: BannerConfig;
  customImageUrl?: string;
  isSelected: boolean;
  onClick: () => void;
}

export function BannerLayoutPreview({
  variation,
  bannerConfig,
  customImageUrl,
  isSelected,
  onClick
}: BannerLayoutPreviewProps) {
  const scale = 0.3; // プレビュー用のスケール

  return (
    <div 
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="mb-2">
        <h3 className="font-medium text-sm">{variation.name}</h3>
        <p className="text-xs text-gray-600">{variation.description}</p>
      </div>
      
      <div 
        className="relative border border-gray-300 mx-auto"
        style={{
          width: bannerConfig.width * scale,
          height: bannerConfig.height * scale,
          backgroundColor: bannerConfig.backgroundColor,
          backgroundImage: customImageUrl ? `url(${customImageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* カスタム画像のオーバーレイ */}
        {customImageUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        )}
        
        {/* テキスト要素のプレビュー */}
        {variation.textElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-xs"
            style={{
              left: element.x * scale,
              top: element.y * scale,
              width: element.width * scale,
              height: element.height * scale,
              fontSize: (element.fontSize * scale) + 'px',
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              color: element.color,
              backgroundColor: element.backgroundColor,
              textAlign: element.textAlign,
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.textAlign === 'center' ? 'center' : 
                             element.textAlign === 'right' ? 'flex-end' : 'flex-start',
              borderRadius: element.borderRadius ? (element.borderRadius * scale) + 'px' : undefined,
              padding: element.padding ? 
                `${element.padding.top * scale}px ${element.padding.right * scale}px ${element.padding.bottom * scale}px ${element.padding.left * scale}px` : 
                undefined,
              textShadow: element.shadow ? 
                `${element.shadow.offsetX * scale}px ${element.shadow.offsetY * scale}px ${element.shadow.blur * scale}px ${element.shadow.color}` : 
                undefined,
              WebkitTextStroke: element.stroke ? 
                `${element.stroke.width * scale}px ${element.stroke.color}` : 
                undefined,
              zIndex: element.zIndex + 10
            }}
          >
            {element.text}
          </div>
        ))}
      </div>
    </div>
  );
} 