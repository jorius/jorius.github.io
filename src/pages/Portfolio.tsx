// packages
import { useEffect } from 'react';
import { FaGithub, FaLock } from 'react-icons/fa';
import { FiArrowUpRight, FiLoader } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// hooks
import useGitHubRepos from '../hooks/useGitHubRepos';
import type { GitHubRepo } from '../hooks/useGitHubRepos';

// data
import portfolio from '../data/portfolio.json';
import privateRepos from '../data/private-repos.json';

// utils
import { techConfig } from '../utils/techConfig';

interface ClientProject {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github?: string | null;
  demo?: string | null;
}

interface PrivateRepoConfig {
  id: string;
  name: string;
  description: string;
  tech: string[];
  lastCommit: string | null;
}

const TechChip = ({ name }: { name: string }): React.ReactElement => {
  const config = techConfig[name];
  const color = config?.color ?? '#707070';
  return (
    <div
      className="flex items-center gap-1.5 font-space-mono text-xs border px-2 py-1 whitespace-nowrap w-fit"
      style={{ borderColor: `${color}60`, color }}
    >
      {config?.Icon && <config.Icon className="w-3 h-3 flex-shrink-0" />}
      <span>{name}</span>
    </div>
  );
};

const RepoCard = ({ repo }: { repo: GitHubRepo }): React.ReactElement => {
  const techs = [
    repo.language,
    ...repo.topics.filter((t) => techConfig[t] !== undefined),
  ].filter(Boolean) as string[];


  return (
    <div className="flex flex-col gap-3 bg-portfolio-dark-800 border border-portfolio-gray-200 p-5 h-[220px] group hover:border-principal transition-all duration-300 overflow-hidden">
      <h3 className="font-space-mono font-bold text-lg text-white tracking-[-0.27px] truncate">
        {repo.name}
      </h3>
      <p className="font-space-mono text-xs text-portfolio-gray-400 tracking-[-0.18px] leading-relaxed line-clamp-3 flex-1">
        {repo.description ?? 'No description provided.'}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {techs.slice(0, 4).map((tag) => (
          <TechChip key={tag} name={tag} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-portfolio-gray-200">
        <div className="flex items-center gap-4">
          {repo.private ? (
            <div className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400">
              <FaLock className="w-3 h-3" />
              <span>Private</span>
            </div>
          ) : (
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>Public</span>
            </a>
          )}
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400 hover:text-white transition-colors"
            >
              <FiArrowUpRight className="w-3.5 h-3.5" />
              <span>Live</span>
            </a>
          )}
        </div>
        {repo.lastCommitSha && (
          repo.private ? (
            <span className="font-space-mono text-xs text-portfolio-gray-400 tracking-widest">
              #{repo.lastCommitSha.substring(0, 7)}
            </span>
          ) : (
            <a
              href={`${repo.html_url}/commit/${repo.lastCommitSha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-space-mono text-xs text-portfolio-gray-400 hover:text-white tracking-widest transition-colors"
            >
              #{repo.lastCommitSha.substring(0, 7)}
            </a>
          )
        )}
      </div>
    </div>
  );
};

const PrivateConfigCard = ({ repo }: { repo: PrivateRepoConfig }): React.ReactElement => (
  <div className="flex flex-col gap-3 bg-portfolio-dark-800 border border-portfolio-gray-200 p-5 h-[220px] group hover:border-principal transition-all duration-300 overflow-hidden">
    <h3 className="font-space-mono font-bold text-lg text-white tracking-[-0.27px] truncate">
      {repo.name}
    </h3>
    <p className="font-space-mono text-xs text-portfolio-gray-400 tracking-[-0.18px] leading-relaxed line-clamp-3 flex-1">
      {repo.description}
    </p>

    <div className="flex flex-wrap gap-1.5">
      {repo.tech.slice(0, 4).map((tag) => (
        <TechChip key={tag} name={tag} />
      ))}
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-portfolio-gray-200">
      <div className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400">
        <FaLock className="w-3 h-3" />
        <span>Private</span>
      </div>
      {repo.lastCommit && (
        <span className="font-space-mono text-xs text-portfolio-gray-400 tracking-widest">
          #{repo.lastCommit.substring(0, 7)}
        </span>
      )}
    </div>
  </div>
);

const ClientCard = ({ project }: { project: ClientProject }): React.ReactElement => (
  <div className="flex flex-col gap-3 bg-portfolio-dark-800 border border-portfolio-gray-200 p-5 h-[220px] group hover:border-principal transition-all duration-300 overflow-hidden">
    <h3 className="font-space-mono font-bold text-lg text-white tracking-[-0.27px] truncate">
      {project.title}
    </h3>
    <p className="font-space-mono text-xs text-portfolio-gray-400 tracking-[-0.18px] leading-relaxed line-clamp-3 flex-1">
      {project.description}
    </p>

    <div className="flex flex-wrap gap-1.5">
      {project.tech.slice(0, 4).map((tag) => (
        <TechChip key={tag} name={tag} />
      ))}
    </div>

    <div className="flex items-center gap-4 pt-2 border-t border-portfolio-gray-200">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400 hover:text-white transition-colors"
        >
          <FaGithub className="w-3.5 h-3.5" />
          Code
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-space-mono text-xs text-portfolio-gray-400 hover:text-white transition-colors"
        >
          <FiArrowUpRight className="w-3.5 h-3.5" />
          Live
        </a>
      )}
    </div>
  </div>
);

const Portfolio = (): React.ReactElement => {
  const { t } = useTranslation();
  const { repos, loading, error } = useGitHubRepos();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-portfolio-dark-900 pt-[60px]">
      <div className="max-w-[1299px] mx-auto px-16 py-24 flex flex-col gap-20">
        {/* Page title */}
        <h1 className="font-space-mono font-bold text-[48px] text-principal text-center leading-none tracking-[-0.72px]">
          {t('nav.portfolio')}
        </h1>

        {/* Two columns side by side */}
        <div className="flex items-start gap-0">
          {/* Left — GitHub / Personal Projects */}
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h2 className="font-space-mono font-bold text-[40px] text-white leading-none tracking-[-0.6px]">
                {t('portfolio.sections.personal.label', 'Highlights')}
              </h2>
              <p className="font-space-mono text-base text-principal mt-3 tracking-[-0.24px]">
                {t('portfolio.sections.personal.sublabel', 'GitHub or Personal Projects')}
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-3 font-space-mono text-sm text-portfolio-gray-400">
                <FiLoader className="w-4 h-4 animate-spin" />
                Loading repositories…
              </div>
            )}

            {error && (
              <p className="font-space-mono text-sm text-red-400">{error}</p>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-4">
                {repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
                {(privateRepos as PrivateRepoConfig[]).map((repo) => (
                  <PrivateConfigCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-portfolio-gray-200 self-stretch mx-16 flex-shrink-0" />

          {/* Right — Client's Public Projects */}
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h2 className="font-space-mono font-bold text-[40px] text-white leading-none tracking-[-0.6px]">
                {t('portfolio.sections.client.label', "Client's")}
              </h2>
              <p className="font-space-mono text-base text-principal mt-3 tracking-[-0.24px]">
                {t('portfolio.sections.client.sublabel', 'Public Projects')}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {portfolio.clientProjects.map((project) => (
                <ClientCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
