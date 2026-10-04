const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats 1899000 as "Rp 1.899.000". */
export const formatIDR = (value: number): string =>
  idrFormatter.format(value).replace(/\u00a0/g, ' ');

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-US').format(value);

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));

export const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export const formatRating = (rating: number): string => rating.toFixed(1);
