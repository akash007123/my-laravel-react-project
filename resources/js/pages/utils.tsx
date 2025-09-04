import { Country } from 'country-state-city';
console.log(Country.getAllCountries())


//For Coutry with flag
export function renderFlag(countryName?: string | null) {
  if (!countryName) return null;

  const match = Country.getAllCountries().find(c => c.name === countryName);
  if (!match) return null;

  return (
    <div className="flex items-center space-x-2">
      <img
        src={`https://flagcdn.com/24x18/${match.isoCode.toLowerCase()}.png`}
        alt={`Flag of ${match.name}`}
        width={18}
        height={14}
        className="rounded-sm"
      />
      <span>+{match.phonecode}</span>
      {/* <span>+{match.currency}</span>
      <span>+{match.isoCode}</span> */}
    </div>
  );
}



export function formatDateTime(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? '-'
    : d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
}

export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? '-' : d.toLocaleString('en-US', { hour12: true });
}


export function formatTime(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? '-'
    : d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
}


export function formatDateOnly(dateString: string) {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  }

  export function formatDateWithWeekday(dateString: string) {
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  }