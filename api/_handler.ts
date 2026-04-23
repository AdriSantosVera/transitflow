import app from '../server/src/app'
import { ensureAppBootstrapped } from '../server/src/lib/bootstrap'

export default async function handleAppRequest(req: any, res: any) {
  await ensureAppBootstrapped()
  return app(req, res)
}
