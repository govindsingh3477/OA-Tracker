// app/api/addTestcase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db'; // Your DB connection helper
import { TestCase } from '@/lib/models/testcases';
import { Question } from '@/lib/models/questions';

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // ensure DB is connected

    const body = await req.json();
    const { input, expectedOutput, isSample, questionId } = body;

    // Validate required fields
    if (!input || !expectedOutput || !questionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log("here now");
    

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Create and save the new test case
    const testCase = new TestCase({
      input,
      expectedOutput,
      isSample: isSample ?? false,
      question: questionId,
    });

    await testCase.save();

    // Optional: Push test case to question
    question.testCases.push(testCase._id);
    await question.save();

    return NextResponse.json({ message: 'Test case added', testCase }, { status: 201 });

  } catch (err: any) {
    console.error('Error adding test case:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
