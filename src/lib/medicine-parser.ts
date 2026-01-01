/**
 * Medicine Parser Utility
 * Parses OCR text to extract medicine names from prescriptions
 */

export interface ParsedMedicine {
  name: string
  dosage?: string
  form?: string
  quantity?: string
  frequency?: string
  rawText: string
}

// Common medicine forms
const MEDICINE_FORMS = [
  'tablet', 'tablets', 'tab', 'tabs',
  'capsule', 'capsules', 'cap', 'caps',
  'syrup', 'suspension', 'liquid',
  'injection', 'inj',
  'cream', 'ointment', 'gel', 'lotion',
  'drops', 'drop',
  'inhaler', 'spray',
  'powder', 'sachet',
]

// Common dosage patterns
const DOSAGE_PATTERNS = [
  /(\d+\.?\d*)\s*(mg|mcg|g|ml|iu|u)/gi,
  /(\d+)\s*%/gi,
]

// Frequency patterns
const FREQUENCY_PATTERNS = [
  /(\d+)\s*x\s*(\d+)/gi, // 1x2, 2x3
  /(once|twice|thrice)\s*(daily|a day)/gi,
  /(od|bd|tds|qid|hs|sos|prn|stat)/gi,
  /(\d+)\s*times?\s*(a|per)?\s*day/gi,
  /(morning|evening|night|bedtime)/gi,
  /(before|after)\s*(food|meal|breakfast|lunch|dinner)/gi,
]

// Common medicine name patterns (Indian brands)
const MEDICINE_KEYWORDS = [
  // Pain/Fever
  'paracetamol', 'dolo', 'crocin', 'calpol', 'metacin',
  'ibuprofen', 'brufen', 'combiflam', 'disprin', 'aspirin',
  // Antibiotics
  'amoxicillin', 'moxclav', 'augmentin', 'azithromycin', 'azee', 'zithromax',
  'ciprofloxacin', 'ciplox', 'ofloxacin', 'cefixime', 'taxim',
  'metronidazole', 'flagyl', 'levofloxacin',
  // Diabetes
  'metformin', 'glycomet', 'glucophage', 'glimepiride', 'amaryl',
  'sitagliptin', 'januvia', 'vildagliptin', 'galvus', 'insulin',
  // BP/Heart
  'amlodipine', 'amlong', 'stamlo', 'atenolol', 'metoprolol',
  'telmisartan', 'telma', 'losartan', 'enalapril', 'ramipril',
  // Stomach
  'pantoprazole', 'pan', 'pantocid', 'omeprazole', 'ranitidine',
  'domperidone', 'domstal', 'ondansetron', 'emeset',
  // Vitamins
  'vitamin', 'multivitamin', 'b12', 'b-complex', 'folic acid',
  'calcium', 'iron', 'zinc', 'vitamin d', 'vitamin c',
  // Others
  'cetirizine', 'allegra', 'montair', 'montelukast', 'levocetrizine',
  'salbutamol', 'deriphyllin', 'theophylline',
]

/**
 * Parse medicine names from OCR text
 */
export function parseMedicines(ocrText: string): ParsedMedicine[] {
  const medicines: ParsedMedicine[] = []
  const lines = ocrText.split('\n').filter(line => line.trim().length > 0)

  for (const line of lines) {
    const trimmedLine = line.trim()
    const lowerLine = trimmedLine.toLowerCase()

    // Skip very short lines or lines that look like headers
    if (trimmedLine.length < 3) continue
    if (/^(rx|prescription|date|patient|dr\.|doctor|address|phone|mobile)/i.test(trimmedLine)) continue

    // Check if line contains medicine indicators
    const hasMedicineForm = MEDICINE_FORMS.some(form => lowerLine.includes(form))
    const hasDosage = DOSAGE_PATTERNS.some(pattern => pattern.test(trimmedLine))
    const hasMedicineKeyword = MEDICINE_KEYWORDS.some(keyword => lowerLine.includes(keyword))

    // Reset regex lastIndex
    DOSAGE_PATTERNS.forEach(p => p.lastIndex = 0)

    if (hasMedicineForm || hasDosage || hasMedicineKeyword) {
      const parsed = parseMedicineLine(trimmedLine)
      if (parsed) {
        medicines.push(parsed)
      }
    }
  }

  return medicines
}

/**
 * Parse a single line to extract medicine details
 */
function parseMedicineLine(line: string): ParsedMedicine | null {
  // Extract dosage
  let dosage: string | undefined
  for (const pattern of DOSAGE_PATTERNS) {
    pattern.lastIndex = 0
    const match = pattern.exec(line)
    if (match) {
      dosage = match[0]
      break
    }
  }

  // Extract form
  let form: string | undefined
  const lowerLine = line.toLowerCase()
  for (const f of MEDICINE_FORMS) {
    if (lowerLine.includes(f)) {
      form = f
      break
    }
  }

  // Extract frequency
  let frequency: string | undefined
  for (const pattern of FREQUENCY_PATTERNS) {
    pattern.lastIndex = 0
    const match = pattern.exec(line)
    if (match) {
      frequency = match[0]
      break
    }
  }

  // Extract quantity (look for numbers like x10, x30, qty:10)
  let quantity: string | undefined
  const qtyMatch = line.match(/(?:x|qty[:\s]*|quantity[:\s]*)(\d+)/i)
  if (qtyMatch) {
    quantity = qtyMatch[1]
  }

  // Extract medicine name (first part before dosage/form/numbers)
  let name = line
    .replace(/\d+\.?\d*\s*(mg|mcg|g|ml|iu|u|%)/gi, '')
    .replace(new RegExp(MEDICINE_FORMS.join('|'), 'gi'), '')
    .replace(/\b(od|bd|tds|qid|hs|sos|prn|stat)\b/gi, '')
    .replace(/\b(once|twice|thrice)\s*(daily|a day)\b/gi, '')
    .replace(/\b\d+\s*x\s*\d+\b/gi, '')
    .replace(/x\d+/gi, '')
    .replace(/qty[:\s]*\d+/gi, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // If name is too short or empty, skip
  if (name.length < 2) return null

  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return {
    name,
    dosage,
    form,
    quantity,
    frequency,
    rawText: line,
  }
}

/**
 * Clean and normalize medicine name for database matching
 */
export function normalizeMedicineName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
