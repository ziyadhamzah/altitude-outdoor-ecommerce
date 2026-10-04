export type ClassValue = string | false | null | undefined;

/** Tiny class name joiner, keeps conditional Tailwind classes readable. */
export const cn = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
