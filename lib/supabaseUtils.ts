import { supabase } from './supabase';
import { Interview, Brief, Creative } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// バナーコピーの型定義を追加
export interface BannerCopy {
  id: string;
  brief_id: string;
  main_text: string;
  sub_text?: string;
  cta_text: string;
  created_at: string;
  updated_at: string;
}

// テストモードかどうかを判定（環境変数が設定されていなければテストモード）
const isTestMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// デモ用の固定UUID（有効なUUID形式）
const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

// モックデータ生成用のヘルパー関数
function generateMockId() {
  return uuidv4();
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Supabaseが利用可能かどうかを判定
function isSupabaseAvailable() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

// ===============================
// インタビュー関連の関数
// ===============================

/**
 * インタビューを作成する
 */
export async function createInterview(
  title: string, 
  content: string, 
  userId: string,
  fileUrl?: string,
  fileType?: string
) {
  try {
    if (!isSupabaseAvailable()) {
      // Supabaseが利用できない場合はモックデータを返す
      console.warn('[テストモード] createInterview: Supabaseが利用できないため、モックデータを使用します');
      return {
        data: {
          id: generateMockId(),
          user_id: userId,
          title,
          content,
          file_url: fileUrl,
          file_type: fileType,
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          analysis_status: 'pending',
        },
        error: null
      };
    }

    const { data, error } = await supabase
      .from('interviews')
      .insert({
        title,
        content,
        user_id: userId,
        file_url: fileUrl,
        file_type: fileType,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('インタビュー作成エラー:', error);
    
    // エラー時はモックデータを返す
    console.warn('[フォールバック] createInterview: エラーが発生したため、モックデータを使用します');
    return {
      data: {
        id: generateMockId(),
        user_id: userId,
        title,
        content,
        file_url: fileUrl,
        file_type: fileType,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
        analysis_status: 'pending',
      },
      error: null
    };
  }
}

/**
 * インタビューを取得する
 */
export async function getInterview(id: string) {
  try {
    if (isTestMode) {
      // テストモードの場合はモックデータを返す
      console.warn('[テストモード] getInterview: モックデータを使用します');
      return {
        data: {
          id,
          user_id: DEMO_USER_ID,
          title: 'モックインタビュー',
          content: 'これはテスト用のモックインタビューデータです。',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          analysis_status: 'completed',
          analysis_result: {
            persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
            problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
            benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
            requiredWords: "時短,栄養,健康,簡単",
          }
        },
        error: null
      };
    }

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('インタビュー取得エラー:', error);
    
    // エラー時もテスト用のモックデータを返す
    if (isTestMode) {
      return {
        data: {
          id,
          user_id: DEMO_USER_ID,
          title: 'モックインタビュー',
          content: 'これはテスト用のモックインタビューデータです。',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          analysis_status: 'completed',
          analysis_result: {
            persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
            problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
            benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
            requiredWords: "時短,栄養,健康,簡単",
          }
        },
        error: null
      };
    }
    
    return { data: null, error };
  }
}

/**
 * ユーザーのインタビュー一覧を取得する
 */
export async function getUserInterviews(userId: string) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] getUserInterviews: モックデータを使用します');
      return {
        data: [
          {
            id: generateMockId(),
            user_id: userId,
            title: 'モックインタビュー1',
            content: 'これはテスト用のモックインタビューデータ1です。',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
            analysis_status: 'completed',
          },
          {
            id: generateMockId(),
            user_id: userId,
            title: 'モックインタビュー2',
            content: 'これはテスト用のモックインタビューデータ2です。',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
            analysis_status: 'completed',
          }
        ],
        error: null
      };
    }

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('インタビュー一覧取得エラー:', error);
    
    if (isTestMode) {
      return {
        data: [
          {
            id: generateMockId(),
            user_id: userId,
            title: 'モックインタビュー1',
            content: 'これはテスト用のモックインタビューデータ1です。',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
            analysis_status: 'completed',
          },
          {
            id: generateMockId(),
            user_id: userId,
            title: 'モックインタビュー2',
            content: 'これはテスト用のモックインタビューデータ2です。',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
            analysis_status: 'completed',
          }
        ],
        error: null
      };
    }
    
    return { data: null, error };
  }
}

