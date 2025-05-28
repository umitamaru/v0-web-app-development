import { NextRequest, NextResponse } from 'next/server';
import { generateBannerCopy } from '@/lib/supabaseUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { briefId, persona, problem, benefit, requiredWords } = body;

    // バリデーション
    if (!briefId || !persona || !problem || !benefit) {
      return NextResponse.json(
        { 
          success: false, 
          error: '必須項目が不足しています。ペルソナ、課題、ベネフィットは必須です。' 
        },
        { status: 400 }
      );
    }

    // バナーコピーを生成
    const { data, error } = await generateBannerCopy(
      briefId,
      persona,
      problem,
      benefit,
      requiredWords
    );

    if (error) {
      console.error('バナーコピー生成エラー:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'バナーコピーの生成に失敗しました。' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'サーバーエラーが発生しました。' 
      },
      { status: 500 }
    );
  }
} 