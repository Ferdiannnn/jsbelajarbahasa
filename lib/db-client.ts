import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Cloud sync will be disabled. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function saveUserScore(
  userId: string,
  chapter: string,
  totalQuestions: number,
  correctAnswers: number,
  percentage: number,
  timestamp: number
) {
  if (!supabase) return null;

  const { data, error } = await supabase.from('user_scores').insert({
    user_id: userId,
    chapter,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
    percentage,
    timestamp,
  });

  if (error) throw error;
  return data;
}

export async function getUserScores(userId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('user_scores')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveUserResult(
  userId: string,
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  isCorrect: boolean,
  questionType: string,
  chapter: string,
  timestamp: number
) {
  if (!supabase) return null;

  const { data, error } = await supabase.from('user_results').insert({
    user_id: userId,
    question_id: questionId,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
    is_correct: isCorrect,
    question_type: questionType,
    chapter,
    timestamp,
  });

  if (error) throw error;
  return data;
}

export async function getUserResults(userId: string, chapter?: string) {
  if (!supabase) return [];

  let query = supabase.from('user_results').select('*').eq('user_id', userId);

  if (chapter) {
    query = query.eq('chapter', chapter);
  }

  const { data, error } = await query.order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}
