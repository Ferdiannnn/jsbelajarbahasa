import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { saveUserScore, getUserScores } from '@/lib/db-client';

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
      chapter,
      totalQuestions,
      correctAnswers,
      percentage,
      timestamp,
    } = await request.json();

    if (!chapter || totalQuestions === undefined || correctAnswers === undefined || percentage === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await saveUserScore(
      userId,
      chapter,
      totalQuestions,
      correctAnswers,
      percentage,
      timestamp || Date.now()
    );

    return NextResponse.json(
      { message: 'Score saved successfully', data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Score save error:', error);
    return NextResponse.json(
      { message: 'Failed to save score' },
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

    const scores = await getUserScores(userId);

    return NextResponse.json(
      { scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Score fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}
