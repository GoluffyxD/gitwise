import OpenAI from 'openai';
import { PullRequestInfo, getPRinfo, getPullRequestNumber } from './github-api';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export interface OutputMessage {
  explanation: string;
  pullRequestUrl: string;
}

async function getGptResponse(prompt: string): Promise<string> {

  var response = "";
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
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

async function chat(prInfo: PullRequestInfo, gitDiff: string, selectedCode: string = "") {
  const prompt2 = `
  Given the following code and pull request (PR) information including the PR title, PR body, PR conversations, and the git diff, please provide a short summary explaining the code change.
  Split the output into 4 sections.
  In the first section, explain only the code provided in 2 or 3 lines. Also explain the code with the git diff as context.
  In the second section, briefly explain the git diff explaining the code change.
  While explaining the git diff changes, also explain how the code provided changes and how relevant it is to the other changes in the git diff. 
  In the third section, summarize the PR Title and Body.
  In the fourth section, summarize the PR Conversations.
  Split each section with a \n character.
  Make sure you mention the PR title, PR body, and summarise the PR conversations (also mentioning who were involved in the conversation) in your response. PR stands for Pull Request.
  Code: ${selectedCode}
  PR Title: ${prInfo.pullRequestTitle}
  PR Body: ${prInfo.pullRequestBody}
  PR Conversations: ${prInfo.pullRequestConversations}
  Git Diff: ${gitDiff}

  Summary:
  `;
  const response = await getGptResponse(prompt2);
  const outputMessage: OutputMessage = {
    explanation: response,
    pullRequestUrl: prInfo.pullRequestUrl
  };
  return outputMessage;
}

async function chatWithoutPr(gitDiff: string, selectedCode: string = "") {
  const prompt2 = `
  Given the following code and the git diff, please provide a short summary explaining the code change.
  Split the output into 2 sections. In the first section, explain the code provided in 2 or 3 lines.
  Briefly explain the git diff explaining the code change in the second section.
  While explaining the git diff changes, also explain how the code provided changes and how relevant it is to the other changes in the git diff.
  Split each section with a \n character.
  Code: ${selectedCode}
  Git Diff: ${gitDiff}

  Summary:
  `;
  const response = await getGptResponse(prompt2);
  const outputMessage: OutputMessage = {
    explanation: response,
    pullRequestUrl: ""
  };
  return outputMessage;
}

export async function getGPTExplanation(commitSHA: string, gitDiff: string, owner: string, repo: string, selectedCode: string="") {
  // const owner = 'GoluffyxD';
  // const repo = 'gitwise-test-1';
  console.log("Repo Information", `${owner}, ${repo}`);
  const result = await getPullRequestNumber(commitSHA, `https://api.github.com/repos/${owner}/${repo}`);
  if (!result) {
    console.log("Pr Number or Issue ID is undefined");
    return chatWithoutPr(gitDiff, selectedCode);
  }
  console.log("PR ID:", result);
  const {pullRequestId} = result;
  const prInfo = await getPRinfo(owner, repo, pullRequestId);
  // need to be modified
  console.log("PR INFO:", prInfo);
  return chat(prInfo, gitDiff, selectedCode);
}
