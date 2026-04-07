import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import { StepIndicator } from './components/StepIndicator';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import PreviewPanel from './components/PreviewPanel';
import { useGithub } from './hooks/useGithub';
import { generateAIContent } from './hooks/useGemini';
import { generateReadme } from './utils/generateMarkdown';
import type {
  GithubUser, GithubRepo, ThemeId, HeaderStyle,
  SocialLinks, SectionToggles, AIContent, GeneratorConfig,
} from './types';

const DEFAULT_SECTIONS: SectionToggles = {
  header: true,
  typing: true,
  socialBadges: true,
  aboutCode: true,
  skillIcons: true,
  funFacts: true,
  trophies: true,
  stats: true,
  streak: true,
  languages: true,
  activityGraph: true,
  topRepos: true,
  snake: true,
};

interface TerminalLine {
  text: string;
  type: string;
  id: number;
}

let logIdCounter = 0;

function App() {
  const [page, setPage] = useState<'hero' | 'wizard'>('hero');
  const [step, setStep] = useState(1);

  // Step 1
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [githubUser, setGithubUser] = useState<GithubUser | null>(null);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  // Step 2
  const [theme, setTheme] = useState<ThemeId>('radical');
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('wave');
  const [headerColor, setHeaderColor] = useState('0:3F3FFF,100:8B21F8');
  const [sections, setSections] = useState<SectionToggles>(DEFAULT_SECTIONS);

  // Step 3 AI
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

  // Output
  const [generatedMd, setGeneratedMd] = useState('');

  const { fetchProfile } = useGithub();

  const addLog = useCallback((text: string, type = 'info') => {
    setTerminalLines(prev => [...prev, { text, type, id: ++logIdCounter }]);
  }, []);

  const handleStep1Next = async () => {
    setFetchingGithub(true);
    setGithubError(null);
    try {
      const data = await fetchProfile(username.trim());
      if (data) {
        setGithubUser(data.user);
        setGithubRepos(data.repos);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setGithubError(err.message || 'Failed to fetch GitHub profile');
    } finally {
      setFetchingGithub(false);
    }
  };

  const handleStep3Generate = async (apiKey: string) => {
    if (!githubUser) return;
    setGenerating(true);
    setTerminalLines([]);
    try {
      const content = await generateAIContent(apiKey, githubUser, githubRepos, jobTitle, addLog);
      setAiContent(content);
    } catch (err: any) {
      addLog(`Error: ${err.message}`, 'warning');
    } finally {
      setGenerating(false);
    }
  };

  const handleFinish = () => {
    if (!githubUser) return;
    const config: GeneratorConfig = {
      theme,
      headerStyle,
      headerColor,
      socialLinks,
      sections,
      aiContent,
      userData: githubUser,
      repos: githubRepos,
      jobTitle,
    };
    const md = generateReadme(config);
    setGeneratedMd(md);
    // Scroll to preview on mobile
    setTimeout(() => {
      document.getElementById('preview-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto-generate when we have all config (live preview)
  useEffect(() => {
    if (!githubUser || step < 2) return;
    const config: GeneratorConfig = {
      theme, headerStyle, headerColor, socialLinks, sections,
      aiContent, userData: githubUser, repos: githubRepos, jobTitle,
    };
    const md = generateReadme(config);
    setGeneratedMd(md);
  }, [githubUser, theme, headerStyle, headerColor, socialLinks, sections, aiContent, jobTitle, githubRepos, step]);

  const reset = () => {
    setPage('hero');
    setStep(1);
    setUsername('');
    setJobTitle('');
    setSocialLinks({});
    setGithubUser(null);
    setGithubRepos([]);
    setAiContent(null);
    setGeneratedMd('');
    setTerminalLines([]);
    setGithubError(null);
  };

  if (page === 'hero') {
    return <Hero onStart={() => setPage('wizard')} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel — Wizard */}
        <div className="w-full lg:w-[460px] xl:w-[520px] shrink-0 flex flex-col border-r border-white/6">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/6">
            <button onClick={reset} className="flex items-center gap-2 group mb-4">
              <span className="text-lg font-mono font-black gradient-text tracking-tight">GitFolio</span>
              <span className="text-xs font-mono text-gray-600 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">v2</span>
            </button>
            <StepIndicator
              currentStep={step}
              totalSteps={3}
              labels={['Profile', 'Style', 'AI Magic']}
            />
          </div>

          {/* Step Content */}
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1
                  username={username}
                  setUsername={setUsername}
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  socialLinks={socialLinks}
                  setSocialLinks={setSocialLinks}
                  loading={fetchingGithub}
                  error={githubError}
                  onNext={handleStep1Next}
                />
              )}
              {step === 2 && (
                <Step2
                  theme={theme}
                  setTheme={setTheme}
                  headerStyle={headerStyle}
                  setHeaderStyle={setHeaderStyle}
                  headerColor={headerColor}
                  setHeaderColor={setHeaderColor}
                  sections={sections}
                  setSections={setSections}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && githubUser && (
                <Step3
                  user={githubUser}
                  repos={githubRepos}
                  jobTitle={jobTitle}
                  aiContent={aiContent}
                  onGenerate={handleStep3Generate}
                  onBack={() => setStep(2)}
                  onFinish={handleFinish}
                  generating={generating}
                  terminalLines={terminalLines}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer tip */}
          <div className="px-6 py-3 border-t border-white/5">
            <p className="text-xs text-gray-700 font-mono text-center">
              Preview updates live as you configure →
            </p>
          </div>
        </div>

        {/* Right Panel — Preview */}
        <div id="preview-panel" className="flex-1 p-4 md:p-6 min-h-[500px] lg:min-h-screen">
          <PreviewPanel markdown={generatedMd} onReset={reset} />
        </div>
      </div>
    </div>
  );
}

export default App;
