import path from 'node:path'
import { config as loadEnvFile } from 'dotenv'

const projectRoot = process.cwd()

// Load generic env first, then local overrides.
loadEnvFile({ path: path.resolve(projectRoot, '.env') })
loadEnvFile({
  path: path.resolve(projectRoot, '.env.local'),
  override: true,
})

export const config = {
  port: Number(process.env.PORT ?? 3001),
}
