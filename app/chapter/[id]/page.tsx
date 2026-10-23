'use client';

import { useState, useEffect, use } from 'react';
import { getChapterQuestions, Question, QuestionResult, UserScore } from '@/lib/data';
import { saveResult, saveScore } from '@/lib/storage';
import QuestionDisplay from '@/components/QuestionDisplay';
import ResultsSummary from '@/components/ResultsSummary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChapterPageProps {
  params: Promise<{
    id: string;
  }>;
}

function ChapterContent({ params }: ChapterPageProps) {
  const resolvedParams = use(params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userSelectedMode, setUserSelectedMode] = useState<'manual' | 'multiple' | null>(null);
  const [isShuffleMode, setIsShuffleMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const chapterId = decodeURIComponent(resolvedParams.id);
    const chapterQuestions = getChapterQuestions(chapterId);
    setQuestions(chapterQuestions);
    setOriginalQuestions(chapterQuestions);
    setLoading(false);
  }, [resolvedParams.id, mounted]);

  const toggleShuffle = () => {
    if (isShuffleMode) {
      // Turn off shuffle - revert to original order
      setQuestions([...originalQuestions]);
      setIsShuffleMode(false);
    } else {
      // Turn on shuffle - randomize
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setIsShuffleMode(true);
    }
    setCurrentIndex(0);
    setResults([]);
    setUserSelectedMode(null);
  };

  const handleAnswer = (result: QuestionResult) => {
    // Track the mode user chose on first answer
    if (!userSelectedMode && result.questionType) {
      setUserSelectedMode(result.questionType as 'manual' | 'multiple');
    }

    saveResult(result);
    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex < questions.length - 1) {
      // Get next question from shuffled or original order
      if (isShuffleMode) {
        const nextQuestion = questions[currentIndex + 1];
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      completeQuiz(newResults);
    }
  };

  const completeQuiz = (newResults: QuestionResult[]) => {
    const correctCount = newResults.filter((r) => r.isCorrect).length;
    const percentage = Math.round((correctCount / newResults.length) * 100);
    const timestamp = Date.now();

    const score: UserScore = {
      id: `score-${timestamp}`,
      chapter: questions[0].category,
      totalQuestions: newResults.length,
      correctAnswers: correctCount,
      percentage,
      timestamp,
      results: newResults,
    };

    saveScore(score);
    syncScoreToCloud(score);
    setIsComplete(true);
  };

  const syncScoreToCloud = async (score: UserScore) => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: score.chapter,
          totalQuestions: score.totalQuestions,
          correctAnswers: score.correctAnswers,
          percentage: score.percentage,
          timestamp: score.timestamp,
        }),
      });
    } catch (error) {
      console.error('Failed to sync score to cloud:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No questions found</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <ResultsSummary
        results={results}
        chapterName={questions[0].category}
        onRetry={() => {
          setCurrentIndex(0);
          setResults([]);
          setIsComplete(false);
          setUserSelectedMode(null);
          setIsShuffleMode(false);
          setQuestions([...originalQuestions]);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pb-20">
      <div className="sticky top-0 bg-white dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 border-b border-slate-200 dark:border-slate-700 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <h1 className="font-semibold text-slate-900 dark:text-slate-50 text-center flex-1 text-sm sm:text-base line-clamp-1">{questions[0]?.category}</h1>
            <Button 
              variant={isShuffleMode ? "default" : "outline"}
              size="sm" 
              onClick={toggleShuffle}
              className={`gap-1 sm:gap-2 text-xs sm:text-sm ${isShuffleMode ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' : 'dark:border-slate-700'}`}
              title={isShuffleMode ? "Turn off shuffle" : "Turn on shuffle"}
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">{isShuffleMode ? 'Random' : 'Shuffle'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QuestionDisplay
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          userSelectedMode={userSelectedMode}
        />
      </div>
    </div>
  );
}

export default function ChapterPage(props: ChapterPageProps) {
  return (
    <ProtectedRoute>
      <ChapterContent {...props} />
    </ProtectedRoute>
  );
}
