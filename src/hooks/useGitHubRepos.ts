// packages
import { useState, useEffect } from 'react';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  private: boolean;
  lastCommitSha: string | null;
}

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

// No Authorization header anywhere in this file: the hook ships to a
// static GitHub Pages site, so any token would leak to every visitor.
// Trade-off: GitHub limits unauthenticated requests to 60/hr per visitor IP,
// and only public repositories are returned.
const fetchLastCommitSha = async (fullName: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/commits?per_page=1`,
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    );
    if (!response.ok) return null;
    const [commit] = await response.json();
    return commit?.sha ?? null;
  } catch {
    return null;
  }
};

const useGitHubRepos = (): UseGitHubReposResult => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const username = import.meta.env.VITE_GITHUB_USERNAME;
        if (!username) {
          throw new Error('VITE_GITHUB_USERNAME is not configured');
        }

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          { headers: { Accept: 'application/vnd.github.v3+json' } },
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const data: Omit<GitHubRepo, 'lastCommitSha'>[] = await response.json();

        const commitShas = await Promise.all(
          data.map((repo) => fetchLastCommitSha(repo.full_name)),
        );

        setRepos(data.map((repo, i) => ({ ...repo, lastCommitSha: commitShas[i] })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
};

export default useGitHubRepos;