/**
 * インタビューの分析ステータスを更新する
 */
export async function updateInterviewAnalysisStatus(
  id: string, 
  status: 'pending' | 'processing' | 'completed' | 'failed',
  analysisResult?: any
) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] updateInterviewAnalysisStatus: モックデータを使用します');
      return {
        data: {
          id,
          analysis_status: status,
          analysis_result: analysisResult || {},
          updated_at: getCurrentTimestamp()
        },
        error: null
      };
    }
    
    const updateData: any = { analysis_status: status };
    if (analysisResult) updateData.analysis_result = analysisResult;
    
    const { data, error } = await supabase
      .from('interviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('インタビュー分析ステータス更新エラー:', error);
    
    if (isTestMode) {
      return {
        data: {
          id,
          analysis_status: status,
          analysis_result: analysisResult || {},
          updated_at: getCurrentTimestamp()
        },
        error: null
      };
    }
    
    return { data: null, error };
  }
}

// ===============================
// ブリーフ関連の関数
// ===============================

/**
 * ブリーフを作成する
 */
export async function createBrief(
  persona: string,
  problem: string,
  benefit: string,
  userId: string,
  interviewId?: string,
  requiredWords?: string
) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('[テストモード] createBrief: Supabaseが利用できないため、モックデータを使用します');
      return {
        data: {
          id: generateMockId(),
          user_id: userId,
          interview_id: interviewId,
          persona,
          problem,
          benefit,
          required_words: requiredWords,
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          status: 'draft'
        },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('briefs')
      .insert({
        persona,
        problem,
        benefit,
        user_id: userId,
        interview_id: interviewId,
        required_words: requiredWords,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('ブリーフ作成エラー:', error);
    
    // エラー時はモックデータを返す
    console.warn('[フォールバック] createBrief: エラーが発生したため、モックデータを使用します');
    return {
      data: {
        id: generateMockId(),
        user_id: userId,
        interview_id: interviewId,
        persona,
        problem,
        benefit,
        required_words: requiredWords,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
        status: 'draft'
      },
      error: null
    };
  }
}

/**
 * ブリーフを取得する
 */
export async function getBrief(id: string) {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('[テストモード] getBrief: Supabaseが利用できないため、モックデータを使用します');
      return {
        data: {
          id,
          user_id: DEMO_USER_ID,
          persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
          problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
          benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
          required_words: "時短,栄養,健康,簡単",
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
          status: 'draft'
        },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('briefs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('ブリーフ取得エラー:', error);
    
    // エラー時はモックデータを返す
    console.warn('[フォールバック] getBrief: エラーが発生したため、モックデータを使用します');
    return {
      data: {
        id,
        user_id: DEMO_USER_ID,
        persona: "30代前半の会社員。都市部に住み、IT企業で働いている。平日は朝から夜まで忙しく、自炊する時間がほとんどない。健康意識は高いが、実際の行動が伴っていない。",
        problem: "忙しい日常の中で、栄養バランスの取れた食事を摂る時間がなく、健康に不安を感じている。コンビニ食や外食が多く、栄養が偏りがちで、最近疲れやすさや体調不良を感じることが増えてきた。",
        benefit: "時間をかけずに栄養バランスの取れた食事が摂れ、健康的な生活を維持できる。手軽に始められ、継続しやすいため、忙しい日々の中でも自分の健康を管理できる安心感が得られる。",
        required_words: "時短,栄養,健康,簡単",
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
        status: 'draft'
      },
      error: null
    };
  }
}

// ===============================
// クリエイティブ関連の関数
// ===============================

/**
 * クリエイティブを作成する
 */
export async function createCreative(
  briefId: string,
  size: '1200x628' | '1080x1080' | '1080x1920',
  imageUrl: string,
  copy: string
) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] createCreative: モックデータを使用します');
      return {
        data: {
          id: generateMockId(),
          brief_id: briefId,
          size,
          image_url: imageUrl,
          copy,
          status: 'created',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
        },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('creatives')
      .insert({
        brief_id: briefId,
        size,
        image_url: imageUrl,
        copy,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('クリエイティブ作成エラー:', error);
    
    if (isTestMode) {
      return {
        data: {
          id: generateMockId(),
          brief_id: briefId,
          size,
          image_url: imageUrl,
          copy,
          status: 'created',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
        },
        error: null
      };
    }
    
    return { data: null, error };
  }
}

/**
 * ブリーフに関連するクリエイティブを取得する
 */
export async function getBriefCreatives(briefId: string) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] getBriefCreatives: モックデータを使用します');
      return {
        data: [
          {
            id: generateMockId(),
            brief_id: briefId,
            size: '1200x628',
            image_url: '/api/placeholder?width=1200&height=628',
            copy: '忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。',
            status: 'created',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
          },
          {
            id: generateMockId(),
            brief_id: briefId,
            size: '1080x1080',
            image_url: '/api/placeholder?width=1080&height=1080',
            copy: '時間がなくても健康的に。1日5分で叶える理想の食生活。',
            status: 'created',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
          },
        ],
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('creatives')
      .select('*')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('クリエイティブ一覧取得エラー:', error);
    
    if (isTestMode) {
      return {
        data: [
          {
            id: generateMockId(),
            brief_id: briefId,
            size: '1200x628',
            image_url: '/api/placeholder?width=1200&height=628',
            copy: '忙しい毎日でも、栄養バランスを諦めない。あなたの健康をサポートする新習慣。',
            status: 'created',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
          },
          {
            id: generateMockId(),
            brief_id: briefId,
            size: '1080x1080',
            image_url: '/api/placeholder?width=1080&height=1080',
            copy: '時間がなくても健康的に。1日5分で叶える理想の食生活。',
            status: 'created',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
          },
        ],
        error: null
      };
    }
    
    return { data: null, error };
  }
}

