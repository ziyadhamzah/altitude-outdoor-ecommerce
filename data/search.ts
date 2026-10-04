/**
 * Merchandising synonyms used by catalog search. Products are found by name,
 * category, description, material, specifications and these keywords.
 */
export const SEARCH_KEYWORDS: Record<string, readonly string[]> = {
  'summit-shell-jacket': ['jacket', 'shell', 'hardshell', 'waterproof', 'rain', '3-layer', 'hiking'],
  'alpine-windbreaker': ['jacket', 'windbreaker', 'shell', 'wind', 'packable', 'rain', 'hiking'],
  'trail-utility-pants': ['pants', 'trousers', 'stretch', 'hiking', 'trekking'],
  'ridge-fleece': ['fleece', 'midlayer', 'mid-layer', 'jacket', 'warm', 'insulated'],
  'expedition-backpack-30l': ['backpack', 'pack', 'rucksack', '30l', 'hiking', 'trekking'],
  'trail-daypack-18l': ['backpack', 'daypack', 'pack', '18l', 'hiking'],
  'summit-waist-pack': ['waist pack', 'belt pack', 'fanny pack', 'lumbar', 'pack', 'hiking'],
  'terra-hiking-shoes': ['shoes', 'boots', 'footwear', 'hiking', 'trail'],
  'ridge-trail-shoes': ['shoes', 'trail runners', 'footwear', 'hiking', 'lightweight'],
  'summit-bottle': ['bottle', 'flask', 'hydration', 'water bottle', 'thermos'],
  'trail-cap': ['cap', 'hat', 'sun', 'headwear'],
  'expedition-headlamp': ['headlamp', 'lamp', 'light', 'torch', 'headtorch'],
  'trekking-pole': ['poles', 'trekking poles', 'hiking poles', 'walking stick', 'alpenstock'],
  'outdoor-utility-pouch': ['pouch', 'organizer', 'utility', 'bag', 'storage'],
};