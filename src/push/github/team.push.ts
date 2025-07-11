import { axiosInstance } from '../../util/axiosInstance';
import { GitHubTokenManager } from '../../service/GitHubTokenManager';

/**
 * Cria ou garante um time na organização do GitHub.
 */
export async function createOrEnsureTeam(
  org: string,
  teamName: string,
  description?: string
): Promise<void> {
  const slug = teamName.toLowerCase().replace(/ /g, '-');
  const url = `https://api.github.com/orgs/${org}/teams/${encodeURIComponent(slug)}`;
  const axios_instance = axiosInstance(GitHubTokenManager.getInstance().getToken());

  try {
    await axios_instance.get(url);
    // Team exists, nothing to do
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Create the team if it doesn't exist
      await axios_instance.post(
        `https://api.github.com/orgs/${org}/teams`,
        {
          name: teamName,
          description: description || '',
        }
      );
    } else {
      throw error;
    }
  }
}