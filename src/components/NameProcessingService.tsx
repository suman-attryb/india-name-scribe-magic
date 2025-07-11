import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NameData {
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

// Common honorifics including Indian variations
const HONORIFICS = [
  'mr', 'mrs', 'mrrs', 'ms', 'miss', 'dr', 'prof', 'professor',
  'sri', 'shri', 'smt', 'kumari', 'pandit', 'ustad'
];

// Common Indian name patterns for basic spell checking
const INDIAN_NAME_PATTERNS = {
  firstNames: [
    'raj', 'kumar', 'singh', 'dev', 'krishna', 'ram', 'shyam', 'arjun', 'vikram', 'rohit',
    'amit', 'sunil', 'anil', 'ravi', 'priya', 'neha', 'pooja', 'anjali', 'deepika', 'kavya',
    'aarav', 'vivaan', 'aditya', 'vihaan', 'arjun', 'sai', 'reyansh', 'ayaan', 'krishna',
    'ishaan', 'shaurya', 'atharv', 'aadhya', 'sara', 'ananya', 'anika', 'ira', 'myra'
  ],
  lastNames: [
    'sharma', 'verma', 'gupta', 'singh', 'kumar', 'agarwal', 'agrawal', 'jain', 'bansal',
    'mittal', 'jindal', 'goel', 'arora', 'malhotra', 'kapoor', 'chopra', 'sethi', 'bhatia',
    'mehta', 'shah', 'patel', 'desai', 'modi', 'gandhi', 'nehru', 'reddy', 'rao', 'nair',
    'menon', 'iyer', 'krishnan', 'raman', 'bose', 'chatterjee', 'mukherjee', 'banerjee'
  ]
};

export default function NameProcessingService() {
  const [csvData, setCsvData] = useState<NameData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractHonorific = (name: string): { honorific: string; cleanName: string } => {
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
            cleanName: match[1].trim()
          };
        }
      }
    }
    
    return { honorific: '', cleanName: name.trim() };
  };

  const checkSpelling = (name: string, nameType: 'first' | 'last') => {
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

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
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

  const processCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const firstNameIndex = headers.findIndex(h => h.includes('first') || h.includes('fname'));
    const lastNameIndex = headers.findIndex(h => h.includes('last') || h.includes('lname') || h.includes('surname'));
    
    if (firstNameIndex === -1 || lastNameIndex === -1) {
      toast({
        title: "Error",
        description: "CSV must contain first name and last name columns",
        variant: "destructive"
      });
      return;
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
      const cleanLastName = lastNameResult.honorific ? lastNameResult.cleanName : lastName;
      
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
    
    setCsvData(processedData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      processCSV(csvText);
      setIsProcessing(false);
      toast({
        title: "Success",
        description: "CSV file processed successfully"
      });
    };
    
    reader.readAsText(file);
  };

  const exportToCSV = () => {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Indian Name Processing Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button asChild className="cursor-pointer">
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV File
                </span>
              </Button>
            </label>
          </div>
          
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Processing names...</p>
            </div>
          )}
          
          {csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  Processed {csvData.length} names
                </p>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Processed CSV
                </Button>
              </div>
              
              <div className="rounded-md border max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original Name</TableHead>
                      <TableHead>Honorific</TableHead>
                      <TableHead>Clean Name</TableHead>
                      <TableHead>Spell Check Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{row.originalFirstName}</div>
                            <div className="text-sm text-muted-foreground">{row.originalLastName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.honorific && (
                            <Badge variant="secondary">{row.honorific}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{row.cleanFirstName}</div>
                            <div className="text-sm text-muted-foreground">{row.cleanLastName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {row.firstNameSpellCheck.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="text-sm">First: {row.firstNameSpellCheck.isCorrect ? 'OK' : 'Review'}</span>
                            </div>
                            {row.firstNameSpellCheck.suggestions.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Suggestions: {row.firstNameSpellCheck.suggestions.join(', ')}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {row.lastNameSpellCheck.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="text-sm">Last: {row.lastNameSpellCheck.isCorrect ? 'OK' : 'Review'}</span>
                            </div>
                            {row.lastNameSpellCheck.suggestions.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Suggestions: {row.lastNameSpellCheck.suggestions.join(', ')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}