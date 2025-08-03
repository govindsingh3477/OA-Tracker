// app/api/submit/route.ts

import { connectDB } from '@/lib/db';
import { Question } from '@/lib/models/questions';
import { Submission } from '@/lib/models/submission';
import { runJudge0 } from '@/utils/judge0';
import { languageMap } from '@/utils/languageMap';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();

  // Optional auth
  // const { userId } = await auth();
  // if (!userId) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { code, language, questionId } = await req.json();

  const langId = languageMap[language];
  if (!langId) {
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
  }

  const question = await Question.findById(questionId).populate('testCases');
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  let allPassed = true;
  let totalTime = 0;
  let totalMemory = 0;
  let outputDetails = [];
  let passedCount = 0;
  for (const testCase of question.testCases) {
    try {
      const output = await runJudge0({
        source_code: code,
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
        language_id: langId,
        wait: true,
      });
      console.log('Judge0 output:', output);
      
      const expected = testCase.expectedOutput?.trim();
      const decodedOutput = Buffer.from(output.stdout || '', 'base64').toString('utf-8').trim();

      const isPassed = decodedOutput === expected;
      if (isPassed) passedCount++;
      else allPassed = false;

      totalTime += parseFloat(output.time || '0');
      totalMemory += output.memory || 0;
      outputDetails.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        stdout:decodedOutput,
        stderr: output.stderr,
        time: output.time,
        memory: output.memory,
        token: output.token,
        status: output.status?.description,
      });
    } catch (err) {
      return NextResponse.json({ error: 'Code execution failed' }, { status: 500 });
    }
  }
  console.log(outputDetails);
  
  const userId = 'mockUserId'; // Replace with actual user ID from auth context
  const newSubmission = await Submission.create({
    userId,
    questionId,
    code,
    language,
    status: allPassed ? 'Accepted' : 'Wrong Answer',
    result: JSON.stringify({
      totalTestCases: question.testCases.length,
      passed: passedCount,
    }),
    output: outputDetails ,
    time: totalTime,
    memory: totalMemory,
  });

  return NextResponse.json(newSubmission, { status: 201 });
}
