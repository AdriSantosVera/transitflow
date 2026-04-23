import { config } from './config/env'
import app from './app'
import { ensureAppBootstrapped } from './lib/bootstrap'

await ensureAppBootstrapped()

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`)
})
