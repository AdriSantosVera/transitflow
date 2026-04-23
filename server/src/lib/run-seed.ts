import { ensureDatabaseSeeded } from './seed.js'
import { prisma } from './prisma.js'

async function main() {
  await ensureDatabaseSeeded()
  console.log('Database seed completed')
}

main()
  .catch((error) => {
    console.error('Database seed failed')
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
