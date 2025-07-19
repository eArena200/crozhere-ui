

export function getUTCDateTimeWithStepMins(
    step: number,
    delayHr?: number
): string {
    const now = new Date();
    let delayed: Date;
    if(delayHr !== undefined){
        delayed = new Date(now.getTime() + delayHr * 60 * 60 * 1000);
    } else {
        delayed = new Date(now.getTime())
    }

    const minutes = delayed.getMinutes();
    const remainder = minutes % step;
    if (remainder !== 0) {
        const extra = step - remainder;
        delayed.setMinutes(minutes + extra);
    }
    delayed.setSeconds(0);
    delayed.setMilliseconds(0);
    return delayed.toISOString();
}

export function utcToLocalISOString(utcTime: string): string {
  const date = new Date(utcTime);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString();
}

export function localToUTCISOString(localTime: string): string {
  const date = new Date(localTime);
  return date.toISOString();
}

export function toReadableDateTime(iso: string, use12Hour: boolean = false): string {
  const formatted = new Date(iso).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: use12Hour,
  });

  return formatted.replace(/\b(am|pm)\b/, (match) => match.toUpperCase());
}
