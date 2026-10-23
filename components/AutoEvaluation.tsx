'use client';

import { QuestionResult } from '@/lib/data';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AutoEvaluationProps {
  wrongAnswers: QuestionResult[];
}

export default function AutoEvaluation({ wrongAnswers }: AutoEvaluationProps) {
  if (wrongAnswers.length === 0) {
    return null;
  }

  const generateFeedback = (result: QuestionResult): string => {
    const userAnswer = result.userAnswer.toLowerCase().trim();
    const correctAnswer = result.correctAnswer.toLowerCase().trim();

    if (result.questionType === 'multiple') {
      return `You selected the wrong option. The correct answer is: ${result.correctAnswer}`;
    }

    const userWords = userAnswer.split(/\s+/);
    const correctWords = correctAnswer.split(/[,;/]+/).map((w) => w.trim().toLowerCase());

    if (userWords.length === 0) {
      return 'Please provide an answer before submitting.';
    }

    const matchedWords = userWords.filter((w) =>
      correctWords.some((cw) => cw.includes(w) || w.includes(cw))
    );

    if (matchedWords.length > 0) {
      return `You got some parts right, but the complete answer is: ${result.correctAnswer}`;
    }

    if (userAnswer.length < 3) {
      return 'Your answer was too short. The meaning is: ' + result.correctAnswer;
    }

    return `That's not quite right. The correct meaning is: ${result.correctAnswer}`;
  };

  return (
    <div className="mt-8">
      <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">Review Your Mistakes</h3>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {wrongAnswers.slice(0, 5).map((result, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm mb-2">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Your answer:</span> <span className="italic">&quot;{result.userAnswer}&quot;</span>
                    </p>
                    <div className="bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="text-sm">
                        <span className="font-semibold">✓ Correct:</span> {result.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 p-3 rounded border border-amber-200 dark:border-amber-800">
                  <p>💡 {generateFeedback(result)}</p>
                </div>
              </div>
            ))}
          </div>

          {wrongAnswers.length > 5 && (
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-4 text-center font-medium">
              ... and {wrongAnswers.length - 5} more mistake{wrongAnswers.length - 5 > 1 ? 's' : ''}
            </p>
          )}

          <Separator className="my-4" />

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">💡 Tip for improvement:</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {wrongAnswers.length > 3
                ? 'Try to review these meanings more carefully. Consider writing them down multiple times.'
                : 'Good effort! Focus on the meanings you got wrong and practice them again.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
