"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EnvDebugPage() {
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [isTestMode, setIsTestMode] = useState<boolean>(true);

  useEffect(() => {
    // 環境変数を確認
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    
    setSupabaseUrl(url);
    
    // テストモードかどうかを判定
    setIsTestMode(!url || !key);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ホームに戻る
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">環境変数デバッグ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Supabase URL:</h3>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {supabaseUrl || "(設定されていません)"}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Supabase API Key:</h3>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定されています (セキュリティのため表示しません)" : "(設定されていません)"}
              </p>
            </div>

            <div>
              <h3 className="font-medium">テストモードステータス:</h3>
              <p className={`text-sm p-2 rounded ${isTestMode ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                {isTestMode ? "テストモードが有効です (環境変数が設定されていないか、正しくありません)" : "テストモードは無効です (実際のSupabaseに接続します)"}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500">
                テストモードを解除するには、.env.local ファイルに以下の環境変数を正しく設定してください：
              </p>
              <pre className="text-xs bg-gray-100 p-2 mt-2 rounded">
                NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co{"\n"}
                NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 