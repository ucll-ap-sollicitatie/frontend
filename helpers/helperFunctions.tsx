export function capitalize(word: string): string {
  if (word === undefined || word.length === 0) return word;

  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " jaar geleden";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " maand geleden";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " dagen geleden";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " uur geleden";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minuten geleden";
  }
  return Math.floor(seconds) + " seconden geleden";
}

export function is24Hours(date: Date): boolean {}
