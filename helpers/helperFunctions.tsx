export function capitalize(word: string): string {
  if (word === undefined || word.length === 0) return word;

  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
