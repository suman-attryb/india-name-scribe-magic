import { NameData } from '@/types/name-processing';
import { extractHonorific, checkSpelling, capitalizeFirstLetter } from '@/utils/name-processing';

export const processCSV = (csvText: string): NameData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const firstNameIndex = headers.findIndex(h => h.includes('first') || h.includes('fname'));
  const lastNameIndex = headers.findIndex(h => h.includes('last') || h.includes('lname') || h.includes('surname'));
  
  if (firstNameIndex === -1 || lastNameIndex === -1) {
    throw new Error('CSV must contain first name and last name columns');
  }

  const processedData: NameData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
    const firstName = row[firstNameIndex] || '';
    const lastName = row[lastNameIndex] || '';
    
    // Extract honorifics
    const firstNameResult = extractHonorific(firstName);
    const lastNameResult = extractHonorific(lastName);
    
    // Determine primary honorific (usually from first name)
    const primaryHonorific = firstNameResult.honorific || lastNameResult.honorific;
    
    // Clean names
    const cleanFirstName = firstNameResult.cleanName;
    const cleanLastName = lastNameResult.honorific ? lastNameResult.cleanName : capitalizeFirstLetter(lastName);
    
    // Spell check
    const firstNameSpellCheck = checkSpelling(cleanFirstName, 'first');
    const lastNameSpellCheck = checkSpelling(cleanLastName, 'last');
    
    processedData.push({
      originalFirstName: firstName,
      originalLastName: lastName,
      honorific: primaryHonorific,
      cleanFirstName,
      cleanLastName,
      firstNameSpellCheck,
      lastNameSpellCheck
    });
  }
  
  return processedData;
};

export const exportToCSV = (csvData: NameData[]): void => {
  if (csvData.length === 0) return;
  
  const headers = [
    'Original First Name',
    'Original Last Name',
    'Honorific',
    'Clean First Name',
    'Clean Last Name',
    'First Name Spell Check',
    'First Name Suggestions',
    'Last Name Spell Check',
    'Last Name Suggestions'
  ];
  
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => [
      `"${row.originalFirstName}"`,
      `"${row.originalLastName}"`,
      `"${row.honorific}"`,
      `"${row.cleanFirstName}"`,
      `"${row.cleanLastName}"`,
      row.firstNameSpellCheck.isCorrect ? 'Correct' : 'Needs Review',
      `"${row.firstNameSpellCheck.suggestions.join('; ')}"`,
      row.lastNameSpellCheck.isCorrect ? 'Correct' : 'Needs Review',
      `"${row.lastNameSpellCheck.suggestions.join('; ')}"`,
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'processed_names.csv';
  link.click();
  URL.revokeObjectURL(url);
};