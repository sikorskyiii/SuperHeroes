import { fileURLToPath } from 'url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export const BACKEND_ROOT       = path.resolve(__dirname, '..', '..')
export const UPLOADS_DIR        = path.join(BACKEND_ROOT, 'uploads') 
export const PUBLIC_UPLOADS_URL = '/uploads'                  
