import type { CSVRow, ProcessedCSVRow } from "./name-processing-service"

export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const requiredHeaders = ["First Name", "Last Name", "Gender", "Email", "Date of Birth"]

  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      throw new Error(`Missing required column: ${required}`)
    }
  }

  const data: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) {
      console.warn(`Row ${i + 1} has ${values.length} values but expected ${headers.length}`)
      continue
    }

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })

    data.push(row as CSVRow)
  }

  return data
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

export function generateCSV(data: ProcessedCSVRow[]): string {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...data.map((row) => headers.map((header) => `"${row[header as keyof ProcessedCSVRow] || ""}"`).join(",")),
  ].join("\n")

  return csvContent
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
