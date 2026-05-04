export function shuffle<T>(array: T[]): T[] {
  // Create a copy if you want to avoid mutating the original array
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements result[i] and result[j]
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}