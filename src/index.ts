import { MarkdownService } from "./documentation/service/markdown/MarkdownService";
export * from './model/models';
import { GitHubService } from "./service/GitHubService";
import { GitHubPushService } from "./service/GitHubPushService";
import { GitHubTokenManager } from "./extract/github/GitHubTokenManager";

export class ReportManager {

    public async githubETL(token: string, org: string, project: string) {
        if (!token) throw new Error('GITHUB_TOKEN not set');
        GitHubTokenManager.initialize(token);
        
        const githubService = new GitHubService();
        await githubService.ETLProject(org, project);
        await githubService.ETLIssue(org, project);
        await githubService.ETLBacklog(org, project);
        await githubService.ETLTimeBox(org, project);
    }

    public async githubPush(
        token: string,
        org: string,
        repo: string,
        project: import('./model/models').Project,
        issues: import('./model/models').Issue[]
    ) {
        const pushService = new GitHubPushService(token);
        await pushService.pushProjectWithIssues(org, repo, project, issues);
    }

    public createReport(dbPath: string) {
        const markdownService = new MarkdownService(dbPath);
        markdownService.createManagementDocumenation();
    }
    /*public createSprintSummary(dbPath: string){
        const markdownService = new MarkdownService(dbPath);
        return markdownService.createSprintSummary()
    }
    public createSprintSummaryReport(dbPath: string){
        const markdownService = new MarkdownService(dbPath);
        return markdownService.createSprintSumaryReport()
    }*/

   
}
