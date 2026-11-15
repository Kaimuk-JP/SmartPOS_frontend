
import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ucojjyitjovttbhdpuys.supabase.co'
// ตั้งเป็น "/" ได้ = ใช้โดเมนเดียวกับหน้าเว็บ (เช่น self-host ผ่าน nginx ที่มี /rest/v1) ไม่ต้อง build ใหม่เมื่อเปลี่ยนที่อยู่
const supabaseUrl = rawSupabaseUrl.startsWith('/')
  ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000')
  : rawSupabaseUrl
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjb2pqeWl0am92dHRiaGRwdXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTIyMDcsImV4cCI6MjA4NTY2ODIwN30.utT4rgjU9js68eumoXcjdkNxH_7zo-_qckcYDjK3vfk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
