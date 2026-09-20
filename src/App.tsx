import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';
import {
  HOME_ROUTE,
  routeFromHref,
  urlForRoute,
  type AppRoute,
} from './utils/navigation';
const Wizard = lazy(() => import('./components/Wizard'));
const routeFromUrl = (): AppRoute =>
  typeof window === 'undefined'
    ? HOME_ROUTE
    : routeFromHref(window.location.href);
export default function App() {
  const [route, setRoute] = useState<AppRoute>(routeFromUrl);
  const [started, setStarted] = useState(() => routeFromUrl().page === 'builder');
  const [demo, setDemo] = useState(() => routeFromUrl().demo);
  const [sessionVersion, setSessionVersion] = useState(0);
  const demoRef = useRef(demo);
  useEffect(() => {
    const initial = routeFromUrl();
    history.replaceState(
      { ...history.state, gitfolio: initial },
      '',
      urlForRoute(initial, location.href)
    );
    const pop = (event: PopStateEvent) => {
      const saved = event.state?.gitfolio;
      const next =
        saved && [1, 2, 3].includes(saved.step) ? saved : routeFromUrl();
      if (next.page === 'builder') {
        setStarted(true);
        if (demoRef.current !== next.demo)
          setSessionVersion((value) => value + 1);
        demoRef.current = next.demo;
        setDemo(next.demo);
      }
      setRoute(next);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = (next: AppRoute) => {
    history.pushState(
      { ...history.state, gitfolio: next },
      '',
      urlForRoute(next, location.href)
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
    }
    if (started) setSessionVersion((value) => value + 1);
    demoRef.current = sample;
    setDemo(sample);
    setStarted(true);
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
              onHome={() => navigate(HOME_ROUTE)}
              onStartDemo={() => {
                demoRef.current = true;
                setDemo(true);
                navigate({ page: 'builder', step: 2, demo: true });
              }}
              onExitDemo={() => {
                demoRef.current = false;
                setDemo(false);
                setSessionVersion((value) => value + 1);
                navigate(HOME_ROUTE);
              }}
              onBuildProfile={() => {
                demoRef.current = false;
                setDemo(false);
                setSessionVersion((value) => value + 1);
                navigate({ page: 'builder', step: 1, demo: false });
              }}
              startDemo={demo}
              active={route.page === 'builder'}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
