// utils.ts (or wherever you define this)

import { Country } from 'country-state-city';

export function renderFlag(countryName?: string | null) {
  if (!countryName) return null;

  const match = Country.getAllCountries().find(c => c.name === countryName);
  if (!match) return null;

  return (
    <img
      src={`https://flagcdn.com/24x18/${match.isoCode.toLowerCase()}.png`}
      alt="flag"
      width={18}
      height={14}
      className="rounded-sm"
    />
  );
}

export function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
