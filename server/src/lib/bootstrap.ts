import { ensureDatabaseSeeded } from './seed'

let bootstrapPromise: Promise<void> | null = null

export async function ensureAppBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = ensureDatabaseSeeded()
  }

  await bootstrapPromise
}