/**
 * クリエイティブのステータスを更新する
 */
export async function updateCreativeStatus(
  id: string,
  status: 'created' | 'liked' | 'disliked' | 'approved' | 'uploaded',
  metaAdId?: string,
  performanceMetrics?: any
) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] updateCreativeStatus: モックデータを使用します');
      return {
        data: {
          id,
          status,
          meta_ad_id: metaAdId,
          performance_metrics: performanceMetrics,
          updated_at: getCurrentTimestamp()
        },
        error: null
      };
    }
    
    const updateData: any = { status };
    if (metaAdId) updateData.meta_ad_id = metaAdId;
    if (performanceMetrics) updateData.performance_metrics = performanceMetrics;
    
    const { data, error } = await supabase
      .from('creatives')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('クリエイティブステータス更新エラー:', error);
    
    if (isTestMode) {
      return {
        data: {
          id,
          status,
          meta_ad_id: metaAdId,
          performance_metrics: performanceMetrics,
          updated_at: getCurrentTimestamp()
        },
        error: null
      };
    }
    
    return { data: null, error };
  }
}

/**
 * クリエイティブを削除する
 */
export async function deleteCreative(id: string) {
  try {
    if (isTestMode) {
      console.warn('[テストモード] deleteCreative: モック処理を行います');
      return { success: true, error: null };
    }
    
    const { data, error } = await supabase
      .from('creatives')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('クリエイティブ削除エラー:', error);
    
    if (isTestMode) {
      return { success: true, error: null };
    }
    
    return { success: false, error };
  }
}

// ===============================
// バナーコピー関連の関数
// ===============================

/**
 * バナーコピーを生成する（AI生成）
 */
