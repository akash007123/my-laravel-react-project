import { Country } from 'country-state-city';
import { DateTime } from 'luxon';


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
    </div>
  );
}


function extractYMD(s: string): { y: number; m: number; d: number } | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

function extractHM(s: string): { H: number; M: number } | null {
  if (!s) return null;
  const m = s.match(/(\d{2}):(\d{2})/);
  if (!m) return null;
  return { H: Number(m[1]), M: Number(m[2]) };
}

function formatAMPM(H: number, M: number): string {
  const hours12 = ((H + 11) % 12) + 1;
  const minutes = String(M).padStart(2, '0');
  const ampm = H >= 12 ? 'PM' : 'AM';
  return `${hours12}:${minutes} ${ampm}`;
}

export function hoursToHHMM(hours?: number | string) {
  if (typeof hours === 'string') {
    const m = hours.match(/^(\d{1,3}):(\d{2})(?::\d{2})?$/);
    if (m) {
      const H = Number(m[1]);
      const M = Number(m[2]);
      return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
    }
  }
  const value = typeof hours === 'string' ? Number(hours) : hours;
  const totalMinutes = Math.max(0, Math.round(Number(value || 0) * 60));
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function formatDateTime(dateString: string) {
  const ymd = extractYMD(dateString);
  const hm = extractHM(dateString);
  if (!ymd || !hm) return '-';
  const d = new Date(ymd.y, ymd.m - 1, ymd.d, hm.H, hm.M);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateString: string) {
  const ymd = extractYMD(dateString);
  const hm = extractHM(dateString);
  if (!ymd) return '-';
  if (!hm) {
    const d = new Date(ymd.y, ymd.m - 1, ymd.d);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return `${new Date(ymd.y, ymd.m - 1, ymd.d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} ${formatAMPM(hm.H, hm.M)}`;
}

export function formatTime(dateString: string) {
  const hm = extractHM(dateString);
  if (!hm) return '-';
  return formatAMPM(hm.H, hm.M);
}

export function formatDateOnly(dateString: string) {
  const ymd = extractYMD(dateString);
  if (!ymd) return '-';
  const d = new Date(ymd.y, ymd.m - 1, ymd.d);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateWithWeekday(dateString: string) {
  const ymd = extractYMD(dateString);
  if (!ymd) return '-';
  const d = new Date(ymd.y, ymd.m - 1, ymd.d);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTimeDay(dateString: string) {
  const ymd = extractYMD(dateString);
  const hm = extractHM(dateString);
  if (!ymd || !hm) return '-';
  const isoDateString = `${ymd.y}-${String(ymd.m).padStart(2, '0')}-${String(ymd.d).padStart(2, '0')}T${String(hm.H).padStart(2, '0')}:${String(hm.M).padStart(2, '0')}:00.000Z`;
  const dt = DateTime.fromISO(isoDateString, { zone: 'UTC' }).setZone('Asia/Kolkata');
  return dt.toFormat('cccc, dd MMM yyyy, hh:mm a');  
}



export function formatMinute(value: string | number) {
  if (typeof value === 'number') return String(Math.max(0, Math.round(value)));
  if (!value) return '-';
  const num = Number(value);
  if (!Number.isNaN(num)) return String(Math.max(0, Math.round(num)));
  const hm = extractHM(value);
  if (!hm) return '-';
  return String(hm.M).padStart(2, '0');
}