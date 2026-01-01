import { NextRequest, NextResponse } from 'next/server'
import Tesseract from 'tesseract.js'
import { parseMedicines, ParsedMedicine } from '@/lib/medicine-parser'
import { supabase } from '@/lib/supabase'

export interface OCRResponse {
  success: boolean
  medicines: ParsedMedicine[]
  matchedMedicines: MatchedMedicine[]
  rawText: string
  confidence: number
  error?: string
}

interface MatchedMedicine {
  id: string
  name: string
  price: number
  manufacturer: string
  pharmacyId: string
  pharmacyName: string
  inStock: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    console.log('Starting OCR for image:', imageUrl)

    // Perform OCR using Tesseract.js
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: (info) => {
        if (info.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`)
        }
      },
    })

    const rawText = result.data.text
    const confidence = result.data.confidence

    console.log('OCR Raw Text:', rawText)
    console.log('OCR Confidence:', confidence)

    // Parse medicines from OCR text
    const medicines = parseMedicines(rawText)
    console.log('Parsed Medicines:', medicines)

    // Try to match with database medicines
    const matchedMedicines: MatchedMedicine[] = []

    if (medicines.length > 0) {
      // Search for each parsed medicine in database
      for (const med of medicines) {
        const searchTerm = med.name.toLowerCase()

        const { data: dbMedicines } = await supabase
          .from('Medicine')
          .select(`
            id,
            name,
            price,
            manufacturer,
            pharmacyId,
            inStock,
            pharmacy:Pharmacy!inner(id, businessName)
          `)
          .ilike('name', `%${searchTerm}%`)
          .eq('inStock', true)
          .limit(3)

        if (dbMedicines && dbMedicines.length > 0) {
          for (const dbMed of dbMedicines as any[]) {
            // Avoid duplicates
            if (!matchedMedicines.find(m => m.id === dbMed.id)) {
              const pharmacy = Array.isArray(dbMed.pharmacy) ? dbMed.pharmacy[0] : dbMed.pharmacy
              matchedMedicines.push({
                id: dbMed.id,
                name: dbMed.name,
                price: dbMed.price,
                manufacturer: dbMed.manufacturer || '',
                pharmacyId: dbMed.pharmacyId,
                pharmacyName: pharmacy?.businessName || '',
                inStock: dbMed.inStock,
              })
            }
          }
        }
      }
    }

    const response: OCRResponse = {
      success: true,
      medicines,
      matchedMedicines,
      rawText,
      confidence,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('OCR Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'OCR processing failed',
        medicines: [],
        matchedMedicines: [],
        rawText: '',
        confidence: 0,
      },
      { status: 500 }
    )
  }
}
