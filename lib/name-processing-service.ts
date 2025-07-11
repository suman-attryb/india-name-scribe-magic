import { INDIAN_FIRST_NAMES, INDIAN_LAST_NAMES, HONORIFICS, findClosestMatch } from "./indian-names-dictionary"

// Update the NameProcessingResult interface to include similarity information
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

// Update the ProcessedCSVRow interface
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

export interface CSVRow {
  "First Name": string
  "Last Name": string
  Gender: string
  Email: string
  "Date of Birth": string
}

export class NameProcessingService {
  // Extract honorifics from a name string
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

  // Process individual name components with improved similarity matching
  private processNameComponent(
    name: string,
    isFirstName: boolean,
  ): {
    corrected: string
    wasCorrected: boolean
    confidence: "high" | "medium" | "low"
    similarityScore?: number
    originalInput: string
  } {
    if (!name || name.trim().length === 0) {
      return {
        corrected: "",
        wasCorrected: false,
        confidence: "high",
        originalInput: name,
      }
    }

    const cleanName = name.trim()
    const dictionary = isFirstName ? INDIAN_FIRST_NAMES : INDIAN_LAST_NAMES

    // Check if name exists exactly in dictionary (case sensitive)
    if (dictionary.has(cleanName)) {
      return {
        corrected: cleanName,
        wasCorrected: false,
        confidence: "high",
        similarityScore: 1.0,
        originalInput: name,
      }
    }

    // Use improved similarity matching with different thresholds
    let result = findClosestMatch(cleanName, dictionary, 0.85) // High similarity threshold
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "high",
        similarityScore: result.score,
        originalInput: name,
      }
    }

    result = findClosestMatch(cleanName, dictionary, 0.75) // Medium similarity threshold
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "medium",
        similarityScore: result.score,
        originalInput: name,
      }
    }

    result = findClosestMatch(cleanName, dictionary, 0.65) // Lower similarity threshold
    if (result) {
      return {
        corrected: result.match,
        wasCorrected: true,
        confidence: "low",
        similarityScore: result.score,
        originalInput: name,
      }
    }

    // No suitable match found, return original
    return {
      corrected: cleanName,
      wasCorrected: false,
      confidence: "low",
      similarityScore: 0,
      originalInput: name,
    }
  }

  // Main processing function for a single name entry
  public processName(firstName: string, lastName: string): NameProcessingResult {
    // Extract honorifics from first name (most common location)
    const firstNameResult = this.extractHonorific(firstName)
    const lastNameResult = this.extractHonorific(lastName)

    // Determine which field had the honorific
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

    // Process the cleaned names
    const processedFirst = this.processNameComponent(cleanFirstName, true)
    const processedLast = this.processNameComponent(cleanLastName, false)

    // Determine overall confidence
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

  // Process entire CSV data
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
        // Update the original fields with corrected values
        "First Name": result.processedFirstName,
        "Last Name": result.processedLastName,
      }
    })
  }
}
