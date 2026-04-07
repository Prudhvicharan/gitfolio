import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 8,
  opacity: Math.random() * 0.4 + 0.1,
}));

const EXAMPLE_BADGES = [
  'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
  'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
  'https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white',
  'https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white',
  'https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white',
];

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Bio', desc: 'Gemini writes your tagline, about me, and fun facts from your real GitHub data' },
  { icon: '📊', title: '13+ Visual Components', desc: 'Stats, streaks, trophies, activity graph, skill icons, snake animation & more' },
  { icon: '🎨', title: '7 Themes & 5 Header Styles', desc: 'Radical, Tokyo Night, Dracula — pick what matches your aesthetic' },
  { icon: '🔒', title: 'Privacy First', desc: 'Your API key never leaves your browser. Direct calls to Google\'s servers only.' },
];

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle bg-indigo-400"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
        {/* bg glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-cyan-600/8 rounded-full blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono font-bold gradient-text tracking-tight">GitFolio</span>
          <span className="text-xs font-mono text-gray-600 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">v2</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="security-badge">🔒 Privacy First</span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Google Gemini AI · 100% Free
          </div>

          <h1 className="text-5xl md:text-7xl font-mono font-black tracking-tighter mb-5 leading-[0.95]">
            Your GitHub Profile,
            <br />
            <span className="shimmer-text">Reimagined.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Enter your GitHub username. AI analyzes your repos, writes your story,
            and assembles a <span className="text-white font-semibold">stunning profile README</span> with{' '}
            <span className="text-indigo-400">stats, animations, trophies,</span> and more.
          </p>

          {/* Example badges row */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 opacity-60">
            {EXAMPLE_BADGES.map((badge, i) => (
              <img key={i} src={badge} alt="badge" className="h-7" />
            ))}
          </div>

          <button
            onClick={onStart}
            className="btn-primary text-base px-10 py-4 rounded-2xl text-lg font-mono"
            id="get-started-btn"
          >
            Generate My Profile ✨
          </button>

          <p className="text-xs text-gray-600 mt-4 font-mono">
            Free · No login required · Takes ~30 seconds
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-left"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="text-sm font-mono font-bold text-white mb-1">{f.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-8 md:gap-12 mt-12 text-center opacity-50"
        >
          {[
            { num: '13+', label: 'Components' },
            { num: '7', label: 'Themes' },
            { num: '5', label: 'Header Styles' },
            { num: '1500', label: 'AI Req/Day Free' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-xl font-mono font-black gradient-text">{s.num}</div>
              <div className="text-xs text-gray-600 font-mono">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
