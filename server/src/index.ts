import express from 'express'
import { config } from './config/env'
import healthRouter from './routes/health.routes'

const app = express()

app.use('/api', healthRouter)

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`)
})
