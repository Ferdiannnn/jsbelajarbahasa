import japaneseData from '@/public/japanese_questions.json';

export interface Question {
  id: string;
  question_text: string;
  reading: string;
  type: 'manual' | 'multiple' | 'both';
  correct_answer: string;
  explanation: string;
  level: 'N5' | 'N4';
  category: string;
  options?: Option[];
}

export interface Option {
  id: string;
  option_text: string;
  is_correct: boolean;
}

export interface Chapter {
  id: string;
  name: string;
  level: 'N5' | 'N4';
  questionCount: number;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  questionType: 'manual' | 'multiple';
  timestamp: number;
  chapter: string;
}

export interface UserScore {
  id: string;
  chapter: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timestamp: number;
  results: QuestionResult[];
}

let questionId = 0;
let optionId = 0;

function processData(): { chapters: Chapter[]; questions: Record<string, Question[]> } {
  const chapters: Chapter[] = [];
  const questions: Record<string, Question[]> = {};

  Object.entries(japaneseData as Record<string, Array<{kana: string; kanji: string | null; meaning: string}>>).forEach(
    ([category, vocabularies]) => {
      const babNumber = parseInt(category.replace('Bab ', ''));
      const level = babNumber <= 25 ? 'N5' : 'N4';

      const categoryQuestions: Question[] = [];
      const allMeanings = vocabularies
        .map((v) => v.meaning)
        .filter((m) => m);

      vocabularies.forEach((item) => {
        if (!item.kana && !item.kanji) return;

        const questionText = item.kanji || item.kana;
        const readingText = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;
        const meaning = item.meaning;

        const manualAnswers = [
          ...new Set(
            meaning
              .split(/[,;/]+/)
              .map((s: string) => s.trim())
              .filter((s: string) => s)
          ),
        ];
        manualAnswers.push(meaning);

        const question: Question = {
          id: `q-${questionId++}`,
          question_text: questionText,
          reading: readingText,
          type: 'both',
          correct_answer: Array.from(new Set(manualAnswers)).join(', '),
          explanation: `${category}: ${readingText} = ${meaning}`,
          level,
          category,
        };

        const otherMeanings = allMeanings.filter((m: string) => m !== meaning);
        const distractors = otherMeanings
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options: Option[] = [
          {
            id: `opt-${optionId++}`,
            option_text: meaning,
            is_correct: true,
          },
          ...distractors.map((d: string) => ({
            id: `opt-${optionId++}`,
            option_text: d,
            is_correct: false,
          })),
        ].sort(() => Math.random() - 0.5);

        question.options = options;
        categoryQuestions.push(question);
      });

      questions[category] = categoryQuestions;
      chapters.push({
        id: category,
        name: category,
        level,
        questionCount: categoryQuestions.length,
      });
    }
  );

  return { chapters, questions };
}

const { chapters: CHAPTERS, questions: QUESTIONS } = processData();

export function getChapters(): Chapter[] {
  return CHAPTERS;
}

export function getChapterQuestions(chapterId: string): Question[] {
  return QUESTIONS[chapterId] || [];
}

export function getQuestion(questionId: string): Question | null {
  for (const questions of Object.values(QUESTIONS)) {
    const found = questions.find((q) => q.id === questionId);
    if (found) return found;
  }
  return null;
}

export function calculateFuzzyMatch(userAnswer: string, correctAnswers: string): number {
  const userLower = userAnswer.toLowerCase().trim();
  const answers = correctAnswers.split(',').map((a) => a.toLowerCase().trim());

  for (const answer of answers) {
    if (userLower === answer) return 1;

    const userWords = userLower.split(/\s+/);
    const answerWords = answer.split(/\s+/);

    let matchCount = 0;
    for (const word of userWords) {
      if (answerWords.some((aw) => aw.includes(word) || word.includes(aw))) {
        matchCount++;
      }
    }

    const matchRatio = matchCount / Math.max(userWords.length, answerWords.length);
    if (matchRatio >= 0.7) return matchRatio;
  }

  return 0;
}

export function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 0.7
): { isCorrect: boolean; confidence: number } {
  const confidence = calculateFuzzyMatch(userAnswer, correctAnswer);
  return {
    isCorrect: confidence >= threshold,
    confidence,
  };
}
