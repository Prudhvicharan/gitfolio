export interface AppRoute {
  page: 'home' | 'builder';
  step: number;
  demo: boolean;
}

export const HOME_ROUTE: AppRoute = {
  page: 'home',
  step: 1,
  demo: false,
};

export const BUILDER_STEPS = ['profile', 'style', 'review'] as const;

export function routeFromHref(href: string): AppRoute {
  const url = new URL(href);
  const value = url.searchParams.get('builder');
  const step = BUILDER_STEPS.indexOf(
    value as (typeof BUILDER_STEPS)[number]
  ) + 1;
  return step
    ? {
        page: 'builder',
        step,
        demo: url.searchParams.get('demo') === '1',
      }
    : HOME_ROUTE;
}

export function urlForRoute(route: AppRoute, href: string): string {
  const url = new URL(href);
  url.searchParams.delete('builder');
  url.searchParams.delete('demo');
  url.hash = '';
  if (route.page === 'builder') {
    url.searchParams.set('builder', BUILDER_STEPS[route.step - 1]);
    if (route.demo) url.searchParams.set('demo', '1');
  }
  return `${url.pathname}${url.search}`;
}
