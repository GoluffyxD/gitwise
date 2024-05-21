export interface BlameInfo {
    commitHash: string;
    author: string;
    timestamp: number;
    lineNumber: number;
    lineContent: string;
}

export interface RemoteInfo {
    owner: string;
    repo: string;
}

export function getRemoteInfo(remoteUrl: string) {
    const fetchRemote = remoteUrl.split("\n")[0].split(" ")[0].split("\t")[1];
    const urlSplit = fetchRemote.split("/");
    const owner = urlSplit[3] ?? "";
    const repo = urlSplit[4].split(".")[0];
    const remoteInfo: RemoteInfo = {
        owner: owner,
        repo: repo
    };
    return remoteInfo;
}

export function blameInfoParse(line: string): BlameInfo | null {
    const blameInfoRegex = /^(\w{8}|\^\w{7})\s+\(([^)]+)\)\s+(.+)$/;
    const match = line.match(blameInfoRegex);
    const authorRegex = /^(.*?)\s+(\d{10})\s+(-?\d+)\s+(\d+)$/;
    if (match) {
        const [,commitHash, info, lineContent] = match;
        const infoMatch = info.match(authorRegex);
        if (infoMatch) {
            const [, author, timeStamp, _, lineNumber] = infoMatch;
            return {
                commitHash,
                author,
                timestamp: parseInt(timeStamp),
                lineNumber: parseInt(lineNumber),
                lineContent
            }; 
        }
    }
    return null;
}

export function getMostRecentCommitHash(blameInfo: string) {
    const blameInfos = parseBlame(blameInfo);
    if (blameInfos.length === 0) {
        return null; // Return null if the list is empty
    }

    let mostRecentCommitHash = blameInfos[0].commitHash;
    let mostRecentTimestamp = blameInfos[0].timestamp;

    for (const blameInfo of blameInfos) {
        if (blameInfo.timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = blameInfo.timestamp;
            mostRecentCommitHash = blameInfo.commitHash;
        }
    }

    return mostRecentCommitHash;
}

export function parseBlame(blameInfo: string) {
    const lines = blameInfo.split("\n");
    const blameInfos: BlameInfo[] = [];
    for (const line of lines) {
        const parsedLine = blameInfoParse(line);
        if (parsedLine) {
            blameInfos.push(parsedLine);
        }
    }
    return blameInfos;
}