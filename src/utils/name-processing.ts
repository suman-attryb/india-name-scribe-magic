import { HONORIFICS, INDIAN_NAME_PATTERNS } from '@/constants/name-processing';
import { HonorificResult, SpellCheckResult } from '@/types/name-processing';

export const capitalizeFirstLetter = (name: string): string => {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const extractHonorific = (name: string): HonorificResult => {
  const nameLower = name.toLowerCase().trim();
  
  for (const honorific of HONORIFICS) {
    const patterns = [
      new RegExp(`^${honorific}\\.?\\s+(.+)`, 'i'),
      new RegExp(`^${honorific}\\s+(.+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = nameLower.match(pattern);
      if (match) {
        return {
          honorific: honorific.charAt(0).toUpperCase() + honorific.slice(1),
          cleanName: capitalizeFirstLetter(match[1].trim())
        };
      }
    }
  }
  
  return { honorific: '', cleanName: capitalizeFirstLetter(name.trim()) };
};

export const checkSpelling = (name: string, nameType: 'first' | 'last'): SpellCheckResult => {
  if (!name) return { isCorrect: true, suggestions: [] };
  
  const nameLower = name.toLowerCase();
  const dictionary = nameType === 'first' ? INDIAN_NAME_PATTERNS.firstNames : INDIAN_NAME_PATTERNS.lastNames;
  
  // Exact match
  if (dictionary.includes(nameLower)) {
    return { isCorrect: true, suggestions: [] };
  }
  
  // Find similar names using basic string similarity
  const suggestions = dictionary
    .filter(dictName => {
      // Simple similarity check: Levenshtein distance or starts with
      return dictName.startsWith(nameLower.slice(0, 2)) || 
             nameLower.startsWith(dictName.slice(0, 2)) ||
             calculateSimilarity(nameLower, dictName) > 0.6;
    })
    .slice(0, 3);
  
  return {
    isCorrect: suggestions.length === 0,
    suggestions: suggestions
  };
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

export const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};