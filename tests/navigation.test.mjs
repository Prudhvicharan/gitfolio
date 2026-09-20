import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOME_ROUTE,
  routeFromHref,
  urlForRoute,
} from '../src/utils/navigation.ts';

test('demo profile routes survive refresh without retaining stale fragments', () => {
  const href =
    'http://localhost:5173/?builder=profile&demo=1#how-it-works';
  assert.deepEqual(routeFromHref(href), {
    page: 'builder',
    step: 1,
    demo: true,
  });
  assert.equal(
    urlForRoute({ page: 'builder', step: 1, demo: true }, href),
    '/?builder=profile&demo=1'
  );
});

test('home navigation removes builder, demo, and anchor state', () => {
  assert.equal(
    urlForRoute(
      HOME_ROUTE,
      'http://localhost:5173/?builder=review&demo=1#how-it-works'
    ),
    '/'
  );
});
