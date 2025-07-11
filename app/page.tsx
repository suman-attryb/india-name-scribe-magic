"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { NameProcessingService, type ProcessedCSVRow } from "@/lib/name-processing-service"
import { parseCSV, generateCSV, downloadCSV } from "@/lib/csv-utils"

export default function NameCleanupService() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ProcessedCSVRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    total: number
    honorificsExtracted: number
    firstNamesCorrected: number
    lastNamesCorrected: number
    highConfidence: number
    mediumConfidence: number
    lowConfidence: number
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
      setResults(null)
      setStats(null)
    } else {
      setError("Please select a valid CSV file")
    }
  }

  const processFile = async () => {
    if (!file) return

    setProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const content = await file.text()
      setProgress(20)

      const csvData = parseCSV(content)
      setProgress(40)

      const nameProcessor = new NameProcessingService()
      const processedData = nameProcessor.processCSVData(csvData)
      setProgress(80)

      const statistics = {
        total: processedData.length,
        honorificsExtracted: processedData.filter((row) => row.Honorific).length,
        firstNamesCorrected: processedData.filter((row) => row["First Name Corrected"] === "Yes").length,
        lastNamesCorrected: processedData.filter((row) => row["Last Name Corrected"] === "Yes").length,
        highConfidence: processedData.filter((row) => row.Confidence === "high").length,
        mediumConfidence: processedData.filter((row) => row.Confidence === "medium").length,
        lowConfidence: processedData.filter((row) => row.Confidence === "low").length,
      }

      setResults(processedData)
      setStats(statistics)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing the file")
    } finally {
      setProcessing(false)
    }
  }

  const downloadResults = () => {
    if (!results) return
    const csvContent = generateCSV(results)
    const timestamp = new Date().toISOString().split("T")[0]
    downloadCSV(csvContent, `cleaned_names_${timestamp}.csv`)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Indian Name Cleanup Service</h1>
          <p className="text-muted-foreground mt-2">
            Extract honorifics and correct spelling in Indian names from CSV files
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Upload a CSV file with columns: First Name, Last Name, Gender, Email, Date of Birth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={processFile} disabled={!file || processing} className="w-full">
              {processing ? "Processing..." : "Process Names"}
            </Button>

            {processing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">Processing... {progress}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Processing Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.honorificsExtracted}</div>
                  <div className="text-sm text-muted-foreground">Honorifics Extracted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.firstNamesCorrected}</div>
                  <div className="text-sm text-muted-foreground">First Names Corrected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.lastNamesCorrected}</div>
                  <div className="text-sm text-muted-foreground">Last Names Corrected</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-center">
                <Badge variant="default">{stats.highConfidence} High Confidence</Badge>
                <Badge variant="secondary">{stats.mediumConfidence} Medium Confidence</Badge>
                <Badge variant="outline">{stats.lowConfidence} Low Confidence</Badge>
              </div>

              <Button onClick={downloadResults} className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download Cleaned CSV
              </Button>
            </CardContent>
          </Card>
        )}

        {results && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview (First 5 Records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Original First</th>
                      <th className="text-left p-2">Original Last</th>
                      <th className="text-left p-2">Honorific</th>
                      <th className="text-left p-2">Corrected First</th>
                      <th className="text-left p-2">Corrected Last</th>
                      <th className="text-left p-2">Similarity</th>
                      <th className="text-left p-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{row["Original First Name"]}</td>
                        <td className="p-2">{row["Original Last Name"]}</td>
                        <td className="p-2">{row.Honorific || "-"}</td>
                        <td className="p-2">
                          {row["First Name Corrected"] === "Yes" ? (
                            <span className="text-green-600 font-medium">{row["Corrected First Name"]}</span>
                          ) : (
                            row["Corrected First Name"]
                          )}
                        </td>
                        <td className="p-2">
                          {row["Last Name Corrected"] === "Yes" ? (
                            <span className="text-green-600 font-medium">{row["Corrected Last Name"]}</span>
                          ) : (
                            row["Corrected Last Name"]
                          )}
                        </td>
                        <td className="p-2 text-xs">
                          <div>F: {row["First Name Similarity"]}</div>
                          <div>L: {row["Last Name Similarity"]}</div>
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              row.Confidence === "high"
                                ? "default"
                                : row.Confidence === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {row.Confidence}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
