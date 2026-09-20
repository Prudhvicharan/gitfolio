import { useId } from 'react';
import { ArrowRight, UserRound, LoaderCircle } from 'lucide-react';
import type { SocialLinks } from '../types';
import { safeUrl } from '../utils/content';
interface Props {
  username: string;
  setUsername: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (value: SocialLinks) => void;
  loading: boolean;
  error: string | null;
  onNext: () => void;
  onDemo: () => void;
  onCancel: () => void;
  demo?: boolean;
  onBuildProfile: () => void;
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span> (required)</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        maxLength={300}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
      />
    </div>
  );
}
export default function Step1(p: Props) {
  const invalid = Object.entries(p.socialLinks).some(
    ([key, value]) => key !== 'email' && value && !safeUrl(value)
  );
  return (
    <section className="step-content" aria-labelledby="step-heading-1">
      <div className="section-intro">
        <span className="eyebrow">
          {p.demo ? '01 / CURATED SAMPLE' : '01 / YOUR PROFILE'}
        </span>
        <h1 id="step-heading-1" tabIndex={-1}>
          {p.demo ? 'Meet the fictional profile.' : 'Start with your GitHub.'}
        </h1>
        <p>
          {p.demo
            ? 'This identity is prefilled and locked so every demo step tells one consistent story.'
            : 'Import public repositories, then choose what tells your story. No login required.'}
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!invalid) p.onNext();
        }}
        className="form-stack"
        aria-busy={p.loading}
      >
        <Field
          label="GitHub username"
          value={p.username}
          onChange={p.setUsername}
          placeholder="e.g. octocat"
          required={!p.demo}
          disabled={p.demo}
        />
        <Field
          label="Job title or focus"
          value={p.jobTitle}
          onChange={p.setJobTitle}
          placeholder="e.g. Frontend engineer"
          disabled={p.demo}
        />
        {!p.demo && (
          <details className="disclosure">
            <summary>
              Social links <span>optional</span>
            </summary>
            <div className="form-stack">
              {(['linkedin', 'twitter', 'portfolio', 'email'] as const).map(
                (key) => (
                  <Field
                    key={key}
                    label={
                      {
                        linkedin: 'LinkedIn URL',
                        twitter: 'Twitter / X URL',
                        portfolio: 'Portfolio URL',
                        email: 'Email',
                      }[key]
                    }
                    value={p.socialLinks[key] || ''}
                    onChange={(value) =>
                      p.setSocialLinks({ ...p.socialLinks, [key]: value })
                    }
                    placeholder={
                      key === 'email' ? 'you@example.com' : 'https://…'
                    }
                    type={key === 'email' ? 'email' : 'text'}
                  />
                )
              )}
              <p className="help">
                Only links you enter are published. URLs must use HTTP or
                HTTPS.
              </p>
            </div>
          </details>
        )}
        {p.demo && (
          <div className="quiet-note demo-profile-note">
            <strong>Sample identity locked</strong>
            <span>
              Alex Morgan · Product Engineer · four fictional repositories
            </span>
          </div>
        )}
        {invalid && (
          <p className="notice error" role="alert">
            Check your social links. Enter a website address such as
            https://example.com.
          </p>
        )}
        {p.error && (
          <p className="notice error" role="alert">
            {p.error}
          </p>
        )}
        {!p.demo && (
          <button
            className="btn-primary full"
            disabled={!p.username.trim() || p.loading || invalid}
            type="submit"
          >
            {p.loading ? (
              <>
                <LoaderCircle size={18} className="spin" /> Importing profile…
              </>
            ) : (
              <>
                <UserRound size={18} /> Import profile <ArrowRight size={18} />
              </>
            )}
          </button>
        )}
        {p.loading && (
          <button className="btn-secondary" type="button" onClick={p.onCancel}>
            Cancel import
          </button>
        )}
      </form>
      {p.demo ? (
        <button className="btn-primary full" onClick={p.onBuildProfile}>
          Build my profile <ArrowRight size={18} />
        </button>
      ) : (
        <>
          <button
            className="text-button"
            onClick={p.onDemo}
            disabled={p.loading}
          >
            Just exploring? Try the sample profile <ArrowRight size={15} />
          </button>
          <div className="quiet-note">
            Your public profile comes directly from GitHub. AI is optional and
            requires your own Gemini API key.
          </div>
        </>
      )}
    </section>
  );
}
