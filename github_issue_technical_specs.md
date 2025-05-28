# バナーコピー生成機能 - 技術仕様書

## API エンドポイント設計

### 1. バナーコピー生成API

#### `POST /api/banner-copies/generate`
```typescript
// リクエスト
interface GenerateBannerCopyRequest {
  briefId: string;
  persona: string;
  problem: string;
  benefit: string;
  requiredWords?: string[];
}

// レスポンス
interface GenerateBannerCopyResponse {
  success: boolean;
  data?: {
    id: string;
    briefId: string;
    mainText: string;
    subText: string;
    ctaText: string;
    createdAt: string;
  };
  error?: string;
}
```

#### `PUT /api/banner-copies/{id}`
```typescript
// リクエスト
interface UpdateBannerCopyRequest {
  mainText?: string;
  subText?: string;
  ctaText?: string;
}

// レスポンス
interface UpdateBannerCopyResponse {
  success: boolean;
  data?: BannerCopy;
  error?: string;
}
```

#### `GET /api/banner-copies/brief/{briefId}`
```typescript
// レスポンス
interface GetBannerCopiesResponse {
  success: boolean;
  data?: BannerCopy[];
  error?: string;
}
```

### 2. バナー生成API

#### `POST /api/banners/generate`
```typescript
// リクエスト
interface GenerateBannerRequest {
  bannerCopyId: string;
  size: '728x90' | '1080x1080' | '1080x1920' | string;
  backgroundStyle: 'gradient' | 'pattern';
  patternType?: 'dots' | 'stripes' | 'grid' | 'diamond';
}

// レスポンス
interface GenerateBannerResponse {
  success: boolean;
  data?: {
    creativeId: string;
    imageUrl: string;
    size: string;
    backgroundStyle: string;
  }[];
  error?: string;
}
```

## データベーススキーマ詳細

### banner_copies テーブル
```sql
CREATE TABLE IF NOT EXISTS public.banner_copies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE NOT NULL,
  main_text TEXT NOT NULL CHECK (char_length(main_text) <= 30),
  sub_text TEXT CHECK (char_length(sub_text) <= 60),
  cta_text TEXT NOT NULL CHECK (char_length(cta_text) <= 15),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- インデックス
CREATE INDEX idx_banner_copies_brief_id ON public.banner_copies(brief_id);
CREATE INDEX idx_banner_copies_created_at ON public.banner_copies(created_at);
```

### creatives テーブル拡張
```sql
-- 既存テーブルに列を追加
ALTER TABLE public.creatives 
ADD COLUMN IF NOT EXISTS banner_copy_id UUID REFERENCES public.banner_copies(id),
ADD COLUMN IF NOT EXISTS banner_size TEXT DEFAULT '1200x628' CHECK (banner_size ~ '^\d+x\d+$'),
ADD COLUMN IF NOT EXISTS background_style TEXT DEFAULT 'gradient' CHECK (background_style IN ('gradient', 'pattern')),
ADD COLUMN IF NOT EXISTS pattern_type TEXT CHECK (pattern_type IN ('dots', 'stripes', 'grid', 'diamond'));

-- インデックス
CREATE INDEX idx_creatives_banner_copy_id ON public.creatives(banner_copy_id);
CREATE INDEX idx_creatives_banner_size ON public.creatives(banner_size);
```

## React コンポーネント設計

### 1. BannerCopyEditor コンポーネント
```typescript
interface BannerCopyEditorProps {
  briefId: string;
  initialCopy?: BannerCopy;
  onCopyChange: (copy: BannerCopy) => void;
  onSave: (copy: BannerCopy) => Promise<void>;
}

const BannerCopyEditor: React.FC<BannerCopyEditorProps> = ({
  briefId,
  initialCopy,
  onCopyChange,
  onSave
}) => {
  // 実装詳細
};
```

### 2. CopyField コンポーネント
```typescript
interface CopyFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  multiline?: boolean;
}

const CopyField: React.FC<CopyFieldProps> = ({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  multiline = false
}) => {
  // 文字数制限とリアルタイムバリデーション
};
```

### 3. BannerSizeSelector コンポーネント
```typescript
interface BannerSize {
  id: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  description?: string;
}

interface BannerSizeSelectorProps {
  selectedSize: string;
  onSizeChange: (size: BannerSize) => void;
  availableSizes: BannerSize[];
}

const BannerSizeSelector: React.FC<BannerSizeSelectorProps> = ({
  selectedSize,
  onSizeChange,
  availableSizes
}) => {
  // サイズ選択UI
};
```

### 4. BackgroundStyleSelector コンポーネント
```typescript
interface BackgroundStyle {
  id: string;
  name: string;
  type: 'gradient' | 'pattern';
  preview: string; // CSS or image URL
  description: string;
}

interface BackgroundStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: BackgroundStyle) => void;
  availableStyles: BackgroundStyle[];
}

const BackgroundStyleSelector: React.FC<BackgroundStyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  availableStyles
}) => {
  // 背景スタイル選択UI
};
```

### 5. BannerPreview コンポーネント
```typescript
interface BannerPreviewProps {
  copy: BannerCopy;
  size: BannerSize;
  backgroundStyle: BackgroundStyle;
  className?: string;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({
  copy,
  size,
  backgroundStyle,
  className
}) => {
  // Canvas APIまたはCSS/HTMLでのプレビュー生成
};
```

## AI プロンプト設計

### バナーコピー生成プロンプト
```typescript
const generateCopyPrompt = (
  persona: string,
  problem: string,
  benefit: string,
  requiredWords: string[]
) => `
あなたは優秀な広告コピーライターです。以下の情報を基に、効果的なバナー広告のコピーを生成してください。

