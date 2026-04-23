import { config } from './config/env.js'
import app from './app.js'
import { ensureAppBootstrapped } from './lib/bootstrap.js'

await ensureAppBootstrapped()

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`)
})
