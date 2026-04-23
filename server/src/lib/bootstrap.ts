import { ensureDatabaseSeeded } from './seed.js'

let bootstrapPromise: Promise<void> | null = null

export async function ensureAppBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = ensureDatabaseSeeded()
  }

  await bootstrapPromise
}