## 入力情報
- ペルソナ: ${persona}
- 課題: ${problem}
- ベネフィット: ${benefit}
- 必須ワード: ${requiredWords.join(', ')}

## 出力要件
以下の3つの要素を生成してください：

1. **メインテキスト** (20-30文字)
   - インパクトのあるキャッチコピー
   - ペルソナの注意を引く表現
   - 必須ワードを自然に含める

2. **サブテキスト** (40-60文字)
   - ベネフィットを具体的に説明
   - 課題解決の価値を明確に表現
   - 読みやすく理解しやすい文章

3. **CTAボタン文言** (5-15文字)
   - 行動を促す明確な表現
   - 緊急性や価値を感じさせる
   - クリックしたくなる魅力的な文言

## 出力形式
JSON形式で以下のように出力してください：
{
  "mainText": "メインテキスト",
  "subText": "サブテキスト", 
  "ctaText": "CTAボタン文言"
}
`;
```

## Canvas API バナー生成

### バナー生成関数
```typescript
interface BannerGenerationOptions {
  copy: BannerCopy;
  size: { width: number; height: number };
  backgroundStyle: BackgroundStyle;
  fonts?: {
    main: string;
    sub: string;
    cta: string;
  };
  colors?: {
    primary: string;
    secondary: string;
    text: string;
    ctaBackground: string;
    ctaText: string;
  };
}

const generateBannerImage = async (
  options: BannerGenerationOptions
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = options.size.width;
  canvas.height = options.size.height;
  
  // 背景描画
  await drawBackground(ctx, options.backgroundStyle, options.size);
  
  // テキスト描画
  drawMainText(ctx, options.copy.mainText, options);
  drawSubText(ctx, options.copy.subText, options);
  drawCTAButton(ctx, options.copy.ctaText, options);
  
  return canvas.toDataURL('image/png');
};
```

### 背景パターン生成
```typescript
const generatePatternBackground = (
  ctx: CanvasRenderingContext2D,
  patternType: string,
  size: { width: number; height: number }
) => {
  switch (patternType) {
    case 'dots':
      generateDotsPattern(ctx, size);
      break;
    case 'stripes':
      generateStripesPattern(ctx, size);
      break;
    case 'grid':
      generateGridPattern(ctx, size);
      break;
    case 'diamond':
      generateDiamondPattern(ctx, size);
      break;
  }
};
```

## パフォーマンス最適化

### 1. 画像生成の最適化
```typescript
// Web Workers を使用した非同期処理
const generateBannerInWorker = (options: BannerGenerationOptions) => {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker('/workers/banner-generator.js');
    
    worker.postMessage(options);
    
    worker.onmessage = (event) => {
      resolve(event.data.imageUrl);
      worker.terminate();
    };
    
    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
  });
};
```

### 2. キャッシュ戦略
```typescript
// Redis または メモリキャッシュ
const getCachedBannerCopy = async (briefId: string): Promise<BannerCopy | null> => {
  const cacheKey = `banner_copy:${briefId}`;
  const cached = await redis.get(cacheKey);
  return cached ? JSON.parse(cached) : null;
};

const setCachedBannerCopy = async (briefId: string, copy: BannerCopy) => {
  const cacheKey = `banner_copy:${briefId}`;
  await redis.setex(cacheKey, 3600, JSON.stringify(copy)); // 1時間キャッシュ
};
```

## エラーハンドリング

### API エラーレスポンス
```typescript
enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  GENERATION_FAILED = 'GENERATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
}
```

### フロントエンドエラーハンドリング
```typescript
const useBannerCopyGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateCopy = async (briefData: BriefData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/banner-copies/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }
      
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { generateCopy, isLoading, error };
};
```

## テスト戦略

### 1. ユニットテスト
```typescript
// バナーコピー生成のテスト
describe('BannerCopyGenerator', () => {
  test('should generate valid copy with required fields', async () => {
    const briefData = {
      persona: 'テストペルソナ',
      problem: 'テスト課題',
      benefit: 'テストベネフィット',
      requiredWords: ['テスト', 'AI']
    };
    
    const result = await generateBannerCopy(briefData);
    
    expect(result.mainText).toBeDefined();
    expect(result.mainText.length).toBeLessThanOrEqual(30);
    expect(result.subText.length).toBeLessThanOrEqual(60);
    expect(result.ctaText.length).toBeLessThanOrEqual(15);
  });
});
```

### 2. 統合テスト
```typescript
// API エンドポイントのテスト
describe('Banner Copy API', () => {
  test('POST /api/banner-copies/generate', async () => {
    const response = await request(app)
      .post('/api/banner-copies/generate')
      .send(testBriefData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('mainText');
  });
});
```

### 3. E2Eテスト
```typescript
// Playwright を使用したE2Eテスト
test('banner copy generation flow', async ({ page }) => {
  await page.goto('/brief');
  
  // フォーム入力
  await page.fill('[name="persona"]', 'テストペルソナ');
  await page.fill('[name="problem"]', 'テスト課題');
  await page.fill('[name="benefit"]', 'テストベネフィット');
  
  // 生成ボタンクリック
  await page.click('button:has-text("クリエイティブを生成")');
  
  // 結果確認
  await expect(page.locator('[data-testid="main-text"]')).toBeVisible();
  await expect(page.locator('[data-testid="sub-text"]')).toBeVisible();
  await expect(page.locator('[data-testid="cta-text"]')).toBeVisible();
});
``` 