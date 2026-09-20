import type { GeneratorConfig } from '../types';
import {
  generateContribution3dWorkflow,
  generateSnakeWorkflow,
} from '../utils/generateMarkdown';
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
      {config.sections.contribution3d && (
        <div className="snake-setup">
          <h3>Set up the 3D contribution landscape</h3>
          <p>
            Generate the contribution visual in your own profile repository so
            it remains independent of a public stats-card server.
          </p>
          <ol className="snake-steps">
            <li>
              <strong>Download the workflow.</strong> Save it at exactly{' '}
              <code>.github/workflows/profile-3d.yml</code> inside{' '}
              <code>{username || 'your-username'}/{username || 'your-username'}</code>.
            </li>
            <li>
              <strong>Commit and push it.</strong> The workflow uses GitHub’s
              automatic repository token; you do not need to create a secret.
            </li>
            <li>
              <strong>Allow repository writes.</strong> In{' '}
              <em>Settings → Actions → General → Workflow permissions</em>,
              select <em>Read and write permissions</em>.
            </li>
            <li>
              <strong>Run it once.</strong> In Actions, open{' '}
              <em>GitHub Profile 3D Contributions</em>, select{' '}
              <em>Run workflow</em>, and wait for a successful run.
            </li>
            <li>
              <strong>Verify the asset.</strong> Confirm that{' '}
              <code>profile-3d-contrib/profile-night-rainbow.svg</code> exists
              on your default branch.
            </li>
          </ol>
          <button
            className="btn-secondary"
            onClick={() =>
              downloadFile(
                generateContribution3dWorkflow(),
                'profile-3d.yml',
                'text/yaml'
              )
            }
          >
            Download profile-3d.yml
          </button>
          <p className="help">
            The workflow contains no username, email, API key, or personal
            token. It uses the repository owner and GitHub’s automatic token.
          </p>
          {username && (
            <p className="snake-links">
              <a href={`https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/actions`} target="_blank" rel="noopener noreferrer">Open Actions ↗</a>
              {' · '}
              <a href={`https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(username)}/tree/HEAD/profile-3d-contrib`} target="_blank" rel="noopener noreferrer">Check generated assets ↗</a>
            </p>
          )}
          <label className="check-option">
            <input
              type="checkbox"
              checked={!!config.contribution3dReady}
              onChange={(e) =>
                onChange({ contribution3dReady: e.target.checked })
              }
            />
            <span>
              I verified a successful run and the generated SVG. Include the
              3D landscape in my README.
            </span>
          </label>
          {!config.contribution3dReady && (
            <p className="notice warning">
              The landscape will not appear in Preview or the downloaded README
              until you complete the setup and confirm it above.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
