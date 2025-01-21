import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ixyuablustlfypjnjhpw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eXVhYmx1c3RsZnlwam5qaHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNzE5MTUsImV4cCI6MjA1MTk0NzkxNX0.fGcTpTRp4A7ivAn8CZRxDKly3acG-ofYN50dOJVDZ9A'

export const supabase = createClient(supabaseUrl, supabaseKey)