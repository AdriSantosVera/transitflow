import app from '../server/src/app.js'
import { ensureAppBootstrapped } from '../server/src/lib/bootstrap.js'

export default async function handleAppRequest(req: any, res: any) {
  await ensureAppBootstrapped()
  return app(req, res)
}
