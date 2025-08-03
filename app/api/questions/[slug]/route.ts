import { connectDB } from '@/lib/db';
import { Question } from '@/lib/models/questions';
import { NextResponse } from 'next/server';
import { questionSchema } from '@/types/validation';
import { auth } from '@clerk/nextjs/server';
import { Roles } from '@/types/globals';
import { isAuthorized } from '@/utils/roles';

// Check if current user is moderator or admin


export async function GET(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  try {
    const question = await Question.findOne({ slug: params.slug })
      .populate('topicTags companyTags testCases');

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const partialQuestionSchema = questionSchema.partial();
    const validatedData = partialQuestionSchema.parse(data);

    const updated = await Question.findOneAndUpdate(
      { slug: params.slug },
      validatedData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    if (err instanceof Error && 'issues' in err) {
      return NextResponse.json({ error: (err as any).issues }, { status: 422 });
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const deleted = await Question.findOneAndDelete({ slug: params.slug });

    if (!deleted) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete question' },
      { status: 500 }
    );
  }
}
