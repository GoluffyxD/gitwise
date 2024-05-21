"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@octokit/core");
var octokit = new core_1.Octokit({
    auth: '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'
});
var openai_key = 'sk-proj-tH2jD6FUxQQCkygdhJOCT3BlbkFJUVPt9dwmal9zDzmpR8Wb';
var owner = 'GoluffyxD';
var repo = 'gitwise-test-1';
function getPullRequestNumber(commitId) {
    return __awaiter(this, void 0, void 0, function () {
        var issueId, prNumber, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit.request('GET /search/issues', { q: commitId,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    issueId = response.data.items[0].id;
                    prNumber = response.data.items[0].number;
                    return [2 /*return*/, [prNumber, issueId]];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching PR for ", error_1);
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPRinfo(owner, repo, prNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/pulls/{prNumber}', {
                            owner: owner,
                            repo: repo,
                            prNumber: prNumber,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    console.log("Title of PR - " + response.data['title']);
                    console.log("Body of PR - " + response.data['body']);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching commits for ".concat(owner, "/").concat(repo, ":"), error_2);
                    return [3 /*break*/, 3];
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/issues/{prNumber}/comments', {
                            owner: owner,
                            repo: repo,
                            prNumber: prNumber,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                            }
                        })];
                case 4:
                    response = _a.sent();
                    console.log("Comments by each user");
                    console.log("Total conversations - " + response.data.length);
                    // traverse the length 
                    response.data.forEach(function (comment) {
                        console.log(comment.user.login + " - " + comment.body);
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Error fetching commits for ".concat(owner, "/").concat(repo, ":"), error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
var prNumber = getPullRequestNumber('d888dbeed9b715adb70a9e219410c9acfa2f9254').then(function (result) {
    if (result) {
        var prNumber_1 = result[0], issueId = result[1];
        console.log("PR Number and Issue ID is - " + prNumber_1 + " and " + issueId + " respectively");
        getPRinfo(owner, repo, prNumber_1);
    }
    else {
        console.log("prNumber or issue id is undefined");
    }
});
// 2290714090
////////////////////////////////
// openai sample code//
////////////////////////////////
// const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
// async function getChatGptResponse(prompt: string) {
//     try {
//         const response = await axios.post(
//             apiUrl,
//             {
//                 prompt: prompt,
//                 max_tokens: 100,
//                 temperature: 0.7,
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${openai_key}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         console.log('Response:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching response:', error);
//     }
// }
// // Example usage
// const prompt = 'Hello, how are you?';
// getChatGptResponse(prompt);
// console.log('GPT completed');
// router.post('/completeEmailSmsMessages', async (req, res) => {
//     const { prompt, company, contactName } = req.body;
//     if (!prompt || !company || !contactName) {
//         return res.status(400).json({ 
//             status: false, 
//             error: 'The prompt, company, and contactName parameters must be provided.' 
//         });
//     }
//     let result;
//     try {
//         // Call OpenAI to get the email and SMS message completions
//        result = await completeEmailSMSMessages(prompt, company, contactName);
//     }
//     catch (e: unknown) {
//         console.error('Error parsing JSON:', e);
//     }
//     res.json(result);
// });
// import fs from 'fs';
// import { OpenAI } from 'openai';
// import { QueryData, AzureOpenAIResponse, EmailSmsResponse, OpenAIHeadersBody, ChatGPTData } from './interfaces';
// import fetch from 'cross-fetch';
// import './config';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
// const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT as string;
// const OPENAI_MODEL = process.env.OPENAI_MODEL as string;
// const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION as string;
// const AZURE_COGNITIVE_SEARCH_ENDPOINT = process.env.AZURE_COGNITIVE_SEARCH_ENDPOINT as string;
// const AZURE_COGNITIVE_SEARCH_KEY = process.env.AZURE_COGNITIVE_SEARCH_KEY as string;
// const AZURE_COGNITIVE_SEARCH_INDEX = process.env.AZURE_COGNITIVE_SEARCH_INDEX as string;
// async function getAzureOpenAICompletion(systemPrompt: string, userPrompt: string, temperature: number): Promise<string> {
//     checkRequiredEnvVars(['OPENAI_API_KEY', 'OPENAI_ENDPOINT', 'OPENAI_MODEL']);
//     const fetchUrl = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_MODEL}/chat/completions?api-version=${OPENAI_API_VERSION}`;
//     const messageData: ChatGPTData = {
//         max_tokens: 1024,
//         temperature,
//         messages: [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: userPrompt }
//         ]
//     };
//     const headersBody: OpenAIHeadersBody = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'api-key': OPENAI_API_KEY
//         },
//         body: JSON.stringify(messageData),
//     };
//     const completion = await fetchAndParse(fetchUrl, headersBody);
//     console.log(completion);
//     let content = (completion.choices[0]?.message?.content?.trim() ?? '') as string;
//     console.log('Azure OpenAI Output: \n', content);
//     if (content && content.includes('{') && content.includes('}')) {
//         content = extractJson(content);
//     }
//     console.log('After parse: \n', content);
//     return content;
// }
// async function getAzureOpenAIBYODCompletion(systemPrompt: string, userPrompt: string, temperature: number): Promise<string> {
//     checkRequiredEnvVars([ 
//         'OPENAI_API_KEY',
//         'OPENAI_ENDPOINT',
//         'OPENAI_MODEL',
//         'AZURE_COGNITIVE_SEARCH_ENDPOINT',
//         'AZURE_COGNITIVE_SEARCH_KEY',
//         'AZURE_COGNITIVE_SEARCH_INDEX',
//     ]);
//     const fetchUrl = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_MODEL}/extensions/chat/completions?api-version=${OPENAI_API_VERSION}`;
//     const messageData: ChatGPTData = {
//         max_tokens: 1024,
//         temperature,
//         messages: [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: userPrompt }
//         ],
//         dataSources: [
//             {
//                 type: 'AzureCognitiveSearch',
//                 parameters: {
//                     endpoint: AZURE_COGNITIVE_SEARCH_ENDPOINT,
//                     key: AZURE_COGNITIVE_SEARCH_KEY,
//                     indexName: AZURE_COGNITIVE_SEARCH_INDEX
//                 }
//             }
//         ]
//     };
//     const headersBody: OpenAIHeadersBody = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'api-key': OPENAI_API_KEY,
//             chatgpt_url: fetchUrl.replace('extensions/', ''),
//             chatgpt_key: OPENAI_API_KEY
//         },
//         body: JSON.stringify(messageData),
//     };
//     const completion = await fetchAndParse(fetchUrl, headersBody);
//     console.log(completion);
//     if (completion.error) {
//         console.error('Azure OpenAI BYOD Error: \n', completion.error);
//         return completion.error.message;
//     }
//     const citations = (completion.choices[0]?.messages[0]?.content?.trim() ?? '') as string;
//     console.log('Azure OpenAI BYOD Citations: \n', citations);
//     let content = (completion.choices[0]?.messages[1]?.content?.trim() ?? '') as string;
//     console.log('Azure OpenAI BYOD Output: \n', content);
//     return content;
// }
// async function getOpenAICompletion(systemPrompt: string, userPrompt: string, temperature = 0): Promise<string> {
//     await checkRequiredEnvVars(['OPENAI_API_KEY']);
//     try {
//         // v4+ OpenAI API. 
//         // On v3? View the migration guide here: https://github.com/openai/openai-node/discussions/217
//         const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
//         const completion = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo', // gpt-3.5-turbo, gpt-4
//             max_tokens: 1024,
//             temperature,
//             messages: [
//                 { role: 'system', content: systemPrompt },
//                 { role: 'user', content: userPrompt }
//             ]
//         });
//         let content = completion.choices[0]?.message?.content?.trim() ?? '';
//         console.log('OpenAI Output: \n', content);
//         if (content && content.includes('{') && content.includes('}')) {
//             content = extractJson(content);
//         }
//         return content;
//     }
//     catch (e) {
//         console.error('Error getting data:', e);
//         throw e;
//     }
// }
// function checkRequiredEnvVars(requiredEnvVars: string[]) {
//     for (const envVar of requiredEnvVars) {
//         if (!process.env[envVar]) {
//             throw new Error(`Missing ${envVar} in environment variables.`);
//         }
//     }
// }
// async function fetchAndParse(url: string, headersBody: Record<string, any>): Promise<any> {
//     try {
//         const response = await fetch(url, headersBody);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching data from ${url}:`, error);
//         throw error;
//     }
// }
// function callOpenAI(systemPrompt: string, userPrompt: string, temperature = 0, useBYOD = false) {
//     const isAzureOpenAI = OPENAI_API_KEY && OPENAI_ENDPOINT && OPENAI_MODEL;
//     if (isAzureOpenAI && useBYOD) {
//         // Azure OpenAI + Cognitive Search: Bring Your Own Data
//         return getAzureOpenAIBYODCompletion(systemPrompt, userPrompt, temperature);
//     }
//     if (isAzureOpenAI) {
//         // Azure OpenAI
//         return getAzureOpenAICompletion(systemPrompt, userPrompt, temperature);
//     }
//     // OpenAI
//     return getOpenAICompletion(systemPrompt, userPrompt, temperature);
// }
// function extractJson(content: string) {
//     const regex = /\{(?:[^{}]|{[^{}]*})*\}/g;
//     const match = content.match(regex);
//     if (match) {
//         // If we get back pure text it can have invalid carriage returns
//         return match[0].replace(/"([^"]*)"/g, (match) => match.replace(/\n/g, "\\n"));
//     } else {
//         return '';
//     }
// }
// async function completeBYOD(userPrompt: string): Promise<string> {
//     const systemPrompt = 'You are an AI assistant that helps people find information.';
//     // Pass that we're using Cognitive Search along with Azure OpenAI.
//     return await callOpenAI(systemPrompt, userPrompt, 0, true);
// }
// async function getSQLFromNLP(userPrompt: string): Promise<QueryData> {
//     // Get the high-level database schema summary to be used in the prompt.
//     // The db.schema file could be generated by a background process or the 
//     // schema could be dynamically retrieved.
//     const dbSchema = await fs.promises.readFile('db.schema', 'utf8');
//     const systemPrompt = `
//       Assistant is a natural language to SQL bot that returns only a JSON object with the SQL query and 
//       the parameter values in it. The SQL will query a PostgreSQL database.
//       PostgreSQL tables, with their columns:    
//       ${dbSchema}
//       Rules:
//       - Convert any strings to a PostgreSQL parameterized query value to avoid SQL injection attacks.
//       - Always return a JSON object with the SQL query and the parameter values in it.
//       - Return a valid JSON object. Do NOT include any text outside of the JSON object.
//       - Example JSON object to return: { "sql": "", "paramValues": [] }
//       User: "Display all company reviews. Group by company."      
//       Assistant: { "sql": "SELECT * FROM reviews", "paramValues": [] }
//       User: "Display all reviews for companies located in cities that start with 'L'."
//       Assistant: { "sql": "SELECT r.* FROM reviews r INNER JOIN customers c ON r.customer_id = c.id WHERE c.city LIKE 'L%'", "paramValues": [] }
//       User: "Display revenue for companies located in London. Include the company name and city."
//       Assistant: { 
//         "sql": "SELECT c.company, c.city, SUM(o.total) AS revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE c.city = $1 GROUP BY c.company, c.city", 
//         "paramValues": ["London"] 
//       }
//       User: "Get the total revenue for Adventure Works Cycles. Include the contact information as well."
//       Assistant: { 
//         "sql": "SELECT c.company, c.city, c.email, SUM(o.total) AS revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE c.company = $1 GROUP BY c.company, c.city, c.email", 
//         "paramValues": ["Adventure Works Cycles"] 
//       }
//       - Convert any strings to a PostgreSQL parameterized query value to avoid SQL injection attacks.
//       - Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. Just the JSON object is needed.
//     `;
//     let queryData: QueryData = { sql: '', paramValues: [], error: '' };
//     let results = '';
//     try {
//         results = await callOpenAI(systemPrompt, userPrompt);
//         if (results) {
//             console.log('results', results);
//             const parsedResults = JSON.parse(results);
//             queryData = { ...queryData, ...parsedResults };
//             if (isProhibitedQuery(queryData.sql)) {
//                 queryData.sql = '';
//                 queryData.error = 'Prohibited query.';
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         if (isProhibitedQuery(results)) {
//             queryData.sql = '';
//             queryData.error = 'Prohibited query.';
//         } else {
//             queryData.error = results;
//         }
//     }
//     return queryData;
// }
// function isProhibitedQuery(query: string): boolean {
//     if (!query) return false;
//     const prohibitedKeywords = [
//         'insert', 'update', 'delete', 'drop', 'truncate', 'alter', 'create', 'replace',
//         'information_schema', 'pg_catalog', 'pg_tables', 'pg_namespace', 'pg_class',
//         'table_schema', 'table_name', 'column_name', 'column_default', 'is_nullable',
//         'data_type', 'udt_name', 'character_maximum_length', 'numeric_precision',
//         'numeric_scale', 'datetime_precision', 'interval_type', 'collation_name',
//         'grant', 'revoke', 'rollback', 'commit', 'savepoint', 'vacuum', 'analyze'
//     ];
//     const queryLower = query.toLowerCase();
//     return prohibitedKeywords.some(keyword => queryLower.includes(keyword));
// }
// async function completeEmailSMSMessages(prompt: string, company: string, contactName: string) {
//     console.log('Inputs:', prompt, company, contactName);
//     const systemPrompt = `
//       Assistant is a bot designed to help users create email and SMS messages from data and 
//       return a JSON object with the email and SMS message information in it.
//       Rules:
//       - Generate a subject line for the email message.
//       - Use the User Rules to generate the messages. 
//       - All messages should have a friendly tone and never use inappropriate language.
//       - SMS messages should be in plain text format and NO MORE than 160 characters. 
//       - Start the message with "Hi <Contact Name>,\n\n". Contact Name can be found in the user prompt.
//       - Add carriage returns to the email message to make it easier to read. 
//       - End with a signature line that says "Sincerely,\nCustomer Service".
//       - Return a valid JSON object with the emailSubject, emailBody, and SMS message values in it:
//       { "emailSubject": "", "emailBody": "", "sms": "" }
//       - The sms property value should be in plain text format and NO MORE than 160 characters. 
//       - Only return a valid JSON object. Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. 
//       Just the JSON object is needed.
//     `;
//     const userPrompt = `
//       User Rules: 
//       ${prompt}
//       Contact Name: 
//       ${contactName}
//     `;
//     let content: EmailSmsResponse = { status: true, email: '', sms: '', error: '' };
//     let results = '';
//     try {
//         results = await callOpenAI(systemPrompt, userPrompt, 0.5);
//         if (results) {
//             const parsedResults = JSON.parse(results);
//             content = { ...content, ...parsedResults, status: true };
//         }
//     }
//     catch (e) {
//         console.log(e);
//         content.status = false;
//         content.error = results;
//     }
//     return content;
// }
// export { completeBYOD, completeEmailSMSMessages, getSQLFromNLP as getSQL };
