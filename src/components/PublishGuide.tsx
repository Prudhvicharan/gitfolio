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
            GitHub must generate this animation inside your profile repository.
            Complete every step below before adding it to your README.
          </p>
          <ol className="snake-steps">
            <li>
              <strong>Download the workflow.</strong> Save it at exactly{' '}
              <code>.github/workflows/snake.yml</code> inside{' '}
              <code>{username || 'your-username'}/{username || 'your-username'}</code>.
            </li>
            <li>
              <strong>Commit and push it to <code>main</code>.</strong> If your
              default branch has another name, update the workflow’s push branch
              before committing.
            </li>
            <li>
              <strong>Allow the workflow to write.</strong> In the repository,
              open <em>Settings → Actions → General → Workflow permissions</em>
              and select <em>Read and write permissions</em> if it is not already enabled.
            </li>
            <li>
              <strong>Run it once.</strong> Open the repository’s Actions tab,
              select <em>GitHub Snake Game</em>, choose <em>Run workflow</em>, and
              wait for the run to finish successfully.
            </li>
            <li>
              <strong>Verify the result.</strong> Confirm that an{' '}
              <code>output</code> branch now contains{' '}
              <code>github-snake.svg</code> and{' '}
              <code>github-snake-dark.svg</code>.
            </li>
          </ol>
          <button
            className="btn-secondary"
            onClick={() =>
              downloadFile(
                generateSnakeWorkflow(),
                'snake.yml',
                'text/yaml'
              )
            }
          >
            Download snake.yml
          </button>
          <p className="help">
            The file contains no username, email, token, or other personal data.
            It uses GitHub’s repository-owner variable and automatic workflow token.
          </p>
          {username && (
            <p className="snake-links">
              <a href={`https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/actions`} target="_blank" rel="noopener noreferrer">Open Actions ↗</a>
              {' · '}
              <a href={`https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/tree/output`} target="_blank" rel="noopener noreferrer">Check output branch ↗</a>
            </p>
          )}
          <label className="check-option">
            <input
              type="checkbox"
              checked={!!config.snakeReady}
              onChange={(e) => onChange({ snakeReady: e.target.checked })}
            />
            <span>
              I verified a successful workflow run and the output branch files.
              Include the snake in my README.
            </span>
          </label>
          {!config.snakeReady && (
            <p className="notice warning">
              The snake will not appear in Preview or the downloaded README until
              you complete the setup and confirm it above.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
