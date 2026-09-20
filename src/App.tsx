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
  const [sessionVersion, setSessionVersion] = useState(0);
  const routeRef = useRef(route);
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
      if (
        next.page === 'builder' &&
        routeRef.current.page === 'builder' &&
        routeRef.current.demo !== next.demo
      )
        setSessionVersion((value) => value + 1);
      routeRef.current = next;
      setRoute(next);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = (next: AppRoute) => {
    const stayOnPage = routeRef.current.page === next.page;
    history.pushState(
      { ...history.state, gitfolio: next },
      '',
      urlForRoute(next, location.href)
    );
    routeRef.current = next;
    setRoute(next);
    requestAnimationFrame(() =>
      window.scrollTo({
        top: 0,
        behavior:
          stayOnPage &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'smooth'
            : 'auto',
      })
    );
  };
  const start = (sample = false) => {
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
      {route.page === 'builder' && (
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
            onStep={(step) => navigate({ ...route, step })}
            onHome={() => navigate(HOME_ROUTE)}
            onStartDemo={() =>
              navigate({ page: 'builder', step: 2, demo: true })
            }
            onExitDemo={() => navigate(HOME_ROUTE)}
            onBuildProfile={() => {
              setSessionVersion((value) => value + 1);
              navigate({ page: 'builder', step: 1, demo: false });
            }}
            startDemo={route.demo}
            active
          />
        </Suspense>
      )}
    </>
  );
}
