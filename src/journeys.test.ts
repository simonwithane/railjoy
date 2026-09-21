import { describe, expect, it } from 'vitest';
import {
  durationLabel,
  filterJourneys,
  journeys,
  parseSaved,
} from './journeys';
describe('journey discovery', () => {
  it('matches origin, destination and country without case or whitespace sensitivity', () => {
    for (const term of [' AMSTERDAM ', 'paris', 'FRANCE'])
      expect(
        filterJourneys(journeys, term, 'All journeys').some(
          (j) => j.id === 'paris',
        ),
      ).toBe(true);
  });
  it('combines search and category and handles no results', () => {
    expect(filterJourneys(journeys, 'Paris', 'Into nature')).toEqual([]);
    expect(filterJourneys(journeys, '', 'Into nature')).toHaveLength(2);
    expect(filterJourneys(journeys, 'not a city', 'All journeys')).toEqual([]);
  });
  it('formats short, exact-hour and long journey durations', () => {
    expect(durationLabel(40)).toBe('40m');
    expect(durationLabel(120)).toBe('2h');
    expect(durationLabel(215)).toBe('3h 35m');
  });
});
describe('saved journeys', () => {
  it('recovers from missing, corrupt and invalid storage', () => {
    for (const raw of [null, 'broken', '{}', 'null', '42'])
      expect(parseSaved(raw)).toEqual([]);
  });
  it('deduplicates and rejects unknown identifiers and non-string values', () => {
    expect(parseSaved('["paris","paris","missing",7,null,"alpine"]')).toEqual([
      'paris',
      'alpine',
    ]);
  });
});
