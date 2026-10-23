'use client';

import { useState, useEffect, useRef } from 'react';
import { Question, QuestionResult, evaluateAnswer } from '@/lib/data';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (result: QuestionResult) => void;
  questionNumber: number;
  totalQuestions: number;
  userSelectedMode?: 'manual' | 'multiple' | null;
}

export default function QuestionDisplay({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  userSelectedMode = null,
}: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [manualAnswer, setManualAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    confidence: number;
  } | null>(null);
  const [countdown, setCountdown] = useState(3);
  
  // Determine initial tab: use userSelectedMode if set, otherwise use question type
  const getInitialTab = () => {
    if (userSelectedMode) return userSelectedMode;
    if (question.type === 'manual') return 'manual';
    if (question.type === 'multiple') return 'multiple';
    return 'manual';
  };

  const [activeTab, setActiveTab] = useState<'manual' | 'multiple'>(getInitialTab());
  const hasAnsweredRef = useRef(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setManualAnswer('');
    setShowResult(false);
    setResult(null);
    setCountdown(3);
    setActiveTab(getInitialTab());
    hasAnsweredRef.current = false;
  }, [question.id, userSelectedMode]);

  useEffect(() => {
    if (!showResult || countdown > 0) return;
    if (hasAnsweredRef.current) return;

    hasAnsweredRef.current = true;

    const questionResult: QuestionResult = {
      questionId: question.id,
      userAnswer: activeTab === 'manual' ? manualAnswer : (question.options?.find((opt) => opt.id === selectedOption)?.option_text || ''),
      correctAnswer: question.correct_answer,
      isCorrect: result?.isCorrect || false,
      questionType: activeTab === 'manual' ? 'manual' : 'multiple',
      timestamp: Date.now(),
      chapter: question.category,
    };
    onAnswer(questionResult);
  }, [showResult, countdown, result, activeTab, manualAnswer, selectedOption, question, onAnswer]);

  useEffect(() => {
    if (!showResult || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showResult, countdown]);

  const handleManualSubmit = () => {
    if (!manualAnswer.trim()) return;

    const evalResult = evaluateAnswer(manualAnswer, question.correct_answer);
    setResult(evalResult);
    setShowResult(true);
    hasAnsweredRef.current = false;
  };

  const handleMultipleSubmit = () => {
    if (!selectedOption) return;

    const selected = question.options?.find((opt) => opt.id === selectedOption);
    const isCorrect = selected?.is_correct || false;

    setResult({ isCorrect, confidence: isCorrect ? 1 : 0 });
    setShowResult(true);
    hasAnsweredRef.current = false;
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;
  
  // Only show tabs if question type is 'both' AND no mode has been selected yet
  const showTabs = question.type === 'both' && !userSelectedMode && !showResult;

  return (
    <Card className="mb-6 border-slate-200 dark:border-slate-700">
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Question {questionNumber} of {totalQuestions}
            </span>
            <Badge variant="secondary" className="dark:bg-slate-700">{question.level}</Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Separator className="my-6" />

        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            {question.question_text}
          </h2>
          {question.reading && (
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{question.reading}</p>
          )}
        </div>

        {showTabs && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'manual' | 'multiple')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Write Answer</TabsTrigger>
              <TabsTrigger value="multiple">Multiple Choice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4 mt-6">
              <textarea
                value={manualAnswer}
                onChange={(e) => setManualAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                rows={3}
              />
              {!showResult && (
                <Button
                  onClick={handleManualSubmit}
                  disabled={!manualAnswer.trim()}
                  className="btn-gradient w-full"
                >
                  Submit Answer
                </Button>
              )}
            </TabsContent>

            <TabsContent value="multiple" className="space-y-3 mt-6">
              {question.options?.map((option) => (
                <label
                  key={option.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950'
                  } ${showResult ? 'cursor-default opacity-75' : ''}`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={showResult}
                    className="mr-3"
                  />
                  <span className="font-medium text-slate-900 dark:text-slate-50">{option.option_text}</span>
                </label>
              ))}
              {!showResult && (
                <Button
                  onClick={handleMultipleSubmit}
                  disabled={!selectedOption}
                  className="btn-gradient w-full"
                >
                  Submit Answer
                </Button>
              )}
            </TabsContent>
          </Tabs>
        )}

        {(activeTab === 'manual' && !showTabs) && !showResult && (
          <div className="space-y-4 mb-6">
            <textarea
              value={manualAnswer}
              onChange={(e) => setManualAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={3}
            />
            {!showResult && (
              <Button
                onClick={handleManualSubmit}
                disabled={!manualAnswer.trim()}
                className="btn-gradient w-full"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {(activeTab === 'multiple' && !showTabs) && !showResult && (
          <div className="space-y-3 mb-6">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950'
                } ${showResult ? 'cursor-default opacity-75' : ''}`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={showResult}
                  className="mr-3"
                />
                <span className="font-medium text-slate-900 dark:text-slate-50">{option.option_text}</span>
              </label>
            ))}
            {!showResult && (
              <Button
                onClick={handleMultipleSubmit}
                disabled={!selectedOption}
                className="btn-gradient w-full"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {question.type === 'manual' && !showResult && (
          <div className="space-y-4 mb-6">
            <textarea
              value={manualAnswer}
              onChange={(e) => setManualAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={3}
            />
            {!showResult && (
              <Button
                onClick={handleManualSubmit}
                disabled={!manualAnswer.trim()}
                className="btn-gradient w-full"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {question.type === 'multiple' && !showResult && (
          <div className="space-y-3 mb-6">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-950'
                } ${showResult ? 'cursor-default opacity-75' : ''}`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={showResult}
                  className="mr-3"
                />
                <span className="font-medium text-slate-900 dark:text-slate-50">{option.option_text}</span>
              </label>
            ))}
            {!showResult && (
              <Button
                onClick={handleMultipleSubmit}
                disabled={!selectedOption}
                className="btn-gradient w-full"
              >
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {showResult && result && (
          <div className="space-y-4">
            <Alert className={result.isCorrect ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950' : 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950'}>
              <div className="flex items-start gap-3">
                {result.isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-200">Correct! 🎉</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-200 mb-3">Incorrect</p>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-300 dark:border-slate-700 mb-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          <span className="font-medium">Correct answer:</span>
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{question.correct_answer}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {question.explanation && (
                <>
                  <Separator className="my-3" />
                  <div className="flex items-start gap-3 mt-3">
                    <AlertCircle className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{question.explanation}</p>
                  </div>
                </>
              )}
            </Alert>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Moving to next question in {countdown}s...
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
