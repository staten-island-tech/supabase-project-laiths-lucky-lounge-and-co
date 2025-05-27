import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ybetyvacvjkrmmikwnkl.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZXR5dmFjdmprcm1taWt3bmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDQ3OTUsImV4cCI6MjA2MjgyMDc5NX0.Z9nerzQGJmCm8ICzzsecbhLHdtRJMVnLZjElMuuChyQ'
export const supabase = createClient(supabaseUrl, supabaseKey)
