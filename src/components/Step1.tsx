import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import type { SocialLinks } from '../types';

interface Step1Props {
  username: string;
  setUsername: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (v: SocialLinks) => void;
  loading: boolean;
  error: string | null;
  onNext: () => void;
}

const InputRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
}> = ({ icon, label, value, onChange, placeholder, required, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
      {required && <span className="text-indigo-400">*</span>} {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input-field with-icon"
        style={{ paddingLeft: 44 }}
      />
    </div>
  </div>
);

const Step1: React.FC<Step1Props> = ({
  username, setUsername, jobTitle, setJobTitle,
  socialLinks, setSocialLinks, loading, error, onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-mono font-bold text-white mb-1">
          <span className="gradient-text">Who are you?</span>
        </h2>
        <p className="text-sm text-gray-500">We'll fetch your GitHub data and personalize everything.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputRow
          icon={<FaGithub size={16} />}
          label="GitHub Username"
          value={username}
          onChange={setUsername}
          placeholder="e.g. Prudhvicharan"
          required
        />

        <InputRow
          icon={<FaBriefcase size={14} />}
          label="Job Title / Focus Area"
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="e.g. Full Stack Engineer · ML Enthusiast"
        />

        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-mono text-gray-500 mb-3">Social Links <span className="text-gray-700">(optional — all appear as badges)</span></p>
          <div className="space-y-3">
            <InputRow
              icon={<FaLinkedin size={15} />}
              label="LinkedIn URL"
              value={socialLinks.linkedin || ''}
              onChange={(v) => setSocialLinks({ ...socialLinks, linkedin: v })}
              placeholder="https://linkedin.com/in/username"
            />
            <InputRow
              icon={<FaTwitter size={15} />}
              label="Twitter / X URL"
              value={socialLinks.twitter || ''}
              onChange={(v) => setSocialLinks({ ...socialLinks, twitter: v })}
              placeholder="https://twitter.com/username"
            />
            <InputRow
              icon={<FaGlobe size={14} />}
              label="Portfolio Website"
              value={socialLinks.portfolio || ''}
              onChange={(v) => setSocialLinks({ ...socialLinks, portfolio: v })}
              placeholder="https://yourwebsite.com"
            />
            <InputRow
              icon={<FaEnvelope size={14} />}
              label="Email"
              value={socialLinks.email || ''}
              onChange={(v) => setSocialLinks({ ...socialLinks, email: v })}
              placeholder="you@email.com"
              type="email"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
          >
            <span className="font-mono text-red-500 mt-0.5">✗</span>
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!username.trim() || loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching GitHub data...
            </>
          ) : (
            <>
              Fetch Profile & Continue
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default Step1;
