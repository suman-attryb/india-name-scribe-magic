import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NameData } from '@/types/name-processing';
import { processCSV, exportToCSV } from '@/utils/csv-processing';

export default function NameProcessingService() {
  const [csvData, setCsvData] = useState<NameData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const processedData = processCSV(csvText);
        setCsvData(processedData);
        toast({
          title: "Success",
          description: "CSV file processed successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to process CSV file",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    exportToCSV(csvData);
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
                <Button onClick={handleExportCSV} variant="outline">
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