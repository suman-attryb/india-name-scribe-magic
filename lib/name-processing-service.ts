import { INDIAN_FIRST_NAMES, INDIAN_LAST_NAMES, HONORIFICS, findClosestMatch } from "./indian-names-dictionary"

export interface NameProcessingResult {
  originalFirstName: string
  originalLastName: string
  extractedHonorific: string
  processedFirstName: string
  processedLastName: string
  firstNameCorrected: boolean
  lastNameCorrected: boolean
  confidence: "high" | "medium" | "low"
  firstNameSimilarity?: number
  lastNameSimilarity?: number
}

export interface CSVRow {
  "First Name": string
  "Last Name": string
  Gender: string
  Email: string
  "Date of Birth": string
}

export interface ProcessedCSVRow extends CSVRow {
  Honorific: string
  "Original First Name": string
  "Original Last Name": string
  "Corrected First Name": string
  "Corrected Last Name": string
  "First Name Corrected": string
  "Last Name Corrected": string
  "First Name Similarity": string
  "Last Name Similarity": string
  Confidence: string
}

export class NameProcessingService {
  private extractHonorific(name: string): { honorific: string; cleanName: string } {
    const trimmedName = name.trim()

    for (const honorific of HONORIFICS) {
      const honorificPattern = new RegExp(`^${honorific.replace(".", "\\.")}\\s+`, "i")
      if (honorificPattern.test(trimmedName)) {
        return {
          honorific: honorific,
          cleanName: trimmedName.replace(honorificPattern, "").trim(),
        }
      }
    }
    return { honorific: "", cleanName: trimmedName }
  }

  private processNameComponent(name: string, isFirstName: boolean) {
    if (!name || name.trim().length === 0) {
      return {
        corrected: "",
        wasCorrected: false,
        confidence: "high" as const,
        similarityScore: 1.0,
        originalInput: name,
      }
    }

    const cleanName = name.trim()
    const dictionary = isFirstName ? INDIAN_FIRST_NAMES : INDIAN_LAST_NAMES

    if (dictionary.has(cleanName)) {
      return {
        corrected: cleanName,
        wasCorrected: false,
        confidence: "high" as const,
        similarityScore: 1.0,
        originalInput: name,
      }
    }

    let result = findClosestMatch(cleanName, dictionary, 0.85)
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "high" as const,
        similarityScore: result.score,
        originalInput: name,
      }
    }

    result = findClosestMatch(cleanName, dictionary, 0.75)
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "medium" as const,
        similarityScore: result.score,
        originalInput: name,
      }
    }

    result = findClosestMatch(cleanName, dictionary, 0.65)
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "low" as const,
        similarityScore: result.score,
        originalInput: name,
      }
    }

    return {
      corrected: cleanName,
      wasCorrected: false,
      confidence: "low" as const,
      similarityScore: 0,
      originalInput: name,
    }
  }

  public processName(firstName: string, lastName: string): NameProcessingResult {
    const firstNameResult = this.extractHonorific(firstName)
    const lastNameResult = this.extractHonorific(lastName)

    let extractedHonorific = ""
    let cleanFirstName = firstName
    let cleanLastName = lastName

    if (firstNameResult.honorific) {
      extractedHonorific = firstNameResult.honorific
      cleanFirstName = firstNameResult.cleanName
    } else if (lastNameResult.honorific) {
      extractedHonorific = lastNameResult.honorific
      cleanLastName = lastNameResult.cleanName
    }

    const processedFirst = this.processNameComponent(cleanFirstName, true)
    const processedLast = this.processNameComponent(cleanLastName, false)

    const overallConfidence =
      processedFirst.confidence === "low" || processedLast.confidence === "low"
        ? "low"
        : processedFirst.confidence === "medium" || processedLast.confidence === "medium"
          ? "medium"
          : "high"

    return {
      originalFirstName: firstName,
      originalLastName: lastName,
      extractedHonorific,
      processedFirstName: processedFirst.corrected,
      processedLastName: processedLast.corrected,
      firstNameCorrected: processedFirst.wasCorrected,
      lastNameCorrected: processedLast.wasCorrected,
      confidence: overallConfidence,
      firstNameSimilarity: processedFirst.similarityScore,
      lastNameSimilarity: processedLast.similarityScore,
    }
  }

  public processCSVData(csvData: CSVRow[]): ProcessedCSVRow[] {
    return csvData.map((row) => {
      const result = this.processName(row["First Name"], row["Last Name"])

      return {
        ...row,
        Honorific: result.extractedHonorific,
        "Original First Name": result.originalFirstName,
        "Original Last Name": result.originalLastName,
        "Corrected First Name": result.processedFirstName,
        "Corrected Last Name": result.processedLastName,
        "First Name Corrected": result.firstNameCorrected ? "Yes" : "No",
        "Last Name Corrected": result.lastNameCorrected ? "Yes" : "No",
        "First Name Similarity": result.firstNameSimilarity
          ? (result.firstNameSimilarity * 100).toFixed(1) + "%"
          : "100%",
        "Last Name Similarity": result.lastNameSimilarity ? (result.lastNameSimilarity * 100).toFixed(1) + "%" : "100%",
        Confidence: result.confidence,
        "First Name": result.processedFirstName,
        "Last Name": result.processedLastName,
      }
    })
  }
}
