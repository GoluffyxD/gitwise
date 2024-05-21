import OpenAI from 'openai';
import { PullRequestInfo, getPRinfo, getPullRequestNumber } from './github-api';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function getGptResponse(prompt: string): Promise<string> {

  var response = "";
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1.0,
    n: 1,
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    response += content;
  }
  return response;
}

async function chat(prInfo: PullRequestInfo, gitDiff: string) {
  const prompt = `
  Given the following pull request (PR) information including the PR title, PR body, PR conversations, and the git diff, please provide a short summary explaining the code change. Make sure you mention the PR title, PR body, and summarise the PR conversations (also mentioning who were involved in the conversation) in your response.PR stands for Pull Request.

  PR Title: ${prInfo.pullRequestTitle}
  PR Body: ${prInfo.pullRequestBody}
  PR Conversations: ${prInfo.pullRequestConversations}
  Git Diff: ${gitDiff}

  Summary:
  `;
  const response = await getGptResponse(prompt);
  return response;
}

export async function getGPTExplanation(commitSHA: string, gitDiff: string) {
  const owner = 'GoluffyxD';
  const repo = 'gitwise-test-1';
  const result = await getPullRequestNumber(commitSHA);
  if (!result) {
    console.log("Pr Number or Issue ID is undefined");
    return "";
  }
  const {pullRequestId, issueId} = result;
  const prInfo = await getPRinfo(owner, repo, pullRequestId);
  // need to be modified
  return chat(prInfo, gitDiff);
}
