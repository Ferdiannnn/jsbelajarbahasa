import { QuestionResult, UserScore } from './data';

const SCORES_KEY = 'language_learning_scores';
const RESULTS_KEY = 'language_learning_results';

export function saveResult(result: QuestionResult): void {
  if (typeof window === 'undefined') return;

  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function getResults(): QuestionResult[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveScore(score: UserScore): void {
  if (typeof window === 'undefined') return;

  const scores = getScores();
  scores.push(score);
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function getScores(): UserScore[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(SCORES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getChapterScores(chapter: string): UserScore[] {
  return getScores().filter((s) => s.chapter === chapter);
}

export function getChapterStats(chapter: string) {
  const scores = getChapterScores(chapter);
  if (scores.length === 0) {
    return {
      attempts: 0,
      bestScore: 0,
      averageScore: 0,
      totalQuestions: 0,
    };
  }

  const sortedByPercentage = scores.sort((a, b) => b.percentage - a.percentage);
  const total = scores.reduce((sum, s) => sum + s.percentage, 0);

  return {
    attempts: scores.length,
    bestScore: sortedByPercentage[0].percentage,
    averageScore: Math.round(total / scores.length),
    totalQuestions: scores[0].totalQuestions,
  };
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(SCORES_KEY);
  localStorage.removeItem(RESULTS_KEY);
}
