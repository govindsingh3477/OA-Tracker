import { z } from 'zod';

// Reusable testCase schema
export const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isSample: z.boolean().optional(),
});

// Reusable question schema
export const questionSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topicTags: z.array(z.string()).optional(),
  companyTags: z.array(z.string()).optional(),
  dateAsked: z.string().datetime().optional(),
  role: z.string().optional(),
  level: z.string().optional(),
  intent: z.string().optional(),
  companyType: z.string().optional(),
  testCases: z.array(z.string()).optional(),
  starterCode: z.string().optional(),
  functionSignature: z.string().optional(),
  constraints: z.string().optional(),
  referenceSolution: z.string().optional(),
});

// Export types from schemas
export type QuestionInput = z.infer<typeof questionSchema>;
export type TestCaseInput = z.infer<typeof testCaseSchema>;
