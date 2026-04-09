import { motion } from 'framer-motion';
import type { ThemeId, HeaderStyle, SectionToggles } from '../types';

const THEMES: { id: ThemeId; label: string; colors: string[] }[] = [
  { id: 'radical', label: 'Radical', colors: ['#fe428e', '#141321', '#a9fef7'] },
  { id: 'tokyonight', label: 'Tokyo Night', colors: ['#70a5fd', '#1a1b27', '#bf91f3'] },
  { id: 'dracula', label: 'Dracula', colors: ['#ff79c6', '#282a36', '#bd93f9'] },
  { id: 'github_dark', label: 'GitHub Dark', colors: ['#58a6ff', '#0d1117', '#1f6feb'] },
  { id: 'onedark', label: 'One Dark', colors: ['#e5c07b', '#282c34', '#61afef'] },
  { id: 'nord', label: 'Nord', colors: ['#81a1c1', '#2e3440', '#88c0d0'] },
  { id: 'catppuccin_mocha', label: 'Catppuccin', colors: ['#cba6f7', '#1e1e2e', '#89b4fa'] },
];

const HEADER_STYLES: { id: HeaderStyle; label: string; desc: string }[] = [
  { id: 'wave', label: 'Wave', desc: 'Smooth flowing wave banner' },
  { id: 'venom', label: 'Venom', desc: 'Jagged, dramatic edge' },
  { id: 'slice', label: 'Slice', desc: 'Clean diagonal cut' },
  { id: 'cylinder', label: 'Cylinder', desc: 'Rounded cylindrical pill' },
  { id: 'shark', label: 'Shark', desc: 'Shark-fin spike' },
];

const HEADER_COLORS = [
  { value: '#6366F1', label: 'Indigo' },
  { value: '0:3F3FFF,100:8B21F8', label: 'Violet Grad' },
  { value: '0:22D3EE,100:6366F1', label: 'Cyan Blue' },
  { value: '0:F59E0B,100:EF4444', label: 'Sunset' },
  { value: 'gradient', label: 'Rainbow' },
  { value: '#0D1117', label: 'Dark' },
];

const TOGGLEABLE_SECTIONS: { key: keyof SectionToggles; label: string; emoji: string }[] = [
  { key: 'header', label: 'Wave Banner', emoji: '🌊' },
  { key: 'typing', label: 'Typing Animation', emoji: '⌨️' },
  { key: 'socialBadges', label: 'Social Badges', emoji: '🔗' },
  { key: 'aboutCode', label: 'About Me (Code)', emoji: '💻' },
  { key: 'skillIcons', label: 'Skill Icons', emoji: '🛠️' },
  { key: 'funFacts', label: 'Fun Facts', emoji: '⚡' },
  { key: 'trophies', label: 'GitHub Trophies', emoji: '🏆' },
  { key: 'stats', label: 'GitHub Stats', emoji: '📊' },
  { key: 'streak', label: 'Streak Stats', emoji: '🔥' },
  { key: 'languages', label: 'Top Languages', emoji: '📈' },
  { key: 'activityGraph', label: 'Activity Graph', emoji: '📉' },
  { key: 'topRepos', label: 'Top Repos', emoji: '🚩' },
  { key: 'snake', label: 'Snake Animation', emoji: '🐍' },
];

interface Step2Props {
  theme: ThemeId;
  setTheme: (v: ThemeId) => void;
  headerStyle: HeaderStyle;
  setHeaderStyle: (v: HeaderStyle) => void;
  headerColor: string;
  setHeaderColor: (v: string) => void;
  sections: SectionToggles;
  setSections: (v: SectionToggles) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({
  theme, setTheme, headerStyle, setHeaderStyle, headerColor, setHeaderColor,
  sections, setSections, onNext, onBack,
}) => {
  const toggle = (key: keyof SectionToggles) => {
    setSections({ ...sections, [key]: !sections[key] });
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-mono font-bold text-white mb-1">
          <span className="gradient-text">Style It</span>
        </h2>
        <p className="text-sm text-gray-500">Pick a theme, header style, and choose which sections to include.</p>
      </div>

      {/* Theme Picker */}
      <div>
        <p className="text-xs font-mono text-gray-400 mb-2">STATS THEME</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                theme === t.id
                  ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                  : 'border-white/8 bg-white/3 text-gray-500 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              <span className="flex gap-0.5">
                {t.colors.map((c, i) => (
                  <span key={i} style={{ background: c, width: 8, height: 8, borderRadius: 2, display: 'inline-block' }} />
                ))}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header Style */}
      <div>
        <p className="text-xs font-mono text-gray-400 mb-2">HEADER STYLE</p>
        <div className="grid grid-cols-3 gap-2">
          {HEADER_STYLES.map((h) => (
            <button
              key={h.id}
              onClick={() => setHeaderStyle(h.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                headerStyle === h.id
                  ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                  : 'border-white/8 bg-white/3 text-gray-500 hover:border-white/20'
              }`}
            >
              <div className={`text-sm font-mono font-bold ${headerStyle === h.id ? 'text-purple-300' : 'text-gray-400'}`}>
                {h.label}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">{h.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Header Color */}
      <div>
        <p className="text-xs font-mono text-gray-400 mb-2">BANNER COLOR</p>
        <div className="flex gap-2 flex-wrap">
          {HEADER_COLORS.map((c) => {
            const isSelected = headerColor === c.value;
            // Compute the display background for the swatch
            const swatchBg = c.value === 'gradient'
              ? 'linear-gradient(135deg, #f43f5e, #f59e0b, #10b981, #6366f1)'
              : c.value.includes(':')
              ? `linear-gradient(135deg, #${c.value.split(',')[0].split(':')[1]}, #${c.value.split(',')[1].split(':')[1]})`
              : c.value;
            return (
              <button
                key={c.value}
                onClick={() => setHeaderColor(c.value)}
                title={c.label}
                className={`w-9 h-9 rounded-lg transition-all ${
                  isSelected
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                    : 'ring-1 ring-white/20 hover:ring-white/50 hover:scale-105'
                }`}
                style={{ background: swatchBg }}
              />
            );
          })}
        </div>
      </div>

      {/* Section Toggles */}
      <div>
        <p className="text-xs font-mono text-gray-400 mb-2">SECTIONS</p>
        <div className="grid grid-cols-2 gap-2">
          {TOGGLEABLE_SECTIONS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left"
              style={{
                background: sections[key] ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                borderColor: sections[key] ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)',
              }}
            >
              <span className={`text-xs font-mono ${sections[key] ? 'text-indigo-300' : 'text-gray-500'}`}>
                {emoji} {label}
              </span>
              <div className={`toggle-checkbox ${sections[key] ? 'on' : 'off'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">← Back</button>
        <button onClick={onNext} className="btn-primary flex-1">AI Magic ✨</button>
      </div>
    </motion.div>
  );
};

export default Step2;
