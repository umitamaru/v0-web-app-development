import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabase URLとAPIキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-testing';

// 環境変数のチェックと警告（テスト用に警告のみに変更）
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('警告: Supabase環境変数が設定されていません。テストモードで実行します。');
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベースの型定義
export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name?: string;
  organization?: string;
  avatar_url?: string;
};

export type Interview = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  file_url?: string;
  file_type?: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis_result?: any;
};

export type Brief = {
  id: string;
  user_id: string;
  interview_id?: string;
  created_at: string;
  updated_at: string;
  persona: string;
  problem: string;
  benefit: string;
  required_words?: string;
  status: 'draft' | 'generating' | 'completed' | 'approved';
};

export type Creative = {
  id: string;
  brief_id: string;
  created_at: string;
  updated_at: string;
  size: '1200x628' | '1080x1080' | '1080x1920';
  image_url: string;
  copy: string;
  status: 'created' | 'liked' | 'disliked' | 'approved' | 'uploaded';
  meta_ad_id?: string;
  performance_metrics?: any;
}; 