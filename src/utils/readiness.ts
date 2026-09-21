import type { GeneratorConfig } from '../types';
import { safeUrl } from './content';

export interface ReadinessItem {
  label: string;
  complete: boolean;
  detail: string;
}

export interface ExportQuality {
  items: ReadinessItem[];
  issues: string[];
}

const validEmail = (value: string | undefined) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function assessExportQuality(
  config: GeneratorConfig,
  markdown: string
): ExportQuality {
  const bioComplete = !!(
    config.aiContent?.aboutMe.trim() || config.userData?.bio?.trim()
  );
  const enteredUrls = [
    config.socialLinks.linkedin,
    config.socialLinks.twitter,
    config.socialLinks.portfolio,
  ].filter((value): value is string => !!value?.trim());
  const linksComplete =
    enteredUrls.every((value) => !!safeUrl(value)) &&
    validEmail(config.socialLinks.email);
  const usefulProjects = config.repos.filter(
    (repo, index) =>
      repo.description?.trim() ||
      config.aiContent?.projectStories[index]?.trim() ||
      repo.language ||
      repo.topics?.length ||
      repo.stargazers_count > 0
  );
  const identityComplete = !!(
    config.jobTitle.trim() || config.aiContent?.tagline.trim()
  );
  const issues: string[] = [];
  if (!bioComplete)
    issues.push('Your About Me section is empty. Add a bio manually or generate an AI draft.');
  if (!identityComplete)
    issues.push('Add a job title or tagline to strengthen the opening impression.');
  if (!config.repos.length)
    issues.push('No featured repositories are selected.');
  else if (usefulProjects.length < config.repos.length)
    issues.push(
      `${config.repos.length - usefulProjects.length} selected project${config.repos.length - usefulProjects.length === 1 ? '' : 's'} lack a description, language, topics, stars, or reviewed story.`
    );
  if (!linksComplete)
    issues.push('One or more contact links are incomplete or use an unsupported URL.');
  if (/\\[.!~]/.test(markdown))
    issues.push('The generated Markdown contains a suspicious raw escaping artifact.');

  return {
    items: [
      {
        label: 'Profile imported',
        complete: !!config.userData,
        detail: config.userData ? `@${config.userData.login}` : 'Import a GitHub profile',
      },
      {
        label: 'Projects reviewed',
        complete: config.repos.length > 0,
        detail: config.repos.length
          ? `${config.repos.length} featured project${config.repos.length === 1 ? '' : 's'}`
          : 'Choose at least one project',
      },
      {
        label: 'Bio completed',
        complete: bioComplete,
        detail: bioComplete ? 'About Me has content' : 'About Me is still empty',
      },
      {
        label: 'Links checked',
        complete: linksComplete,
        detail: linksComplete ? 'Contact link formats are valid' : 'Review contact links',
      },
    ],
    issues,
  };
}
