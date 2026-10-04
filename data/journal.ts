export type JournalEntry = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  alt: string;
  excerpt: string;
};

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: 'layering-for-the-first-frost',
    title: 'LAYERING FOR THE FIRST FROST',
    date: '2026-09-28',
    readTime: '4 MIN',
    category: 'FIELD NOTES',
    image: '/images/editorial/journal-01.jpg',
    alt: 'Fog settling over a mountain lake below a snow range',
    excerpt:
      'The first cold morning of the season changes how you dress for a whole day. Three layers, one rule: keep the insulation light enough to move in, and keep the shell close enough to reach before the rain starts.',
  },
  {
    slug: 'a-long-weekend-above-the-trees',
    title: 'A LONG WEEKEND ABOVE THE TREES',
    date: '2026-09-12',
    readTime: '6 MIN',
    category: 'ROUTE',
    image: '/images/editorial/journal-02.jpg',
    alt: 'Sunrise light over a still alpine lake',
    excerpt:
      'Two nights, one pass, and a pack that never left the frame of the trail. A walkthrough of the kit we carry when the route is long, the weather is uncertain, and turning back is not part of the plan.',
  },
  {
    slug: 'cold-hands-warm-mornings',
    title: 'COLD HANDS, WARM MORNINGS',
    date: '2026-08-24',
    readTime: '5 MIN',
    category: 'GEAR',
    image: '/images/editorial/journal-03.jpg',
    alt: 'Snow covered trees along a winter forest trail',
    excerpt:
      'Gloves, poles, and the small decisions that decide whether a winter trail stays memorable or merely survivable. What we learned from three seasons of testing in cold, wet forests.',
  },
];
