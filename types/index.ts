export interface ITestCase {
  input: string;
  expectedOutput: string;
  isSample?: boolean;
}

export interface IQuestion {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTags?: string[];
  companyTags?: string[];
  starterCode?: string;
  functionSignature?: string;
  constraints?: string;
  testCases?: ITestCase[];
}
