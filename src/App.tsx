import { lazy, Suspense, useEffect, useState } from 'react';
import Hero from './components/Hero';
const Wizard = lazy(() => import('./components/Wizard'));
interface Route {
  page: 'home' | 'builder';
  step: number;
  demo: boolean;
}
const home: Route = { page: 'home', step: 1, demo: false };
export default function App() {
  const [route, setRoute] = useState<Route>(home);
  const [started, setStarted] = useState(false);
  const [demo, setDemo] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);
  useEffect(() => {
    history.replaceState({ ...history.state, gitfolio: home }, '');
    const pop = (event: PopStateEvent) => {
      const next = event.state?.gitfolio;
      setRoute(next && [1, 2, 3].includes(next.step) ? next : home);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = (next: Route) => {
    history.pushState({ ...history.state, gitfolio: next }, '');
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const start = (sample = false) => {
    if (sample && started) {
      if (
        !window.confirm(
          'Open a fresh sample profile? Your saved draft will be kept, but unsaved session changes will be replaced.'
        )
      )
        return;
      setSessionVersion((value) => value + 1);
      setDemo(true);
    }
    if (!started) {
      setDemo(sample);
      setStarted(true);
    }
    navigate({ page: 'builder', step: sample ? 2 : 1, demo: sample });
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {route.page === 'home' && (
        <Hero onStart={() => start()} onDemo={() => start(true)} />
      )}
      {started && (
        <div hidden={route.page !== 'builder'}>
          <Suspense
            fallback={
              <main id="main-content" className="loading-screen" role="status">
                Loading your profile builder…
              </main>
            }
          >
            <Wizard
              key={sessionVersion}
              step={route.step}
              onStep={(step) => navigate({ ...route, page: 'builder', step })}
              onHome={() => navigate(home)}
              startDemo={demo}
              active={route.page === 'builder'}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
