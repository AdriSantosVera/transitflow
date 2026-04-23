import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/openapi'
import healthRouter from './routes/health.routes'
import favoritesRouter from './routes/favorites.routes'
import tripsRouter from './routes/trips.routes'
import placesRouter from './routes/places.routes'
import expensesRouter from './routes/expenses.routes'
import savingsRouter from './routes/savings.routes'
import notesRouter from './routes/notes.routes'

const app = express()

app.use(express.json())
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec)
})
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', healthRouter)
app.use('/api/v1', favoritesRouter)
app.use('/api/v1', tripsRouter)
app.use('/api/v1', placesRouter)
app.use('/api/v1', expensesRouter)
app.use('/api/v1', savingsRouter)
app.use('/api/v1', notesRouter)

// Vercel Functions may pass a trimmed path depending on function entrypoint.
// Mounting routers at root keeps local behavior and avoids 404 in serverless path normalization.
app.get('/docs.json', (_req, res) => {
  res.json(swaggerSpec)
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/', healthRouter)
app.use('/', favoritesRouter)
app.use('/', tripsRouter)
app.use('/', placesRouter)
app.use('/', expensesRouter)
app.use('/', savingsRouter)
app.use('/', notesRouter)

export default app
