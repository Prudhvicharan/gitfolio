import { lazy, Suspense, useEffect, useState } from 'react';
import Hero from './components/Hero';
const Wizard = lazy(() => import('./components/Wizard'));
interface Route {
  page: 'home' | 'builder';
  step: number;
  demo: boolean;
}
const home: Route = { page: 'home', step: 1, demo: false };
const stepNames = ['profile', 'style', 'review'] as const;
const routeFromUrl = (): Route => {
  if (typeof window === 'undefined') return home;
  const value = new URLSearchParams(location.search).get('builder');
  const step = stepNames.indexOf(value as (typeof stepNames)[number]) + 1;
  return step
    ? {
        page: 'builder',
        step,
        demo: new URLSearchParams(location.search).get('demo') === '1',
      }
    : home;
};
const urlForRoute = (route: Route) => {
  const url = new URL(location.href);
  url.searchParams.delete('builder');
  url.searchParams.delete('demo');
  if (route.page === 'builder') {
    url.searchParams.set('builder', stepNames[route.step - 1]);
    if (route.demo) url.searchParams.set('demo', '1');
  }
  return `${url.pathname}${url.search}${url.hash}`;
};
export default function App() {
  const [route, setRoute] = useState<Route>(routeFromUrl);
  const [started, setStarted] = useState(() => routeFromUrl().page === 'builder');
  const [demo, setDemo] = useState(() => routeFromUrl().demo);
  const [sessionVersion, setSessionVersion] = useState(0);
  useEffect(() => {
    const initial = routeFromUrl();
    history.replaceState(
      { ...history.state, gitfolio: initial },
      '',
      urlForRoute(initial)
    );
    const pop = (event: PopStateEvent) => {
      const saved = event.state?.gitfolio;
      const next =
        saved && [1, 2, 3].includes(saved.step) ? saved : routeFromUrl();
      if (next.page === 'builder') {
        setStarted(true);
        setDemo(next.demo);
      }
      setRoute(next);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = (next: Route) => {
    history.pushState(
      { ...history.state, gitfolio: next },
      '',
      urlForRoute(next)
    );
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
