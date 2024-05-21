import { Octokit } from "@octokit/core";
import fetch from 'node-fetch';


const octokit = new Octokit({
  auth: ''
});
const OPENAI_API_KEY = '';
const owner = '';
const repo = '';

let prTitle: string = '';
let prBody : string = '';
let prConversations : string = '';
let gitDiff : string = '';

async function getPullRequestNumber(commitId: string):Promise<[number,number]| undefined> {
  let issueId: number;
  let prNumber: number;
  try {
    const response = await octokit.request('GET /search/issues',{q: commitId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    issueId = response.data.items[0].id;
    prNumber = response.data.items[0].number;
    return [prNumber,issueId];
  } catch (error) {
    console.error(`Error fetching PR for `, error);
    return undefined;
  }
}

async function getPRinfo(owner: string, repo: string, prNumber: number ): Promise<void> {
  
  // API for fetching PR title body
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls/{prNumber}', {
      owner,
      repo,
      prNumber,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    prTitle = response.data['title'];
    prBody = response.data['body'];
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
  }

  // API for fetching PR comments
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{prNumber}/comments', {
      owner,
      repo,
      prNumber,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // traverse the length 
    response.data.forEach((comment: any) => {
      prConversations += comment.user.login + " - " + comment.body + "\n";
    });
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
  }
}

async function getGptResponse(prompt: string): Promise<string> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1.0,
    n: 1,
    stream: false
  });

  try {
    const response = await fetch(url, { method: 'POST', headers: headers, body: body });
    const data = await response.json();
    
    if (response.ok && data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('Unexpected API response:', data);
      return 'Sorry, GPT could not process your request.';
    }
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    return 'Sorry, something went wrong. Please try again.';
  }
}

async function chat() {
  const prompt = `
  Given the following pull request (PR) information including the PR title, PR body, PR conversations, and the git diff, please provide a short summary explaining the code change. Make sure you mention the PR title, PR body, and summarise the PR conversations (also mentioning who were involved in the conversation) in your response.PR stands for Pull Request.

  PR Title: ${prTitle}
  PR Body: ${prBody}
  PR Conversations: ${prConversations}
  Git Diff: ${gitDiff}

  Summary:
  `;


  const response = await getGptResponse(prompt);
  console.log('GPT:', response);
}
async function main() {
  const result = await getPullRequestNumber('d888dbeed9b715adb70a9e219410c9acfa2f9254');
  if (result) {
    const [prNumber, issueId] = result;
    await getPRinfo(owner, repo, prNumber);
    // need to be modified
    gitDiff = await getGitDiff();

    await chat();
  } else {
    console.log("prNumber or issue id is undefined");
  }
}
main();
