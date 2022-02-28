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

export function milisecondsToReadableTime(ms: number): string {
  let milliseconds: number | string = Math.floor((ms % 1000) / 100),
    seconds: number | string = Math.floor((ms / 1000) % 60),
    minutes: number | string = Math.floor((ms / (1000 * 60)) % 60),
    hours: number | string = Math.floor((ms / (1000 * 60 * 60)) % 24);
  milliseconds = Math.floor(ms % 1000);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  if (milliseconds < 100) {
    if (milliseconds < 10) {
      milliseconds = "00" + milliseconds;
    } else {
      milliseconds = "0" + milliseconds;
    }
  }
  return hours + ":" + minutes + ":" + seconds + "," + milliseconds;
}

//export function is24Hours(date: Date): boolean {}
