import { NextRequest, NextResponse } from 'next/server';
import { updateBannerCopy, getBannerCopy, deleteBannerCopy } from '@/lib/supabaseUtils';

// バナーコピーを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await getBannerCopy(params.id);

    if (error) {
      console.error('バナーコピー取得エラー:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'バナーコピーの取得に失敗しました。' 
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'バナーコピーが見つかりません。' 
        },
        { status: 404 }
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

// バナーコピーを更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { main_text, sub_text, cta_text } = body;

    // バリデーション
    if (main_text && main_text.length > 30) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'メインテキストは30文字以内で入力してください。' 
        },
        { status: 400 }
      );
    }

    if (sub_text && sub_text.length > 60) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'サブテキストは60文字以内で入力してください。' 
        },
        { status: 400 }
      );
    }

    if (cta_text && cta_text.length > 15) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CTAテキストは15文字以内で入力してください。' 
        },
        { status: 400 }
      );
    }

    const { data, error } = await updateBannerCopy(params.id, {
      main_text,
      sub_text,
      cta_text
    });

    if (error) {
      console.error('バナーコピー更新エラー:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'バナーコピーの更新に失敗しました。' 
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

// バナーコピーを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { success, error } = await deleteBannerCopy(params.id);

    if (!success || error) {
      console.error('バナーコピー削除エラー:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'バナーコピーの削除に失敗しました。' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'バナーコピーが削除されました。'
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