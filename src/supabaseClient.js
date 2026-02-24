import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygexyftugtqcklnrlrgf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZXh5ZnR1Z3RxY2tsbnJscmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODgzNDgsImV4cCI6MjA4NjI2NDM0OH0.ZP7Sx64y58nRL5uNGpH-L3dJ42GO0IluIe7RcdtkphQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)