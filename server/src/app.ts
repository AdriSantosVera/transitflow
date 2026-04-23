import express from 'express'
import { swaggerSpec } from './docs/openapi.js'
import healthRouter from './routes/health.routes.js'
import favoritesRouter from './routes/favorites.routes.js'
import tripsRouter from './routes/trips.routes.js'
import placesRouter from './routes/places.routes.js'
import expensesRouter from './routes/expenses.routes.js'
import savingsRouter from './routes/savings.routes.js'
import notesRouter from './routes/notes.routes.js'

const app = express()

function renderSwaggerHtml(specUrl: string) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TransitFlow API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #0f172a; }
      #swagger-ui { max-width: 1200px; margin: 0 auto; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '${specUrl}',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    </script>
  </body>
</html>`
}

app.use(express.json())
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec)
})
app.get('/api/docs', (_req, res) => {
  res.type('html').send(renderSwaggerHtml('/api/docs.json'))
})
app.get('/api/docs/', (_req, res) => {
  res.type('html').send(renderSwaggerHtml('/api/docs.json'))
})
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
app.get('/docs', (_req, res) => {
  res.type('html').send(renderSwaggerHtml('/api/docs.json'))
})
app.get('/docs/', (_req, res) => {
  res.type('html').send(renderSwaggerHtml('/api/docs.json'))
})
app.use('/', healthRouter)
app.use('/', favoritesRouter)
app.use('/', tripsRouter)
app.use('/', placesRouter)
app.use('/', expensesRouter)
app.use('/', savingsRouter)
app.use('/', notesRouter)

export default app
