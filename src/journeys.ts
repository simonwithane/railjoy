export type Journey = {
  id: string;
  from: string;
  to: string;
  country: string;
  title: string;
  description: string;
  duration: number;
  changes: number;
  theme: 'City escapes' | 'Into nature' | 'Slow adventures';
  scene: 'alps' | 'city' | 'coast' | 'forest' | 'hills' | 'night';
};
// Editorial demo fixtures. These are not live timetables, fares, or bookable itineraries.
export const journeys: Journey[] = [
  {
    id: 'alpine',
    from: 'Zurich',
    to: 'Chur',
    country: 'Switzerland',
    title: 'Take the scenic route.',
    description:
      'Mountain silhouettes, quiet valleys, and a window seat worth lingering in.',
    duration: 80,
    changes: 0,
    theme: 'Into nature',
    scene: 'alps',
  },
  {
    id: 'paris',
    from: 'Amsterdam',
    to: 'Paris',
    country: 'France',
    title: 'A little joie de vivre.',
    description:
      'Trade familiar canals for café terraces and a weekend without a checklist.',
    duration: 200,
    changes: 0,
    theme: 'City escapes',
    scene: 'city',
  },
  {
    id: 'riviera',
    from: 'Nice',
    to: 'Menton',
    country: 'France',
    title: 'Follow the blue.',
    description:
      'A leisurely escape along the coast, with time to stop and watch the sea.',
    duration: 40,
    changes: 0,
    theme: 'Slow adventures',
    scene: 'coast',
  },
  {
    id: 'forest',
    from: 'Berlin',
    to: 'Dresden',
    country: 'Germany',
    title: 'A change of scenery.',
    description:
      'Green horizons give way to riverside walks and a city full of stories.',
    duration: 130,
    changes: 0,
    theme: 'City escapes',
    scene: 'forest',
  },
  {
    id: 'hills',
    from: 'Edinburgh',
    to: 'Inverness',
    country: 'Scotland',
    title: 'Let the world slow down.',
    description:
      'Head north for wide skies, rolling hills, and room to breathe.',
    duration: 215,
    changes: 0,
    theme: 'Into nature',
    scene: 'hills',
  },
  {
    id: 'night',
    from: 'Vienna',
    to: 'Venice',
    country: 'Italy',
    title: 'Wake up somewhere new.',
    description:
      'Imagine an overnight adventure ending with your first glimpse of the lagoon.',
    duration: 660,
    changes: 0,
    theme: 'Slow adventures',
    scene: 'night',
  },
];
export const themes = [
  'All journeys',
  'City escapes',
  'Into nature',
  'Slow adventures',
] as const;
export function filterJourneys(items: Journey[], query: string, theme: string) {
  const q = query.trim().toLocaleLowerCase();
  return items.filter(
    (j) =>
      (theme === 'All journeys' || j.theme === theme) &&
      `${j.from} ${j.to} ${j.country}`.toLocaleLowerCase().includes(q),
  );
}
export function durationLabel(minutes: number) {
  return `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}h ` : ''}${minutes % 60 ? `${minutes % 60}m` : ''}`.trim();
}
export function parseSaved(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed)
      ? [
          ...new Set(
            parsed.filter(
              (id): id is string =>
                typeof id === 'string' && journeys.some((j) => j.id === id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
