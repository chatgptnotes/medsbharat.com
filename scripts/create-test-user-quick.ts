#!/usr/bin/env tsx

import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    console.log('🔐 Creating test user with direct Supabase client...')
    
    const email = 'bhupendra@gmail.com'
    const password = 'password123'
    const passwordHash = await bcrypt.hash(password, 12)

    // Delete existing user if exists
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', email)

    if (deleteError) {
      console.log('Note: User may not exist, proceeding...', deleteError.message)
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: email,
        name: 'Bhupendra Kumar',
        phone: '+911234567890',
        role: 'PATIENT',
        passwordHash: passwordHash,
        emailVerified: new Date().toISOString(),
        phoneVerified: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('❌ Error creating user:', error)
      return
    }

    console.log('✅ Test user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('🔗 Login URL: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Script failed:', error)
  }
}

createTestUser()