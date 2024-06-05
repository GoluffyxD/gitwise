import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: process.env["GITHUB_ACCESS_TOKEN"]
});

export interface PullRequestIdentifier {
  pullRequestId: number;
}

export interface PullRequestInfo {
  pullRequestId: number;
  pullRequestTitle: string;
  pullRequestBody: string;
  pullRequestConversations: string;
  pullRequestUrl: string;
}

export async function getPullRequestNumber(commitId: string, repository_url: string): Promise<PullRequestIdentifier | undefined> {
  let issueId: number;
  let prNumber: number;
  let prIdentifier: PullRequestIdentifier = {
    pullRequestId: 0
  };
  try {
    const response = await octokit.request('GET /search/issues', {
      q: commitId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const relevantPrs = response.data.items.filter(x => x.repository_url === repository_url);
    const changePr = relevantPrs.filter(x => x.pull_request?.merged_at !== null);

    prNumber = changePr[0].number;
    prIdentifier.pullRequestId = prNumber;
    return prIdentifier;
  } catch (error) {
    console.error(`Error fetching PR for `, error);
    return undefined;
  }
}

export async function getPRinfo(owner: string, repo: string, prNumber: number): Promise<PullRequestInfo> {
  // API for fetching PR title body
  var prTitle: string = "";
  var prBody: string = "";
  var prConversations: string = "";
  var prInfo: PullRequestInfo = {
    pullRequestId: prNumber,
    pullRequestTitle: "",
    pullRequestBody: "",
    pullRequestConversations: "",
    pullRequestUrl: ""
  };
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{prNumber}', {
      owner,
      repo,
      prNumber,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log("Response:", response);
    prTitle = response.data['title'];
    prBody = response.data['body'];
    prInfo.pullRequestTitle = prTitle;
    prInfo.pullRequestBody = prBody;
    prInfo.pullRequestUrl = response.data['html_url'];
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
    prInfo.pullRequestConversations = prConversations;
  } catch (error) {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error);
  }
  return prInfo;
}