import { createProject, addIssueToProject } from '../push/github/project.push';
import { GitHubIssuePushService } from '../push/github/issue.push';
import { GitHubTokenManager } from './GitHubTokenManager';
import { Project, Issue, TimeBox } from '../model/models';

// Serviço para enviar modelos MADE para o GitHub
export class GitHubPushService {
  private issuePushService: GitHubIssuePushService;
  constructor() {
    this.issuePushService = new GitHubIssuePushService(GitHubTokenManager.getInstance().getToken());
  }

  // Cria um projeto no GitHub a partir do modelo MADE Project
  async pushProject(org: string, project: Project): Promise<string> {
    // Cria o projeto no GitHub
    const projectId = await createProject(org, project.name);
    return projectId;
  }

  // Cria uma issue no GitHub a partir do modelo MADE Issue e adiciona ao projeto
  async pushIssue(
    org: string,
    repo: string,
    projectId: string,
    issue: Issue,
    timebox: TimeBox
  ): Promise<{ issueId: string; issueNumber: number; projectItemId: string }> {
    // Cria a issue no GitHub
    const assignees = this.issuePushService.getAssigneesForIssueFromTimeBox(timebox, issue.id);
    const created = await this.issuePushService.createIssue(org, repo, issue, assignees);

    // Adiciona a issue ao projeto
    const projectItemId = await addIssueToProject(projectId, created.id);
    return {
      issueId: created.id,
      issueNumber: created.number,
      projectItemId
    };
  }

  // Exemplo: envia um projeto e suas issues
  async pushProjectWithIssues(
    org: string,
    repo: string,
    project: Project,
    issues: Issue[],
    timebox: TimeBox
  ): Promise<void> {
    const projectId = await this.pushProject(org, project);
    for (const issue of issues) {
      await this.pushIssue(org, repo, projectId, issue, timebox);
    }
  }
}