import type { GeneratorConfig } from '../types';
import { generateSnakeWorkflow } from '../utils/generateMarkdown';
import { downloadFile } from '../utils/download';
export default function PublishGuide({
  config,
  onChange,
}: {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
}) {
  const username = config.userData?.login;
  return (
    <section
      className="publish-guide"
      id="publish-guide"
      aria-labelledby="publish-heading"
    >
      <span className="eyebrow">THE LAST MILE</span>
      <h2 id="publish-heading" tabIndex={-1}>
        Put your README on GitHub.
      </h2>
      <p>GitFolio creates the file. You stay in control of what goes public.</p>
      <ol>
        <li>
          <strong>Create your profile repository.</strong>
          <p>
            On GitHub, create a public repository named exactly{' '}
            <code>{username || 'your-username'}</code>, matching your username.
            If it exists, open it instead.
          </p>
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create a repository ↗
          </a>
        </li>
        <li>
          <strong>Copy or download your README.</strong>
          <p>
            Review the facts and links, then paste the Markdown into{' '}
            <code>README.md</code> at the repository root. Save a copy of any
            existing README before replacing it.
          </p>
        </li>
        <li>
          <strong>Commit, then check your profile.</strong>
          <p>
            Open your GitHub profile to verify formatting, links, and widgets.
            Third-party widgets can be unavailable even when the Markdown is
            correct.
          </p>
        </li>
      </ol>
      {config.sections.snake && (
        <div className="snake-setup">
          <h3>Set up the contribution snake</h3>
          <p>
            This optional animation needs a GitHub Actions workflow. Download
            it, save it as <code>.github/workflows/snake.yml</code> in your
            profile repository, commit it, then run “Generate contribution
            snake” from the Actions tab. The workflow writes an{' '}
            <code>output</code> branch and runs daily.
          </p>
          <button
            className="btn-secondary"
            onClick={() =>
              downloadFile(
                generateSnakeWorkflow(username || ''),
                'snake.yml',
                'text/yaml'
              )
            }
          >
            Download snake.yml
          </button>
          <p className="help">
            Review the third-party actions and repository permissions before
            enabling the workflow.
          </p>
          <label className="check-option">
            <input
              type="checkbox"
              checked={!!config.snakeReady}
              onChange={(e) => onChange({ snakeReady: e.target.checked })}
            />
            <span>
              The workflow has run successfully; include its animation in my
              README.
            </span>
          </label>
        </div>
      )}
    </section>
  );
}
