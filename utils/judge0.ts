// lib/judge0.ts
import axios from "axios";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

interface SubmissionOptions {
  source_code: string;
  stdin?: string;
  language_id: number;
  wait?: boolean; // wait for result (true) or just submit (false)
  expected_output?: string; // Optional: for validation
}

export async function runJudge0({
  source_code,
  stdin = "",
  language_id=50,
  wait = false,
  expected_output=""
}: SubmissionOptions) {
  try {
    const encodedSourceCode = Buffer.from(source_code).toString("base64");
    const encodedStdin = Buffer.from(stdin).toString("base64");

    const options = {
      method: "POST",
      url: `${JUDGE0_API}/submissions`,
      params: {
        base64_encoded: "true",
        wait: wait ? "true" : "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
      data: {
        language_id,
        source_code: encodedSourceCode,
        stdin: encodedStdin,
        expected_output: expected_output ? Buffer.from(expected_output).toString("base64") : undefined,
      },
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error: any) {
    console.error("Judge0 API Error:", error?.response?.data || error.message);
    throw new Error("Failed to submit code to Judge0");
  }
}
