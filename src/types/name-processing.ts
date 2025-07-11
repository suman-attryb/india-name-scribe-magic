export interface NameData {
  originalFirstName: string;
  originalLastName: string;
  honorific: string;
  cleanFirstName: string;
  cleanLastName: string;
  firstNameSpellCheck: {
    isCorrect: boolean;
    suggestions: string[];
  };
  lastNameSpellCheck: {
    isCorrect: boolean;
    suggestions: string[];
  };
}

export interface SpellCheckResult {
  isCorrect: boolean;
  suggestions: string[];
}

export interface HonorificResult {
  honorific: string;
  cleanName: string;
}