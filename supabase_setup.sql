-- Supabaseテーブル作成SQL

-- ユーザーテーブル（Supabaseの認証機能と連携）
-- 備考: Supabaseではauth.usersテーブルが自動的に作成されるため、それと連携する
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  organization TEXT,
  avatar_url TEXT
);

-- インタビューデータを保存するテーブル
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT, -- インタビュー録の音声/テキストファイルへのパスがある場合
  file_type TEXT, -- ファイルのタイプ（audio/mp3, text/plain など）
  analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  analysis_result JSONB -- AIによる分析結果をJSON形式で保存
);

-- ブリーフデータを保存するテーブル
CREATE TABLE IF NOT EXISTS public.briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE SET NULL, -- インタビューからの作成時に関連付け
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  persona TEXT NOT NULL,
  problem TEXT NOT NULL,
  benefit TEXT NOT NULL,
  required_words TEXT, -- カンマ区切りでキーワードを保存
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'approved'))
);

-- バナーコピーを保存するテーブル（新規追加）
CREATE TABLE IF NOT EXISTS public.banner_copies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  main_text TEXT NOT NULL CHECK (char_length(main_text) <= 30),
  sub_text TEXT CHECK (char_length(sub_text) <= 60),
  cta_text TEXT NOT NULL CHECK (char_length(cta_text) <= 15)
);

-- 生成されたクリエイティブを保存するテーブル（拡張）
CREATE TABLE IF NOT EXISTS public.creatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE NOT NULL,
  banner_copy_id UUID REFERENCES public.banner_copies(id) ON DELETE SET NULL, -- バナーコピーとの関連付け
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  size TEXT NOT NULL DEFAULT '1080x1080' CHECK (size ~ '^\d+x\d+$'), -- バナーサイズ（正規表現でフォーマット検証）
  banner_size TEXT DEFAULT '1080x1080' CHECK (banner_size ~ '^\d+x\d+$'), -- 後方互換性のため
  background_style TEXT DEFAULT 'pattern' CHECK (background_style IN ('gradient', 'pattern')),
  pattern_type TEXT DEFAULT 'dots' CHECK (pattern_type IN ('dots', 'stripes', 'grid', 'diamond')),
  image_url TEXT NOT NULL,
  copy TEXT, -- 従来の広告コピー（後方互換性のため保持）
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'liked', 'disliked', 'approved', 'uploaded')),
  meta_ad_id TEXT, -- Meta Adsにアップロードした場合のID
  performance_metrics JSONB -- 広告パフォーマンス指標（インプレッション数、クリック数など）
);

-- テーブル更新時に自動的にupdated_atを更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを各テーブルに適用
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_briefs_updated_at
BEFORE UPDATE ON public.briefs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_banner_copies_updated_at
BEFORE UPDATE ON public.banner_copies
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_creatives_updated_at
BEFORE UPDATE ON public.creatives
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_banner_copies_brief_id ON public.banner_copies(brief_id);
CREATE INDEX IF NOT EXISTS idx_banner_copies_created_at ON public.banner_copies(created_at);
CREATE INDEX IF NOT EXISTS idx_creatives_banner_copy_id ON public.creatives(banner_copy_id);
CREATE INDEX IF NOT EXISTS idx_creatives_banner_size ON public.creatives(banner_size);
CREATE INDEX IF NOT EXISTS idx_creatives_background_style ON public.creatives(background_style);

-- RLSポリシー（行レベルセキュリティ）の設定
-- 各テーブルに対してユーザーが自分のデータのみにアクセスできるように制限

-- プロファイルのRLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_policy ON public.profiles
  USING (id = auth.uid());

-- インタビューのRLS
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY interviews_policy ON public.interviews
  USING (user_id = auth.uid());

-- ブリーフのRLS
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY briefs_policy ON public.briefs
  USING (user_id = auth.uid());

-- バナーコピーのRLS（ブリーフを通じてユーザーと関連付け）
ALTER TABLE public.banner_copies ENABLE ROW LEVEL SECURITY;
CREATE POLICY banner_copies_policy ON public.banner_copies
  USING ((SELECT user_id FROM public.briefs WHERE id = brief_id) = auth.uid());

-- クリエイティブのRLS（ブリーフを通じてユーザーと関連付け）
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY creatives_policy ON public.creatives
  USING ((SELECT user_id FROM public.briefs WHERE id = brief_id) = auth.uid()); 