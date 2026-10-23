import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { saveUserResult, getUserResults } from '@/lib/db-client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      questionId,
      userAnswer,
      correctAnswer,
      isCorrect,
      questionType,
      chapter,
      timestamp,
    } = await request.json();

    if (!questionId || !userAnswer || !correctAnswer || isCorrect === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await saveUserResult(
      userId,
      questionId,
      userAnswer,
      correctAnswer,
      isCorrect,
      questionType || 'manual',
      chapter || 'Unknown',
      timestamp || Date.now()
    );

    return NextResponse.json(
      { message: 'Result saved successfully', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Result save error:', error);
    return NextResponse.json(
      { message: 'Failed to save result' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const chapter = url.searchParams.get('chapter');

    const results = await getUserResults(userId, chapter || undefined);

    return NextResponse.json(
      { results },
      { status: 200 }
    );
  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