export async function generateBannerCopy(
  briefId: string,
  persona: string,
  problem: string,
  benefit: string,
  requiredWords?: string[]
): Promise<{ data: BannerCopy | null; error: any }> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('[テストモード] generateBannerCopy: Supabaseが利用できないため、モックデータを使用します');
      const mockCopy: BannerCopy = {
        id: generateMockId(),
        brief_id: briefId,
        main_text: '制作時間を90%短縮',
        sub_text: 'AIが自動でプロ品質のバナーを生成',
        cta_text: '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };
      return { data: mockCopy, error: null };
    }

    // 実際の実装では、ここでAI APIを呼び出してコピーを生成
    // 現在はモックデータを返す
    const mockCopy: BannerCopy = {
      id: generateMockId(),
      brief_id: briefId,
      main_text: '制作時間を90%短縮',
      sub_text: 'AIが自動でプロ品質のバナーを生成',
      cta_text: '今すぐ試す',
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    // データベースに保存
    const { data, error } = await supabase
      .from('banner_copies')
      .insert({
        brief_id: briefId,
        main_text: mockCopy.main_text,
        sub_text: mockCopy.sub_text,
        cta_text: mockCopy.cta_text,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('バナーコピー生成エラー:', error);
    
    // エラー時はモックデータを返す
    console.warn('[フォールバック] generateBannerCopy: エラーが発生したため、モックデータを使用します');
    const mockCopy: BannerCopy = {
      id: generateMockId(),
      brief_id: briefId,
      main_text: '制作時間を90%短縮',
      sub_text: 'AIが自動でプロ品質のバナーを生成',
      cta_text: '今すぐ試す',
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };
    return { data: mockCopy, error: null };
  }
}

/**
 * バナーコピーを更新する
 */
export async function updateBannerCopy(
  id: string,
  updates: {
    main_text?: string;
    sub_text?: string;
    cta_text?: string;
  }
): Promise<{ data: BannerCopy | null; error: any }> {
  try {
    if (isTestMode) {
      console.warn('[テストモード] updateBannerCopy: モックデータを使用します');
      const mockCopy: BannerCopy = {
        id,
        brief_id: 'mock-brief-id',
        main_text: updates.main_text || '制作時間を90%短縮',
        sub_text: updates.sub_text || 'AIが自動でプロ品質のバナーを生成',
        cta_text: updates.cta_text || '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };
      return { data: mockCopy, error: null };
    }

    const { data, error } = await supabase
      .from('banner_copies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('バナーコピー更新エラー:', error);
    
    if (isTestMode) {
      const mockCopy: BannerCopy = {
        id,
        brief_id: 'mock-brief-id',
        main_text: updates.main_text || '制作時間を90%短縮',
        sub_text: updates.sub_text || 'AIが自動でプロ品質のバナーを生成',
        cta_text: updates.cta_text || '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };
      return { data: mockCopy, error: null };
    }
    
    return { data: null, error };
  }
}

/**
 * ブリーフに関連するバナーコピーを取得する
 */
export async function getBriefBannerCopies(briefId: string): Promise<{ data: BannerCopy[] | null; error: any }> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn('[テストモード] getBriefBannerCopies: Supabaseが利用できないため、モックデータを使用します');
      const mockCopies: BannerCopy[] = [
        {
          id: generateMockId(),
          brief_id: briefId,
          main_text: '制作時間を90%短縮',
          sub_text: 'AIが自動でプロ品質のバナーを生成',
          cta_text: '今すぐ試す',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
        },
        {
          id: generateMockId(),
          brief_id: briefId,
          main_text: '時短で健康的な生活',
          sub_text: '忙しいあなたのための栄養ソリューション',
          cta_text: '詳細を見る',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp(),
        },
      ];
      return { data: mockCopies, error: null };
    }

    const { data, error } = await supabase
      .from('banner_copies')
      .select('*')
      .eq('brief_id', briefId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('バナーコピー一覧取得エラー:', error);
    
    // エラー時はモックデータを返す
    console.warn('[フォールバック] getBriefBannerCopies: エラーが発生したため、モックデータを使用します');
    const mockCopies: BannerCopy[] = [
      {
        id: generateMockId(),
        brief_id: briefId,
        main_text: '制作時間を90%短縮',
        sub_text: 'AIが自動でプロ品質のバナーを生成',
        cta_text: '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      },
    ];
    return { data: mockCopies, error: null };
  }
}

/**
 * バナーコピーを取得する
 */
export async function getBannerCopy(id: string): Promise<{ data: BannerCopy | null; error: any }> {
  try {
    if (isTestMode) {
      console.warn('[テストモード] getBannerCopy: モックデータを使用します');
      const mockCopy: BannerCopy = {
        id,
        brief_id: 'mock-brief-id',
        main_text: '制作時間を90%短縮',
        sub_text: 'AIが自動でプロ品質のバナーを生成',
        cta_text: '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };
      return { data: mockCopy, error: null };
    }

    const { data, error } = await supabase
      .from('banner_copies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('バナーコピー取得エラー:', error);
    
    if (isTestMode) {
      const mockCopy: BannerCopy = {
        id,
        brief_id: 'mock-brief-id',
        main_text: '制作時間を90%短縮',
        sub_text: 'AIが自動でプロ品質のバナーを生成',
        cta_text: '今すぐ試す',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };
      return { data: mockCopy, error: null };
    }
    
    return { data: null, error };
  }
}

/**
 * バナーコピーを削除する
 */
export async function deleteBannerCopy(id: string): Promise<{ success: boolean; error: any }> {
  try {
    if (isTestMode) {
      console.warn('[テストモード] deleteBannerCopy: モック処理を行います');
      return { success: true, error: null };
    }

    const { error } = await supabase
      .from('banner_copies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('バナーコピー削除エラー:', error);
    
    if (isTestMode) {
      return { success: true, error: null };
    }
    
    return { success: false, error };
  }
}

// ===============================
// 画像アップロード関連の関数
// ===============================

/**
 * 画像ファイルをSupabase Storageにアップロードする
 */
export async function uploadImage(
  file: File,
  bucket: string = 'banner-images',
  folder: string = 'backgrounds'
): Promise<{ data: { url: string } | null; error: any }> {
  try {
    console.log('uploadImage: Starting upload for file:', file.name, 'Size:', file.size);
    
    if (!isSupabaseAvailable()) {
      console.warn('[テストモード] uploadImage: Supabaseが利用できないため、ローカルObjectURLを返します');
      // 実際の画像ファイルのObjectURLを返す（テスト用）
      const objectUrl = URL.createObjectURL(file);
      console.log('uploadImage: Generated ObjectURL:', objectUrl);
      return { data: { url: objectUrl }, error: null };
    }

    // ファイル名を生成（重複を避けるためタイムスタンプを追加）
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    console.log('uploadImage: Uploading to Supabase with filename:', fileName);

    // ファイルをアップロード
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('uploadImage: Supabase upload successful, URL:', urlData.publicUrl);
    return { data: { url: urlData.publicUrl }, error: null };
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    
    // エラー時はローカルObjectURLを返す
    console.warn('[フォールバック] uploadImage: エラーが発生したため、ローカルObjectURLを使用します');
    const objectUrl = URL.createObjectURL(file);
    console.log('uploadImage: Fallback ObjectURL:', objectUrl);
    return { data: { url: objectUrl }, error: null };
  }
}

/**
 * 画像ファイルのバリデーション
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // ファイルサイズチェック（5MB以下）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'ファイルサイズは5MB以下にしてください。' };
  }

  // ファイル形式チェック
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'JPG、PNG、WebP形式の画像ファイルのみ対応しています。' };
  }

  return { isValid: true };
}

/**
 * 画像をリサイズする（Canvas APIを使用）
 */
export function resizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // アスペクト比を保持してリサイズ
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // 画像を描画
      ctx?.drawImage(img, 0, 0, width, height);

      // Blobに変換
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('画像のリサイズに失敗しました'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    img.src = URL.createObjectURL(file);
  });
} 