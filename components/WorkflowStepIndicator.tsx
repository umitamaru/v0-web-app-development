"use client"

import { Check } from 'lucide-react';

export type WorkflowStep = 'interview' | 'brief' | 'design' | 'preview';

interface WorkflowStepIndicatorProps {
  currentStep: WorkflowStep;
  currentSubStep?: 'design' | 'preview'; // banner-copyページ用のサブステップ
}

export default function WorkflowStepIndicator({ 
  currentStep, 
  currentSubStep 
}: WorkflowStepIndicatorProps) {
  const steps = [
    { 
      key: 'interview', 
      label: 'インタビューアップロード', 
      icon: '📝',
      description: 'インタビュー録をアップロードしてAIが分析'
    },
    { 
      key: 'brief', 
      label: '広告クリエイティブブリーフ', 
      icon: '📋',
      description: 'ペルソナ・課題・ベネフィットを整理'
    },
    { 
      key: 'design', 
      label: 'デザイン設定', 
      icon: '🎨',
      description: 'バナーコピーとデザインを設定'
    },
    { 
      key: 'preview', 
      label: 'プレビュー', 
      icon: '👀',
      description: '完成したバナーを確認'
    }
  ];

  const getStepStatus = (stepKey: string) => {
    const stepOrder = ['interview', 'brief', 'design', 'preview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) {
      return 'completed';
    } else if (stepIndex === currentIndex) {
      // banner-copyページの場合、サブステップを考慮
      if (currentStep === 'design' && currentSubStep === 'preview') {
        return stepKey === 'design' ? 'completed' : 'current';
      }
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getCurrentDescription = () => {
    if (currentStep === 'design' && currentSubStep === 'preview') {
      return 'バナーのプレビューを確認できます';
    }
    
    const step = steps.find(s => s.key === currentStep);
    return step?.description || '';
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors
                  ${status === 'current'
                    ? 'bg-blue-600 text-white' 
                    : status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : status === 'current' ? (
                    <div className="flex items-center justify-center">
                      {step.icon}
                    </div>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium text-center max-w-20 leading-tight ${
                  status === 'current' 
                    ? 'text-blue-600' 
                    : status === 'completed'
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-6 md:w-8 h-0.5 mx-1 md:mx-2 transition-colors ${
                  status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* 進行状況の説明 */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {getCurrentDescription()}
        </p>
      </div>
    </div>
  );
} 