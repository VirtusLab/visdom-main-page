import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CITY_PLACEMENT, TOUR_EVENTS } from './tour.ts';

/**
 * The map draws a stop only if its city is in CITY_PLACEMENT, and drops it in
 * silence otherwise: a stop added to the schedule with no coordinates shows up
 * in the table, is absent from the map, and nothing anywhere says so. These two
 * assertions are what makes that difference visible, by failing the build.
 */

const placedCities = Object.keys(CITY_PLACEMENT);

/** An online session has no place on a world map, and is meant to have none. */
const onMap = TOUR_EVENTS.filter((event) => event.city !== 'Online');

test('every city on the schedule has a place on the map', () => {
  const missing = [...new Set(onMap.map((event) => event.city))].filter(
    (city) => !(city in CITY_PLACEMENT),
  );
  assert.deepEqual(
    missing,
    [],
    `add these to CITY_PLACEMENT or they will be missing from the map: ${missing.join(', ')}`,
  );
});

test('every place on the map is a city on the schedule', () => {
  const cities = new Set(onMap.map((event) => event.city));
  const stale = placedCities.filter((city) => !cities.has(city));
  assert.deepEqual(
    stale,
    [],
    `these have coordinates but no stop left to draw: ${stale.join(', ')}`,
  );
});
