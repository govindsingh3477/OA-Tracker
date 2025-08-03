import { connectDB } from '@/lib/db';
import { Question } from '@/lib/models/questions';
import { QuestionInput, questionSchema } from '@/types/validation';
import { isAuthorized } from '@/utils/roles';
import { log } from 'console';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  // if (!(await isAuthorized())) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  //   }
  await connectDB();

  try {
    const body = await req.json();
    log('Creating question with body:', body);
    // ✅ Validate with Zod
    const validated: QuestionInput = questionSchema.parse(body);
    // ✅ Save to DB
    const createdQuestion = await Question.create(validated);

    return NextResponse.json(createdQuestion, { status: 201 });

  } catch (err) {
    if (err instanceof Error && 'issues' in err) {
      return NextResponse.json({ error: (err as any).issues }, { status: 422 });
    }

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const difficulty = searchParams.get('difficulty');         // 'Easy', 'Medium', 'Hard'
    const topicTag = searchParams.get('topicTag');             // ObjectId string
    const companyTag = searchParams.get('companyTag');         // ObjectId string

    // Build dynamic filter object
    const filter: any = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topicTag) {
      filter.topicTags = topicTag;
    }

    if (companyTag) {
      filter.companyTags = companyTag;
    }

    const questions = await Question.find(filter)
      .populate('topicTags companyTags testCases');

    return NextResponse.json(questions, { status: 200 });

  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}