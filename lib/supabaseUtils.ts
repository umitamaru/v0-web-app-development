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
    if (isTestMode) {
      console.warn('[テストモード] getBrief: モックデータを使用します');
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
    
    if (isTestMode) {
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
    
    return { data: null, error };
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
    if (isTestMode) {
      console.warn('[テストモード] generateBannerCopy: モックデータを使用します');
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
    
    if (isTestMode) {
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
    
    return { data: null, error };
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
    if (isTestMode) {
      console.warn('[テストモード] getBriefBannerCopies: モックデータを使用します');
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
    
    if (isTestMode) {
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
    
    return { data: null, error };
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