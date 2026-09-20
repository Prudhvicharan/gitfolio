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
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
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
        <span className="eyebrow">01 / YOUR PROFILE</span>
        <h1 id="step-heading-1" tabIndex={-1}>
          Start with your GitHub.
        </h1>
        <p>
          Import public repositories, then choose what tells your story. No
          login required.
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
          required
        />
        <Field
          label="Job title or focus"
          value={p.jobTitle}
          onChange={p.setJobTitle}
          placeholder="e.g. Frontend engineer"
        />
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
              Only links you enter are published. URLs must use HTTP or HTTPS.
            </p>
          </div>
        </details>
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
        {p.loading && (
          <button className="btn-secondary" type="button" onClick={p.onCancel}>
            Cancel import
          </button>
        )}
      </form>
      <button className="text-button" onClick={p.onDemo} disabled={p.loading}>
        Just exploring? Try the sample profile <ArrowRight size={15} />
      </button>
      <div className="quiet-note">
        Your public profile comes directly from GitHub. AI is optional and
        requires your own Gemini API key.
      </div>
    </section>
  );
}
