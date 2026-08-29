import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tourDates } from './tour-format.ts';

test('a single day prints in full', () => {
  assert.equal(tourDates('en').human({ date: '2026-09-21' }), '21 September 2026');
  assert.equal(tourDates('pl').human({ date: '2026-09-21' }), '21 września 2026');
});

test('a range inside one month prints the month once', () => {
  assert.equal(
    tourDates('en').human({ date: '2026-09-10', endDate: '2026-09-11' }),
    '10-11 September 2026',
  );
  assert.equal(
    tourDates('pl').human({ date: '2026-10-26', endDate: '2026-10-30' }),
    '26-30 października 2026',
  );
});

test('a range across two months prints both months and one year', () => {
  assert.equal(
    tourDates('en').human({ date: '2026-09-28', endDate: '2026-10-01' }),
    '28 September - 1 October 2026',
  );
  assert.equal(
    tourDates('pl').human({ date: '2026-09-28', endDate: '2026-10-01' }),
    '28 września - 1 października 2026',
  );
});

test('a calendar day is not moved by the machine timezone', () => {
  // The failure this guards against only appears west of UTC, where midnight
  // on the 10th is still the 9th locally.
  const previous = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';
  try {
    assert.equal(tourDates('en').human({ date: '2026-09-10' }), '10 September 2026');
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
