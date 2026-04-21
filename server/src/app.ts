import express from 'express'
import healthRouter from './routes/health.routes'
import transportsRouter from './routes/transports.routes'
import favoritesRouter from './routes/favorites.routes'
import busesRouter from './routes/buses.routes'
import trainsRouter from './routes/trains.routes'

const app = express()

app.use(express.json())
app.use('/api', healthRouter)
app.use('/api/v1', transportsRouter)
app.use('/api/v1', favoritesRouter)
app.use('/api/v1', busesRouter)
app.use('/api/v1', trainsRouter)

export default app
